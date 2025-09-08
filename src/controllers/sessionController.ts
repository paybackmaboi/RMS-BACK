import { Request, Response, NextFunction } from 'express';
import { UserModel, UserSessionModel } from '../database';
import { logActivity } from './activityLogController';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

/**
 * Extended Express Request interface with user information
 */
interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

/**
 * Generate a secure session token using crypto
 * @returns {string} A 64-character hexadecimal token
 */
const generateSessionToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Create a new session for a user
 * @param {number} userId - The user ID to create session for
 * @param {number} expiresInHours - Hours until session expires (default: 87600 = 10 years)
 * @returns {Promise<string>} The generated session token
 */
export const createSession = async (userId: number, expiresInHours: number = 87600): Promise<string> => {
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    await UserSessionModel.create({
        userId,
        sessionToken,
        expiresAt
    });

    return sessionToken;
};

// Login and create session
export const loginAndCreateSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { idNumber, password } = req.body;

        if (!idNumber || !password) {
            res.status(400).json({ message: 'ID Number and password are required' });
            return;
        }

        // Find user by ID number
        const user = await UserModel.findOne({
            where: { idNumber, isActive: true }
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Create session
        const sessionToken = await createSession(user.id);

        // Return user info and session token
        // Log successful login activity
        await logActivity(
            user.id, 
            'login', 
            `User ${user.idNumber} logged in successfully via session`,
            req,
            { role: user.role, loginMethod: 'session' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                idNumber: user.idNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            sessionToken,
            expiresIn: '10 years'
        });

    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

// Logout and destroy session
export const logoutAndDestroySession = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sessionToken = req.cookies?.sessionToken || req.headers['x-session-token'] as string;
        
        if (sessionToken) {
            // Find the session to get user info before destroying
            // First find the session
            const session = await UserSessionModel.findOne({
                where: { sessionToken }
            });

            if (session) {
                // Then get the user separately since we don't have a direct association
                const user = await UserModel.findByPk(session.userId);
                if (user) {
                    // Log logout activity
                    await logActivity(
                        session.userId, 
                        'logout', 
                        `User ${user.idNumber} logged out`,
                        req,
                        { role: user.role }
                    );
                }
            }

            await UserSessionModel.destroy({
                where: { sessionToken }
            });
        }

        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        next(error);
    }
};

// Get current session info
export const getCurrentSession = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        res.json({
            user: req.user,
            authenticated: true
        });
    } catch (error) {
        console.error('Get session error:', error);
        next(error);
    }
};
// Refresh session if it's close to expiring
export const refreshSession = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sessionToken = req.cookies?.sessionToken || req.headers['x-session-token'] as string;
        
        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }

        // Find the session
        const session = await UserSessionModel.findOne({
            where: { sessionToken }
        });

        if (!session) {
            res.status(401).json({ message: 'Invalid session' });
            return;
        }

        // Check if session expires within the next 30 days
        const now = new Date();
        const expiresIn30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        if (session.expiresAt <= expiresIn30Days) {
            // Extend session by 10 years
            const newExpiresAt = new Date();
            newExpiresAt.setHours(newExpiresAt.getHours() + 87600);
            
            await session.update({ expiresAt: newExpiresAt });
            
            res.json({
                message: 'Session refreshed',
                sessionToken: sessionToken, // Return the same session token
                expiresAt: newExpiresAt
            });
        } else {
            res.json({
                message: 'Session is still valid',
                sessionToken: sessionToken, // Return the same session token
                expiresAt: session.expiresAt
            });
        }
    } catch (error) {
        console.error('Session refresh error:', error);
        next(error);
    }
};

import { Request, Response, NextFunction } from 'express';
import { UserModel, UserSessionModel, LoginHistoryModel } from '../database';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

// Generate a secure session token
const generateSessionToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

// Helper function to log login/logout events
const logUserAction = async (userId: number, action: 'login' | 'logout', req: Request): Promise<void> => {
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                         (req.connection as any)?.socket?.remoteAddress || 'unknown';
        const userAgent = req.get('User-Agent') || 'unknown';

        await LoginHistoryModel.create({
            userId,
            action,
            ipAddress,
            userAgent
        });
    } catch (error) {
        console.error('Error logging user action:', error);
        // Don't throw error to avoid breaking the main flow
    }
};

// Create a new session for a user
export const createSession = async (userId: number, expiresInHours: number = 168): Promise<string> => {
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours); // 168 hours = 7 days

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
        // const isValidPassword = await bcrypt.compare(password, user.password);
        // if (!isValidPassword) {
        //     res.status(401).json({ message: 'Invalid credentials' });
        //     return;
        // }

        // Create session
        const sessionToken = await createSession(user.id);

        // Log login event
        await logUserAction(user.id, 'login', req);

        // Return user info and session token
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
            expiresIn: '24 hours'
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
            // Get user ID before destroying session
            const session = await UserSessionModel.findOne({
                where: { sessionToken }
            });

            if (session) {
                // Log logout event
                await logUserAction(session.userId, 'logout', req);
                
                // Destroy session
                await UserSessionModel.destroy({
                    where: { sessionToken }
                });
            }
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

        // Check if session expires within the next 24 hours
        const now = new Date();
        const expiresIn24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        if (session.expiresAt <= expiresIn24Hours) {
            // Extend session by 7 days
            const newExpiresAt = new Date();
            newExpiresAt.setHours(newExpiresAt.getHours() + 168);
            
            await session.update({ expiresAt: newExpiresAt });
            
            res.json({
                message: 'Session refreshed',
                expiresAt: newExpiresAt
            });
        } else {
            res.json({
                message: 'Session is still valid',
                expiresAt: session.expiresAt
            });
        }
    } catch (error) {
        console.error('Session refresh error:', error);
        next(error);
    }
};

// Get login/logout history for a user
export const getLoginHistory = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const { page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const history = await LoginHistoryModel.findAndCountAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset: offset
        });

        // Format the response
        const formattedHistory = history.rows.map(record => ({
            id: record.id,
            action: record.action,
            date: record.createdAt.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit'
            }),
            time: record.createdAt.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            ipAddress: record.ipAddress,
            userAgent: record.userAgent
        }));

        res.json({
            history: formattedHistory,
            totalCount: history.count,
            currentPage: Number(page),
            totalPages: Math.ceil(history.count / Number(limit))
        });

    } catch (error) {
        console.error('Get login history error:', error);
        next(error);
    }
};

// Get login/logout history for a specific student (admin only)
export const getStudentLoginHistory = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ message: 'Access restricted to administrators only' });
            return;
        }

        const { studentId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        if (!studentId) {
            res.status(400).json({ message: 'Student ID is required' });
            return;
        }

        const history = await LoginHistoryModel.findAndCountAll({
            where: { userId: studentId },
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset: offset
        });

        // Format the response
        const formattedHistory = history.rows.map(record => ({
            id: record.id,
            action: record.action,
            date: record.createdAt.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit'
            }),
            time: record.createdAt.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            ipAddress: record.ipAddress,
            userAgent: record.userAgent
        }));

        res.json({
            history: formattedHistory,
            totalCount: history.count,
            currentPage: Number(page),
            totalPages: Math.ceil(history.count / Number(limit))
        });

    } catch (error) {
        console.error('Get student login history error:', error);
        next(error);
    }
};

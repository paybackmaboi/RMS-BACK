import { Request, Response, NextFunction } from 'express';
import { UserModel, UserSessionModel } from '../database';
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

// Create a new session for a user
export const createSession = async (userId: number, expiresInHours: number = 24): Promise<string> => {
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

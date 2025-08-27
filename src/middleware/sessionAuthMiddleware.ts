import { Request, Response, NextFunction } from 'express';
import { UserSessionModel, UserModel } from '../database';
import { Op } from 'sequelize';



export const sessionAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get session token from cookies or headers
        const sessionToken = req.cookies?.sessionToken || req.headers['x-session-token'] as string;
        
        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }

        // Find valid session in database
        const session = await UserSessionModel.findOne({
            where: {
                sessionToken: sessionToken,
                expiresAt: {
                    [Op.gt]: new Date() // expiresAt > current time
                }
            }
        });

        if (!session) {
            res.status(401).json({ message: 'Invalid or expired session' });
            return;
        }

        // Get user details separately
        const user = await UserModel.findByPk(session.userId);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Set user info in request
        req.user = {
            id: session.userId,
            role: user.role,
            idNumber: user.idNumber,
            firstName: user.firstName,
            lastName: user.lastName
        };

        console.log('✅ Student session auth successful - User set:', req.user);
        next();
    } catch (error) {
        console.error('Session auth error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
};

export const adminSessionAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // First authenticate the session
        const sessionToken = req.cookies?.sessionToken || req.headers['x-session-token'] as string;
        
        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }

        // Find valid session in database
        const session = await UserSessionModel.findOne({
            where: {
                sessionToken: sessionToken,
                expiresAt: {
                    [Op.gt]: new Date() // expiresAt > current time
                }
            }
        });

        if (!session) {
            res.status(401).json({ message: 'Invalid or expired session' });
            return;
        }

        // Get user details separately
        const user = await UserModel.findByPk(session.userId);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Check if user is an admin
        if (user.role !== 'admin') {
            res.status(403).json({ message: 'Access restricted to administrators only' });
            return;
        }

        // Set user info in request
        req.user = {
            id: session.userId,
            role: user.role,
            idNumber: user.idNumber,
            firstName: user.firstName,
            lastName: user.lastName
        };

        next();
    } catch (error) {
        console.error('Admin session auth error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
};

export const studentSessionAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get session token from cookies or headers
        const sessionToken = req.cookies?.sessionToken || req.headers['x-session-token'] as string;
        
        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }

        // Find valid session in database
        const session = await UserSessionModel.findOne({
            where: {
                sessionToken: sessionToken,
                expiresAt: {
                    [Op.gt]: new Date() // expiresAt > current time
                }
            }
        });

        if (!session) {
            res.status(401).json({ message: 'Invalid or expired session' });
            return;
        }

        // Get user details separately
        const user = await UserModel.findByPk(session.userId);
        
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Check if user is a student or admin (admins can also access student data)
        if (user.role !== 'student' && user.role !== 'admin') {
            res.status(403).json({ message: 'Access restricted to students and administrators only' });
            return;
        }

        // Set user info in request
        req.user = {
            id: session.userId,
            role: user.role,
            idNumber: user.idNumber,
            firstName: user.firstName,
            lastName: user.lastName
        };

        next();
    } catch (error) {
        console.error('Student session auth error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
};

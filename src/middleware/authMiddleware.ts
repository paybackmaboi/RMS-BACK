import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: 'student' | 'admin';
            };
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'student' | 'admin' };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Forbidden: Access is restricted to administrators' });
        return;
    }
    next();
};

// This empty export ensures the file is treated as a module.
export {};
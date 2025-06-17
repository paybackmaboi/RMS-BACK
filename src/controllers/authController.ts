import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../database';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * FIX: The function signature was changed to explicitly define parameter types and a return type of Promise<void>.
 * This avoids the type conflict with the stricter 'RequestHandler' type.
 * 'RequestHandler' was removed from the function definition.
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { idNumber, password } = req.body;

    try {
        const user = await User.findOne({ where: { idNumber } });

        if (!user) {
            // FIX: Removed 'return' from res.json() to prevent the function from returning a 'Response' object.
            res.status(400).json({ message: 'Invalid ID Number or password.' });
            return; // Explicitly return to exit the function.
        }

        // NOTE: Using '(user as any)' to call a custom method. Ensure 'comparePassword' exists on your User model.
        const isMatch = await (user as any).comparePassword(password);

        if (!isMatch) {
            // FIX: Removed 'return' here as well.
            res.status(400).json({ message: 'Invalid ID Number or password.' });
            return; // Explicitly return to exit the function.
        }

        const token = jwt.sign(
            // NOTE: Using '(user as any)' to access model properties.
            { id: (user as any).id, idNumber: (user as any).idNumber, role: (user as any).role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: (user as any).id, idNumber: (user as any).idNumber, role: (user as any).role } });

    } catch (error) {
        console.error('Login error:', error);
        next(error); // Pass the error to the error-handling middleware
    }
};

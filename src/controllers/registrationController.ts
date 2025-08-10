import { Request, Response, NextFunction } from 'express';
import { User } from '../database';
import bcrypt from 'bcryptjs';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

export const createStudentRegistration = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            idNumber,
            password,
            firstName,
            lastName,
            middleName,
            email,
            phoneNumber,
            courseId
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { idNumber } });
        if (existingUser) {
            res.status(400).json({ message: 'User with this ID number already exists.' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user first
        const newUser = await User.create({
            idNumber,
            password: hashedPassword,
            firstName,
            lastName,
            middleName,
            email,
            phoneNumber,
            role: 'student',
            isActive: true
        });

        res.status(201).json({
            message: 'Student account created successfully. Please complete your registration.',
            user: {
                id: newUser.id,
                idNumber: newUser.idNumber,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role
            }
        });
    } catch (error) {
        next(error);
    }
};
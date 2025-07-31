import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { User as UserModel } from '../database';
import { Op } from 'sequelize';

// Helper function to generate a new random password
const generatePassword = (length: number = 6): string => {
    return Math.random().toString().substring(2, 2 + length);
};

// This function will fetch all users with the 'student' role
export const getAllStudentAccounts = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const studentAccounts = await UserModel.findAll({
            where: { role: 'student' },
            attributes: ['id', 'idNumber', 'firstName', 'lastName', 'middleName', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
        res.json(studentAccounts);
    } catch (error) {
        next(error);
    }
};

// --- START: Add this new function ---
export const resetStudentPassword = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByPk(id);

        if (!user || user.role !== 'student') {
            res.status(404).json({ message: 'Student account not found.' });
            return;
        }

        const newPassword = generatePassword();
        
        // The beforeUpdate hook in your User model will automatically hash this new password
        user.password = newPassword;
        await user.save();

        // Return the new, un-hashed password to the admin
        res.json({
            message: 'Password reset successfully.',
            idNumber: user.idNumber,
            newPassword: newPassword,
        });

    } catch (error) {
        next(error);
    }
};
// --- END: Add this new function ---
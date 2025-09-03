import { Request, Response, NextFunction } from 'express';
import { AccountingModel, UserModel } from '../database';

// Define a custom request type that includes the user session property
interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

/**
 * @description Get a specific student's balance by their user ID. For admin/accounting use.
 */
export const getStudentBalanceById = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params;
        const accounting = await AccountingModel.findOne({ where: { studentId: studentId } });

        const balance = accounting ? accounting.balance : 0.00;
        res.json({ tuitionBalance: balance });

    } catch (error) {
        console.error('Error fetching student balance by ID:', error);
        next(error);
    }
};

/**
 * @description Get the currently logged-in student's own balance. For student use.
 */
export const getMyBalance = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const accounting = await AccountingModel.findOne({ where: { studentId: userId } });
        const balance = accounting ? accounting.balance : 0.00;

        res.json({ tuitionBalance: balance });

    } catch (error) {
        console.error('Error fetching current student balance:', error);
        next(error);
    }
};


/**
 * @description Update a student's tuition balance. For admin/accounting use.
 */
export const updateStudentBalance = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params; // This is the user ID of the student
        const { newBalance } = req.body;

        if (newBalance === undefined || isNaN(parseFloat(newBalance))) {
            res.status(400).json({ message: 'A valid new balance is required.' });
            return;
        }
        
        // Use findOrCreate to handle students who don't have an accounting record yet
        const [accounting, created] = await AccountingModel.findOrCreate({
            where: { studentId: parseInt(studentId, 10) },
            defaults: {
                studentId: parseInt(studentId, 10),
                balance: parseFloat(newBalance)
            }
        });

        // If the record was not new, update it
        if (!created) {
            await accounting.update({ balance: parseFloat(newBalance) });
        }

        res.json({
            message: 'Student balance updated successfully.',
            updatedBalance: accounting.balance
        });

    } catch (error) {
        console.error('Error updating student balance:', error);
        next(error);
    }
};
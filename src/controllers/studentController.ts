import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { User as UserModel } from '../database';

// Helper function to generate a unique ID Number
const generateIdNumber = async (): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const lastUser = await UserModel.findOne({
        where: { idNumber: { [require('sequelize').Op.like]: `${currentYear}-%` } },
        order: [['idNumber', 'DESC']],
    });

    let newSequence = 1;
    if (lastUser) {
        const lastSequence = parseInt(lastUser.idNumber.split('-')[1], 10);
        newSequence = lastSequence + 1;
    }
    // Formats the number to be 4 digits, e.g., 1 becomes 0001
    return `${currentYear}-${String(newSequence).padStart(4, '0')}`;
};

// Helper function to generate a random password
const generatePassword = (length: number = 6): string => {
    return Math.random().toString().substring(2, 2 + length);
};

export const createAndEnrollStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { firstName, lastName, middleName, gender, course } = req.body;

        if (!firstName || !lastName || !course) {
            res.status(400).json({ message: 'First name, last name, and course are required.' });
            return;
        }

        const idNumber = await generateIdNumber();
        const password = generatePassword();

        
        const newUser = await UserModel.create({
            idNumber,
            password,
            role: 'student',
            firstName,      
            lastName,       
            middleName,     
            course,
        });
        
        res.status(201).json({
            message: 'Student account created successfully!',
            user: {
                id: newUser.id,
                idNumber: newUser.idNumber,
                password: password,
                name: `${lastName}, ${firstName} ${middleName || ''}`,
                gender,
                course,
            },
        });

    } catch (error) {
        next(error);
    }
};
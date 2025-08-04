import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Student } from '../database';

// Controller to handle the new student registration
export const registerStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get the ID of the currently logged-in user from the auth middleware
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: You must be logged in to register.' });
            return;
        }
        
        // Check if this user already has a student record
        const existingStudent = await Student.findOne({ where: { userId } });
        if (existingStudent) {
            res.status(400).json({ message: 'This user has already completed their registration.' });
            return;
        }

        // Get the personal data from the form
        const {
            gender,
            dateOfBirth,
            placeOfBirth,
            civilStatus,
            religion,
            parentGuardian,
            permanentAddress,
            previousSchool,
            yearOfEntry
        } = req.body;

        // Create the detailed student record and associate it with the logged-in user
        const newStudent = await Student.create({
            userId, // Use the ID from the logged-in user
            gender,
            dateOfBirth,
            placeOfBirth,
            civilStatus,
            religion,
            parentGuardian,
            permanentAddress,
            previousSchool,
            yearOfEntry
        });

        res.status(201).json({ message: 'Student registered successfully!', studentId: newStudent.id });

    } catch (error) {
        next(error);
    }
};
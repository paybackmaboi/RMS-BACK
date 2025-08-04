import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Enrollment as EnrollmentModel, User, Schedule, Subject } from '../database';

export const createEnrollment = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId, scheduleId } = req.body;
        const userId = req.user?.id;

        if (!studentId || !scheduleId) {
            res.status(400).json({ message: 'Student ID and Schedule ID are required.' });
            return;
        }

        // Check if enrollment already exists
        const existingEnrollment = await EnrollmentModel.findOne({
            where: { studentId, scheduleId }
        });

        if (existingEnrollment) {
            res.status(400).json({ message: 'Student is already enrolled in this schedule.' });
            return;
        }

        const enrollment = await EnrollmentModel.create({
            studentId,
            scheduleId,
            status: 'enrolled',
            enrollmentDate: new Date()
        });

        res.status(201).json(enrollment);
    } catch (error) {
        next(error);
    }
};

export const getEnrollments = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const enrollments = await EnrollmentModel.findAll({
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['idNumber', 'firstName', 'lastName', 'middleName', 'course']
                },
                {
                    model: Schedule,
                    as: 'schedule',
                    include: [{
                        model: Subject,
                        as: 'subject'
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

export const getStudentEnrollments = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const enrollments = await EnrollmentModel.findAll({
            where: { studentId: userId },
            include: [
                {
                    model: Schedule,
                    as: 'schedule',
                    include: [{
                        model: Subject,
                        as: 'subject'
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

export const getEnrollmentById = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        const enrollment = await EnrollmentModel.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['idNumber', 'firstName', 'lastName', 'middleName', 'course']
                },
                {
                    model: Schedule,
                    as: 'schedule',
                    include: [{
                        model: Subject,
                        as: 'subject'
                    }]
                }
            ]
        });

        if (!enrollment) {
            res.status(404).json({ message: 'Enrollment not found.' });
            return;
        }

        // Students can only view their own enrollments
        if (userRole === 'student' && enrollment.studentId !== userId) {
            res.status(403).json({ message: 'Access denied.' });
            return;
        }

        res.json(enrollment);
    } catch (error) {
        next(error);
    }
};

export const updateEnrollment = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const enrollment = await EnrollmentModel.findByPk(id);
        if (!enrollment) {
            res.status(404).json({ message: 'Enrollment not found.' });
            return;
        }

        await enrollment.update({ status });
        res.json({ message: 'Enrollment updated successfully.', enrollment });
    } catch (error) {
        next(error);
    }
};

export const deleteEnrollment = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const enrollment = await EnrollmentModel.findByPk(id);
        if (!enrollment) {
            res.status(404).json({ message: 'Enrollment not found.' });
            return;
        }

        await enrollment.destroy();
        res.json({ message: 'Enrollment deleted successfully.' });
    } catch (error) {
        next(error);
    }
}; 
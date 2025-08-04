import { Request, Response, NextFunction } from 'express';
import { Schedule, Subject, SchoolYear, Semester, User } from '../database';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

export const getAllSchedules = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const schedules = await Schedule.findAll({
            include: [
                { model: Subject, as: 'subject' },
                { model: SchoolYear, as: 'schoolYear' },
                { model: Semester, as: 'semester' }
            ],
            where: { isActive: true }
        });
        res.json(schedules);
    } catch (error) {
        next(error);
    }
};

export const getScheduleById = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const schedule = await Schedule.findByPk(id, {
            include: [
                { model: Subject, as: 'subject' },
                { model: SchoolYear, as: 'schoolYear' },
                { model: Semester, as: 'semester' }
            ]
        });

        if (!schedule) {
            res.status(404).json({ message: 'Schedule not found.' });
            return;
        }

        res.json(schedule);
    } catch (error) {
        next(error);
    }
};

export const getSchedulesBySubject = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { subjectId } = req.params;
        const schedules = await Schedule.findAll({
            where: { subjectId, isActive: true },
            include: [
                { model: Subject, as: 'subject' },
                { model: SchoolYear, as: 'schoolYear' },
                { model: Semester, as: 'semester' }
            ]
        });
        res.json(schedules);
    } catch (error) {
        next(error);
    }
};

export const createSchedule = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            subjectId,
            schoolYearId,
            semesterId,
            dayOfWeek,
            startTime,
            endTime,
            room,
            maxStudents
        } = req.body;

        // Validate required fields
        if (!subjectId || !schoolYearId || !semesterId || !dayOfWeek || !startTime || !endTime) {
            res.status(400).json({ message: 'Missing required fields.' });
            return;
        }

        const schedule = await Schedule.create({
            subjectId,
            schoolYearId,
            semesterId,
            dayOfWeek,
            startTime,
            endTime,
            room,
            maxStudents: maxStudents || 50,
            currentEnrolled: 0,
            isActive: true
        });

        res.status(201).json(schedule);
    } catch (error) {
        next(error);
    }
};

export const updateSchedule = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            res.status(404).json({ message: 'Schedule not found.' });
            return;
        }

        await schedule.update(updateData);
        res.json(schedule);
    } catch (error) {
        next(error);
    }
};

export const deleteSchedule = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            res.status(404).json({ message: 'Schedule not found.' });
            return;
        }

        await schedule.update({ isActive: false });
        res.json({ message: 'Schedule deleted successfully.' });
    } catch (error) {
        next(error);
    }
}; 
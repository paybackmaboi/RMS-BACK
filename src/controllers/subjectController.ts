import { Request, Response, NextFunction } from 'express';
import { SubjectModel, CourseModel } from '../database';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

export const getAllSubjects = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const subjects = await SubjectModel.findAll({
            include: [
                {
                    model: CourseModel,
                    as: 'course'
                }
            ],
            where: { isActive: true }
        });
        res.json(subjects);
    } catch (error) {
        next(error);
    }
};

export const getSubjectById = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const subject = await SubjectModel.findByPk(id, {
            include: [
                {
                    model: CourseModel,
                    as: 'course'
                }
            ]
        });

        if (!subject) {
            res.status(404).json({ message: 'Subject not found.' });
            return;
        }

        res.json(subject);
    } catch (error) {
        next(error);
    }
};

export const getSubjectsByCourse = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { course } = req.params;
        
        const subjects = await SubjectModel.findAll({
            include: [
                {
                    model: CourseModel,
                    as: 'course',
                    where: { code: course }
                }
            ],
            where: { isActive: true }
        });

        res.json(subjects);
    } catch (error) {
        next(error);
    }
};

export const createSubject = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            code,
            name,
            description,
            units,
            courseId,
            yearLevel,
            semester,
            subjectType
        } = req.body;

        if (!code || !name || !units || !courseId || !yearLevel || !semester) {
            res.status(400).json({ message: 'Missing required fields.' });
            return;
        }

        const subject = await SubjectModel.create({
            code,
            name,
            description,
            units,
            courseId,
            yearLevel,
            semester,
            subjectType: subjectType || 'Core',
            isActive: true
        });

        res.status(201).json(subject);
    } catch (error) {
        next(error);
    }
};

export const updateSubject = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const subject = await SubjectModel.findByPk(id);
        if (!subject) {
            res.status(404).json({ message: 'Subject not found.' });
            return;
        }

        await subject.update(updateData);
        res.json(subject);
    } catch (error) {
        next(error);
    }
};

export const deleteSubject = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const subject = await SubjectModel.findByPk(id);
        if (!subject) {
            res.status(404).json({ message: 'Subject not found.' });
            return;
        }

        await subject.update({ isActive: false });
        res.json({ message: 'Subject deleted successfully.' });
    } catch (error) {
        next(error);
    }
}; 
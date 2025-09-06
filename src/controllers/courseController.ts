import { Request, Response, NextFunction } from 'express';
import { CourseModel, DepartmentModel } from '../database';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

export const getAllCourses = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await CourseModel.findAll({
            where: { isActive: true },
            include: [
                {
                    model: DepartmentModel,
                    as: 'department'
                }
            ],
            order: [['name', 'ASC']]
        });

        res.json(courses);
    } catch (error) {
        next(error);
    }
};

export const getCourseById = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findByPk(id, {
            include: [
                {
                    model: DepartmentModel,
                    as: 'department'
                }
            ]
        });

        if (!course) {
            res.status(404).json({ message: 'Course not found.' });
            return;
        }

        res.json(course);
    } catch (error) {
        next(error);
    }
};

export const getCoursesByDepartment = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { departmentId } = req.params;

        const courses = await CourseModel.findAll({
            where: { 
                departmentId: parseInt(departmentId),
                isActive: true 
            },
            include: [
                {
                    model: DepartmentModel,
                    as: 'department'
                }
            ],
            order: [['name', 'ASC']]
        });

        res.json(courses);
    } catch (error) {
        next(error);
    }
};

export const createCourse = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            code,
            name,
            description,
            departmentId,
            totalUnits,
            duration,
            level
        } = req.body;

        const course = await CourseModel.create({
            code,
            name,
            description,
            departmentId: parseInt(departmentId),
            totalUnits: parseInt(totalUnits),
            duration: parseInt(duration),
            level,
            isActive: true
        });

        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
};

export const updateCourse = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const course = await CourseModel.findByPk(id);
        if (!course) {
            res.status(404).json({ message: 'Course not found.' });
            return;
        }

        await course.update(updateData);
        res.json(course);
    } catch (error) {
        next(error);
    }
};

export const deleteCourse = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findByPk(id);
        if (!course) {
            res.status(404).json({ message: 'Course not found.' });
            return;
        }

        // Soft delete
        await course.update({ isActive: false });
        res.json({ message: 'Course deleted successfully.' });
    } catch (error) {
        next(error);
    }
}; 
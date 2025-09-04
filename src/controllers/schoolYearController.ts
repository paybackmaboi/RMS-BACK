import { Request, Response, NextFunction } from 'express';
import { SchoolYearModel } from '../database';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

export const getAllSchoolYears = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const schoolYears = await SchoolYearModel.findAll({
            where: { isActive: true },
            order: [['year', 'DESC']] // Most recent first
        });

        console.log('📅 School years fetched from database:', schoolYears.length, 'school years');
        res.json(schoolYears);
    } catch (error) {
        console.error('❌ Error fetching school years:', error);
        next(error);
    }
};

export const getCurrentSchoolYear = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentSchoolYear = await SchoolYearModel.findOne({
            where: { 
                isCurrent: true,
                isActive: true 
            }
        });

        if (!currentSchoolYear) {
            res.status(404).json({ message: 'No current school year found' });
            return;
        }

        res.json(currentSchoolYear);
    } catch (error) {
        console.error('Error fetching current school year:', error);
        next(error);
    }
};

export const getSchoolYearById = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const schoolYear = await SchoolYearModel.findByPk(id);

        if (!schoolYear) {
            res.status(404).json({ message: 'School year not found.' });
            return;
        }

        res.json(schoolYear);
    } catch (error) {
        console.error('Error fetching school year by ID:', error);
        next(error);
    }
};

export const createSchoolYear = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            year,
            description,
            startDate,
            endDate,
            isCurrent
        } = req.body;

        // If setting as current, unset all other current school years
        if (isCurrent) {
            await SchoolYearModel.update(
                { isCurrent: false },
                { where: { isCurrent: true } }
            );
        }

        const schoolYear = await SchoolYearModel.create({
            year,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isCurrent: isCurrent || false,
            isActive: true
        });

        res.status(201).json(schoolYear);
    } catch (error) {
        console.error('Error creating school year:', error);
        next(error);
    }
};

export const updateSchoolYear = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const schoolYear = await SchoolYearModel.findByPk(id);
        if (!schoolYear) {
            res.status(404).json({ message: 'School year not found.' });
            return;
        }

        // If setting as current, unset all other current school years
        if (updateData.isCurrent) {
            await SchoolYearModel.update(
                { isCurrent: false },
                { where: { isCurrent: true } }
            );
        }

        await schoolYear.update(updateData);
        res.json(schoolYear);
    } catch (error) {
        console.error('Error updating school year:', error);
        next(error);
    }
};

export const deleteSchoolYear = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const schoolYear = await SchoolYearModel.findByPk(id);
        if (!schoolYear) {
            res.status(404).json({ message: 'School year not found.' });
            return;
        }

        // Soft delete
        await schoolYear.update({ isActive: false });
        res.json({ message: 'School year deleted successfully.' });
    } catch (error) {
        console.error('Error deleting school year:', error);
        next(error);
    }
};

import { Request, Response, NextFunction } from 'express';
import { SemesterModel } from '../database';

// Get all active semesters
export const getAllSemesters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('📅 Fetching all active semesters...');
        
        const semesters = await SemesterModel.findAll({
            where: { isActive: true },
            order: [['startDate', 'ASC']]
        });

        console.log(`✅ Found ${semesters.length} active semesters`);
        res.json(semesters);
    } catch (error) {
        console.error('❌ Error fetching semesters:', error);
        res.status(500).json({ 
            message: 'Error fetching semesters',
            error: (error as Error).message 
        });
    }
};

// Get semester by ID
export const getSemesterById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        console.log('📅 Fetching semester with ID:', id);
        
        const semester = await SemesterModel.findByPk(id);
        
        if (!semester) {
            res.status(404).json({ message: 'Semester not found' });
            return;
        }

        console.log('✅ Found semester:', semester.name);
        res.json(semester);
    } catch (error) {
        console.error('❌ Error fetching semester:', error);
        res.status(500).json({ 
            message: 'Error fetching semester',
            error: (error as Error).message 
        });
    }
};

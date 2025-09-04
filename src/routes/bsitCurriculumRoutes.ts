import express from 'express';
// Import both BsitCurriculumModel and SemesterModel
import { BsitCurriculumModel, SemesterModel } from '../database';

const router = express.Router();

// Get all BSIT curriculum
router.get('/', async (req, res) => {
    try {
        const curriculum = await BsitCurriculumModel.findAll({
            where: { isActive: true },
            // 1. Include the associated Semester model to get the semester name
            include: [{
                model: SemesterModel,
                attributes: ['name'] // need the name from the Semester table
            }],
            // 2. Correct the ordering to use 'semesterId'
            order: [
                ['yearLevel', 'ASC'],
                ['semesterId', 'ASC'],
                ['courseCode', 'ASC']
            ]
        });

        res.json(curriculum);
    } catch (error) {
        console.error('Error fetching BSIT curriculum:', error);
        res.status(500).json({ message: 'Error fetching curriculum data' });
    }
});

export default router;
import express from 'express';
import { SubjectsModel } from '../database';

const router = express.Router();

// Get all BSIT curriculum
router.get('/', async (req, res) => {
    try {
        const curriculum = await SubjectsModel.findAll({
            where: { isActive: true },
            order: [
                ['yearLevel', 'ASC'],
                ['semester', 'ASC'],
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

import express from 'express';
import {
    getAllSchoolYears,
    getCurrentSchoolYear,
    getSchoolYearById,
    createSchoolYear,
    updateSchoolYear,
    deleteSchoolYear
} from '../controllers/schoolYearController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes (no auth required for viewing school years)
router.get('/', getAllSchoolYears);
router.get('/current', getCurrentSchoolYear);
router.get('/:id', getSchoolYearById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createSchoolYear);
router.put('/:id', authMiddleware, adminMiddleware, updateSchoolYear);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSchoolYear);

export default router;

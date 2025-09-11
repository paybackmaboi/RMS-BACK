import express from 'express';
import { getAllSemesters, getSemesterById } from '../controllers/semesterController';

const router = express.Router();

// Get all active semesters
router.get('/', getAllSemesters);

// Get semester by ID
router.get('/:id', getSemesterById);

export default router;

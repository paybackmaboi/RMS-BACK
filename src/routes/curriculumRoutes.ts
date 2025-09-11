import express from 'express';
import { getCurriculumByYearAndSemester } from '../controllers/curriculumController';

const router = express.Router();

// Get curriculum subjects and schedules by year level and semester
router.get('/curriculum', getCurriculumByYearAndSemester);

export default router;

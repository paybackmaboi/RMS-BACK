"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subjectController_1 = require("../controllers/subjectController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Get all subjects
router.get('/', authMiddleware_1.authMiddleware, subjectController_1.getAllSubjects);
// Get subjects by course
router.get('/course/:course', authMiddleware_1.authMiddleware, subjectController_1.getSubjectsByCourse);
// Get specific subject
router.get('/:id', authMiddleware_1.authMiddleware, subjectController_1.getSubjectById);
// Create new subject (admin only)
router.post('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, subjectController_1.createSubject);
// Update subject (admin only)
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, subjectController_1.updateSubject);
// Delete subject (admin only)
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, subjectController_1.deleteSubject);
exports.default = router;

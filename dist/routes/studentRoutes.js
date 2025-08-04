"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Student registration
router.post('/register', authMiddleware_1.authMiddleware, studentController_1.registerStudent);
// Debug endpoint
router.get('/debug', authMiddleware_1.authMiddleware, studentController_1.debugStudentRegistration);
// Admin routes for student management
router.get('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, studentController_1.getAllStudents);
router.get('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, studentController_1.getStudentDetails);
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, studentController_1.updateStudent);
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, studentController_1.deleteStudent);
// Create and enroll student (admin only)
router.post('/create-and-enroll', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, studentController_1.createAndEnrollStudent);
exports.default = router;

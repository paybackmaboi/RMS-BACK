"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollmentController_1 = require("../controllers/enrollmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Get all enrollments (admin only)
router.get('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, enrollmentController_1.getEnrollments);
// Get enrollments for current student
router.get('/my-enrollments', authMiddleware_1.authMiddleware, enrollmentController_1.getStudentEnrollments);
// Get specific enrollment
router.get('/:id', authMiddleware_1.authMiddleware, enrollmentController_1.getEnrollmentById);
// Create new enrollment
router.post('/', authMiddleware_1.authMiddleware, enrollmentController_1.createEnrollment);
// Update enrollment
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, enrollmentController_1.updateEnrollment);
// Delete enrollment
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, enrollmentController_1.deleteEnrollment);
exports.default = router;

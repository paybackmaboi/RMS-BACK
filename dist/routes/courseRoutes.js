"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes (no admin required for viewing courses)
router.get('/', authMiddleware_1.authMiddleware, courseController_1.getAllCourses);
router.get('/department/:departmentId', authMiddleware_1.authMiddleware, courseController_1.getCoursesByDepartment);
router.get('/:id', authMiddleware_1.authMiddleware, courseController_1.getCourseById);
// Admin routes
router.post('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, courseController_1.createCourse);
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, courseController_1.updateCourse);
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, courseController_1.deleteCourse);
exports.default = router;

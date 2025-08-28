"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scheduleController_1 = require("../controllers/scheduleController");
const sessionAuthMiddleware_1 = require("../middleware/sessionAuthMiddleware");
const router = express_1.default.Router();
// Get student's personal schedule (requires student authentication)
router.get('/student/:userId', sessionAuthMiddleware_1.studentSessionAuthMiddleware, scheduleController_1.getStudentSchedule);
// Get all schedules for admin view (requires admin authentication)
router.get('/admin/all', sessionAuthMiddleware_1.adminSessionAuthMiddleware, scheduleController_1.getAllSchedules);
// Get enrolled students for a specific schedule (requires admin authentication)
router.get('/admin/enrolled-students/:scheduleId', sessionAuthMiddleware_1.adminSessionAuthMiddleware, scheduleController_1.getScheduleEnrolledStudents);
// Diagnostic route to check database structure (requires admin authentication)
router.get('/admin/diagnostic', sessionAuthMiddleware_1.adminSessionAuthMiddleware, scheduleController_1.checkDatabaseStructure);
exports.default = router;

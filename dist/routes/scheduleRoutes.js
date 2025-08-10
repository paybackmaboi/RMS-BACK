"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scheduleController_1 = require("../controllers/scheduleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Get all schedules
router.get('/', authMiddleware_1.authMiddleware, scheduleController_1.getAllSchedules);
// Get schedules by subject
router.get('/subject/:subjectId', authMiddleware_1.authMiddleware, scheduleController_1.getSchedulesBySubject);
// Get specific schedule
router.get('/:id', authMiddleware_1.authMiddleware, scheduleController_1.getScheduleById);
// Create new schedule (admin only)
router.post('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, scheduleController_1.createSchedule);
// Update schedule (admin only)
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, scheduleController_1.updateSchedule);
// Delete schedule (admin only)
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, scheduleController_1.deleteSchedule);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollmentController_1 = require("../controllers/enrollmentController");
const router = express_1.default.Router();
// Get student enrollment status (current semester)
router.get('/enrollment-status/:userId', enrollmentController_1.getStudentEnrollmentStatus);
// Get student enrollment history (all semesters)
router.get('/enrollment-history/:userId', enrollmentController_1.getStudentEnrollmentHistory);
exports.default = router;

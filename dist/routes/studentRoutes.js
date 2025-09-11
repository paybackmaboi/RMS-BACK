"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountingController_1 = require("../controllers/accountingController");
const studentController_1 = require("../controllers/studentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const sessionAuthMiddleware_1 = require("../middleware/sessionAuthMiddleware");
const router = express_1.default.Router();
router.get('/me/balance', sessionAuthMiddleware_1.studentSessionAuthMiddleware, accountingController_1.getMyBalance);
// Student registration (no auth required - this creates the account)
router.post('/register', studentController_1.registerStudent);
// Debug endpoint
router.get('/debug', authMiddleware_1.authMiddleware, studentController_1.debugStudentRegistration);
// Admin routes for student management
router.get('/', sessionAuthMiddleware_1.adminSessionAuthMiddleware, studentController_1.getAllStudents);
router.get('/:id', sessionAuthMiddleware_1.adminSessionAuthMiddleware, studentController_1.getStudentDetails);
router.put('/:id', sessionAuthMiddleware_1.adminSessionAuthMiddleware, studentController_1.updateStudent);
router.delete('/:id', sessionAuthMiddleware_1.adminSessionAuthMiddleware, studentController_1.deleteStudent);
// Create and enroll student (admin only)
router.post('/create-and-enroll', sessionAuthMiddleware_1.adminSessionAuthMiddleware, studentController_1.createAndEnrollStudent);
// Complete student registration with permanent data (requires session authentication)
router.post('/complete-registration', sessionAuthMiddleware_1.studentSessionAuthMiddleware, studentController_1.completeStudentRegistration);
// Get current student profile (requires session authentication)
router.get('/profile', sessionAuthMiddleware_1.studentSessionAuthMiddleware, studentController_1.getCurrentStudentProfile);
// Get student registration data by user ID (admin only)
router.get('/registration/:userId', studentController_1.getStudentRegistrationData);
// Get student enrolled subjects by year level and semester
router.get('/enrolled-subjects/:userId', studentController_1.getStudentEnrolledSubjects);
// Search user by ID number (admin only)
router.get('/search/:idNumber', sessionAuthMiddleware_1.adminSessionAuthMiddleware, studentController_1.searchUserByIdNumber);
// Update student registration data (admin only)
router.put('/registration/:userId', sessionAuthMiddleware_1.adminSessionAuthMiddleware, studentController_1.updateStudentRegistration);
// Update all approved registrations to enrolled status (admin only)
router.put('/update-registration-statuses', sessionAuthMiddleware_1.adminSessionAuthMiddleware, studentController_1.updateApprovedRegistrationsToEnrolled);
exports.default = router;

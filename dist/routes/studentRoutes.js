"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
// FIX: Import the functions with their correct exported names
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Route for admin to create a new student account
// FIX: Use the correctly named functions in the route definition
router.post('/create-and-enroll', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, studentController_1.createAndEnrollStudent);
router.get('/registration-status', authMiddleware_1.authMiddleware, studentController_1.getRegistrationStatus);
exports.default = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountController_1 = require("../controllers/accountController");
const sessionAuthMiddleware_1 = require("../middleware/sessionAuthMiddleware");
const router = express_1.default.Router();
// Test endpoint without authentication
router.get('/test', (req, res) => {
    res.json({ message: 'Account routes are working', timestamp: new Date().toISOString() });
});
// Debug endpoint to check database
router.get('/debug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { UserModel, StudentModel } = require('../database');
        const userCount = yield UserModel.count({ where: { role: 'student' } });
        const studentCount = yield StudentModel.count();
        res.json({
            message: 'Database debug info',
            userCount,
            studentCount,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Test endpoint to get all students without authentication
router.get('/test-students', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { getAllStudentAccounts } = require('../controllers/accountController');
        yield getAllStudentAccounts(req, res, () => { });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Test endpoint with session authentication
router.get('/test-auth', sessionAuthMiddleware_1.adminSessionAuthMiddleware, (req, res) => {
    res.json({
        message: 'Authentication working!',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});
// Existing route to get all accounts
router.get('/', sessionAuthMiddleware_1.adminSessionAuthMiddleware, accountController_1.getAllStudentAccounts);
router.patch('/:id/reset-password', sessionAuthMiddleware_1.adminSessionAuthMiddleware, accountController_1.resetStudentPassword);
exports.default = router;

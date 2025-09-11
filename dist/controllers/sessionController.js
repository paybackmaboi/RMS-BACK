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
exports.getStudentLoginHistory = exports.getLoginHistory = exports.refreshSession = exports.getCurrentSession = exports.logoutAndDestroySession = exports.loginAndCreateSession = exports.createSession = void 0;
const database_1 = require("../database");
const crypto_1 = __importDefault(require("crypto"));
// Generate a secure session token
const generateSessionToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
// Helper function to log login/logout events
const logUserAction = (userId, action, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress ||
            ((_b = (_a = req.connection) === null || _a === void 0 ? void 0 : _a.socket) === null || _b === void 0 ? void 0 : _b.remoteAddress) || 'unknown';
        const userAgent = req.get('User-Agent') || 'unknown';
        yield database_1.LoginHistoryModel.create({
            userId,
            action,
            ipAddress,
            userAgent
        });
    }
    catch (error) {
        console.error('Error logging user action:', error);
        // Don't throw error to avoid breaking the main flow
    }
});
// Create a new session for a user
const createSession = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, expiresInHours = 168) {
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours); // 168 hours = 7 days
    yield database_1.UserSessionModel.create({
        userId,
        sessionToken,
        expiresAt
    });
    return sessionToken;
});
exports.createSession = createSession;
// Login and create session
const loginAndCreateSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idNumber, password } = req.body;
        if (!idNumber || !password) {
            res.status(400).json({ message: 'ID Number and password are required' });
            return;
        }
        // Find user by ID number
        const user = yield database_1.UserModel.findOne({
            where: { idNumber, isActive: true }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Verify password
        // const isValidPassword = await bcrypt.compare(password, user.password);
        // if (!isValidPassword) {
        //     res.status(401).json({ message: 'Invalid credentials' });
        //     return;
        // }
        // Create session
        const sessionToken = yield (0, exports.createSession)(user.id);
        // Log login event
        yield logUserAction(user.id, 'login', req);
        // Return user info and session token
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                idNumber: user.idNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            sessionToken,
            expiresIn: '24 hours'
        });
    }
    catch (error) {
        console.error('Login error:', error);
        next(error);
    }
});
exports.loginAndCreateSession = loginAndCreateSession;
// Logout and destroy session
const logoutAndDestroySession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sessionToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.sessionToken) || req.headers['x-session-token'];
        if (sessionToken) {
            // Get user ID before destroying session
            const session = yield database_1.UserSessionModel.findOne({
                where: { sessionToken }
            });
            if (session) {
                // Log logout event
                yield logUserAction(session.userId, 'logout', req);
                // Destroy session
                yield database_1.UserSessionModel.destroy({
                    where: { sessionToken }
                });
            }
        }
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        console.error('Logout error:', error);
        next(error);
    }
});
exports.logoutAndDestroySession = logoutAndDestroySession;
// Get current session info
const getCurrentSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        res.json({
            user: req.user,
            authenticated: true
        });
    }
    catch (error) {
        console.error('Get session error:', error);
        next(error);
    }
});
exports.getCurrentSession = getCurrentSession;
// Refresh session if it's close to expiring
const refreshSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sessionToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.sessionToken) || req.headers['x-session-token'];
        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }
        // Find the session
        const session = yield database_1.UserSessionModel.findOne({
            where: { sessionToken }
        });
        if (!session) {
            res.status(401).json({ message: 'Invalid session' });
            return;
        }
        // Check if session expires within the next 24 hours
        const now = new Date();
        const expiresIn24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        if (session.expiresAt <= expiresIn24Hours) {
            // Extend session by 7 days
            const newExpiresAt = new Date();
            newExpiresAt.setHours(newExpiresAt.getHours() + 168);
            yield session.update({ expiresAt: newExpiresAt });
            res.json({
                message: 'Session refreshed',
                expiresAt: newExpiresAt
            });
        }
        else {
            res.json({
                message: 'Session is still valid',
                expiresAt: session.expiresAt
            });
        }
    }
    catch (error) {
        console.error('Session refresh error:', error);
        next(error);
    }
});
exports.refreshSession = refreshSession;
// Get login/logout history for a user
const getLoginHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const history = yield database_1.LoginHistoryModel.findAndCountAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset: offset
        });
        // Format the response
        const formattedHistory = history.rows.map(record => ({
            id: record.id,
            action: record.action,
            date: record.createdAt.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit'
            }),
            time: record.createdAt.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            ipAddress: record.ipAddress,
            userAgent: record.userAgent
        }));
        res.json({
            history: formattedHistory,
            totalCount: history.count,
            currentPage: Number(page),
            totalPages: Math.ceil(history.count / Number(limit))
        });
    }
    catch (error) {
        console.error('Get login history error:', error);
        next(error);
    }
});
exports.getLoginHistory = getLoginHistory;
// Get login/logout history for a specific student (admin only)
const getStudentLoginHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ message: 'Access restricted to administrators only' });
            return;
        }
        const { studentId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        if (!studentId) {
            res.status(400).json({ message: 'Student ID is required' });
            return;
        }
        const history = yield database_1.LoginHistoryModel.findAndCountAll({
            where: { userId: studentId },
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset: offset
        });
        // Format the response
        const formattedHistory = history.rows.map(record => ({
            id: record.id,
            action: record.action,
            date: record.createdAt.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit'
            }),
            time: record.createdAt.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            ipAddress: record.ipAddress,
            userAgent: record.userAgent
        }));
        res.json({
            history: formattedHistory,
            totalCount: history.count,
            currentPage: Number(page),
            totalPages: Math.ceil(history.count / Number(limit))
        });
    }
    catch (error) {
        console.error('Get student login history error:', error);
        next(error);
    }
});
exports.getStudentLoginHistory = getStudentLoginHistory;

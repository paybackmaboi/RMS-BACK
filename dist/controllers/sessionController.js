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
exports.refreshSession = exports.getCurrentSession = exports.logoutAndDestroySession = exports.loginAndCreateSession = exports.createSession = void 0;
const database_1 = require("../database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate a secure session token using crypto
 * @returns {string} A 64-character hexadecimal token
 */
const generateSessionToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
/**
 * Create a new session for a user
 * @param {number} userId - The user ID to create session for
 * @param {number} expiresInHours - Hours until session expires (default: 87600 = 10 years)
 * @returns {Promise<string>} The generated session token
 */
const createSession = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, expiresInHours = 87600) {
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
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
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Create session
        const sessionToken = yield (0, exports.createSession)(user.id);
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
            expiresIn: '10 years'
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
            yield database_1.UserSessionModel.destroy({
                where: { sessionToken }
            });
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
        // Check if session expires within the next 30 days
        const now = new Date();
        const expiresIn30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        if (session.expiresAt <= expiresIn30Days) {
            // Extend session by 10 years
            const newExpiresAt = new Date();
            newExpiresAt.setHours(newExpiresAt.getHours() + 87600);
            yield session.update({ expiresAt: newExpiresAt });
            res.json({
                message: 'Session refreshed',
                sessionToken: sessionToken, // Return the same session token
                expiresAt: newExpiresAt
            });
        }
        else {
            res.json({
                message: 'Session is still valid',
                sessionToken: sessionToken, // Return the same session token
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

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountingSessionAuthMiddleware = exports.studentSessionAuthMiddleware = exports.adminSessionAuthMiddleware = exports.sessionAuthMiddleware = void 0;
const database_1 = require("../database");
const sequelize_1 = require("sequelize");
const sessionAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get session token from cookies or headers
        const sessionToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.sessionToken) || req.headers['x-session-token'];
        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }
        // Find valid session in database
        const session = yield database_1.UserSessionModel.findOne({
            where: {
                sessionToken: sessionToken,
                expiresAt: {
                    [sequelize_1.Op.gt]: new Date() // expiresAt > current time
                }
            }
        });
        if (!session) {
            res.status(401).json({ message: 'Invalid or expired session' });
            return;
        }
        // Get user details separately
        const user = yield database_1.UserModel.findByPk(session.userId);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Set user info in request
        req.user = {
            id: session.userId,
            role: user.role,
            idNumber: user.idNumber,
            firstName: user.firstName,
            lastName: user.lastName
        };
        console.log('✅ Student session auth successful - User set:', req.user);
        next();
    }
    catch (error) {
        console.error('Session auth error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
});
exports.sessionAuthMiddleware = sessionAuthMiddleware;
const adminSessionAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // First authenticate the session
        const sessionToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.sessionToken) || req.headers['x-session-token'];
        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }
        // Find valid session in database
        const session = yield database_1.UserSessionModel.findOne({
            where: {
                sessionToken: sessionToken,
                expiresAt: {
                    [sequelize_1.Op.gt]: new Date() // expiresAt > current time
                }
            }
        });
        if (!session) {
            res.status(401).json({ message: 'Invalid or expired session' });
            return;
        }
        // Get user details separately
        const user = yield database_1.UserModel.findByPk(session.userId);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Check if user is an admin
        if (user.role !== 'admin') {
            res.status(403).json({ message: 'Access restricted to administrators only' });
            return;
        }
        // Set user info in request
        req.user = {
            id: session.userId,
            role: user.role,
            idNumber: user.idNumber,
            firstName: user.firstName,
            lastName: user.lastName
        };
        next();
    }
    catch (error) {
        console.error('Admin session auth error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
});
exports.adminSessionAuthMiddleware = adminSessionAuthMiddleware;
const studentSessionAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get session token from cookies or headers
        const sessionToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.sessionToken) || req.headers['x-session-token'];
        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }
        // Find valid session in database
        const session = yield database_1.UserSessionModel.findOne({
            where: {
                sessionToken: sessionToken,
                expiresAt: {
                    [sequelize_1.Op.gt]: new Date() // expiresAt > current time
                }
            }
        });
        if (!session) {
            res.status(401).json({ message: 'Invalid or expired session' });
            return;
        }
        // Get user details separately
        const user = yield database_1.UserModel.findByPk(session.userId);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Check if user is a student or admin (admins can also access student data)
        if (user.role !== 'student' && user.role !== 'admin') {
            res.status(403).json({ message: 'Access restricted to students and administrators only' });
            return;
        }
        // Set user info in request
        req.user = {
            id: session.userId,
            role: user.role,
            idNumber: user.idNumber,
            firstName: user.firstName,
            lastName: user.lastName
        };
        next();
    }
    catch (error) {
        console.error('Student session auth error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
});
exports.studentSessionAuthMiddleware = studentSessionAuthMiddleware;
const accountingSessionAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get session token from cookies or headers
        const sessionToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.sessionToken) || req.headers['x-session-token'];
        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return;
        }
        // Find a valid, non-expired session
        const session = yield database_1.UserSessionModel.findOne({
            where: {
                sessionToken: sessionToken,
                expiresAt: {
                    [sequelize_1.Op.gt]: new Date()
                }
            }
        });
        if (!session) {
            res.status(401).json({ message: 'Invalid or expired session' });
            return;
        }
        // Get the user associated with the session
        const user = yield database_1.UserModel.findByPk(session.userId);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // IMPORTANT: Check if the user is 'accounting' OR 'admin'
        if (user.role !== 'accounting' && user.role !== 'admin') {
            res.status(403).json({ message: 'Access restricted to accounting or admin staff' });
            return;
        }
        // Attach user info to the request object
        req.user = {
            id: session.userId,
            role: user.role,
            idNumber: user.idNumber,
            firstName: user.firstName,
            lastName: user.lastName
        };
        next();
    }
    catch (error) {
        console.error('Accounting session auth error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
});
exports.accountingSessionAuthMiddleware = accountingSessionAuthMiddleware;

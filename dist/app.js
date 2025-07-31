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
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.set('json spaces', 2);
// --- Global Middleware ---
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve static files from the project's root 'uploads' directory
app.use('/uploads', express_1.default.static(path_1.default.resolve(process.cwd(), 'uploads')));
// --- Routes ---
app.use('/api/auth', authRoutes_1.default);
app.use('/api/requests', requestRoutes_1.default);
app.use('/api/students', studentRoutes_1.default);
app.use('/api/accounts', accountRoutes_1.default);
// --- Error Handling Middleware ---
const errorHandler = (err, req, res, next) => {
    console.error("An error occurred:", err.message);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ message: err.message || 'An internal server error occurred.' });
};
app.use(errorHandler);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectAndInitialize)();
        yield database_1.sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
        const { User } = require('./database');
        // --- START OF FIX ---
        // Seeding dummy accounts if they don't exist, now with names
        yield User.findOrCreate({
            where: { idNumber: 'S001' },
            defaults: {
                idNumber: 'S001',
                password: 'password',
                role: 'student',
                firstName: 'Juan',
                lastName: 'Dela Cruz'
            }
        });
        console.log('Dummy student S001 created or already exists.');
        yield User.findOrCreate({
            where: { idNumber: 'A001' },
            defaults: {
                idNumber: 'A001',
                password: 'adminpass',
                role: 'admin',
                firstName: 'Admin',
                lastName: 'User'
            }
        });
        console.log('Dummy admin A001 created or exists.');
        yield User.findOrCreate({
            where: { idNumber: 'AC001' },
            defaults: {
                idNumber: 'AC001',
                password: 'accountingpass',
                role: 'accounting',
                firstName: 'Accounting',
                lastName: 'User'
            }
        });
        console.log('Dummy accounting AC001 created or exists.');
        // --- END OF FIX ---
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error('Unable to start the server:', err);
        process.exit(1);
    }
});
startServer();
exports.default = app;

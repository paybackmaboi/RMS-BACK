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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = require("./database");
const seedData_1 = require("./seedData");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
// Import the new registration routes
const registrationRoutes_1 = __importDefault(require("./routes/registrationRoutes"));
// Import new routes for enrollment and subject management
const enrollmentRoutes_1 = __importDefault(require("./routes/enrollmentRoutes"));
const subjectRoutes_1 = __importDefault(require("./routes/subjectRoutes"));
const scheduleRoutes_1 = __importDefault(require("./routes/scheduleRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const bsitCurriculumRoutes_1 = __importDefault(require("./routes/bsitCurriculumRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const photoRoutes_1 = __importDefault(require("./routes/photoRoutes"));
const requirementsRoutes_1 = __importDefault(require("./routes/requirementsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
app.set('json spaces', 5);
// --- Global Middleware ---
// CORS configuration for production
const corsOptions = {
    origin: isProduction
        ? [process.env.FRONTEND_URL || 'https://rms-front-9our.onrender.com',
            'https://rms-front-0hm1.onrender.com',
            'https://rms-front-v8xi.onrender.com',
            'https://ly-ann-kate-candido.onrender.com',
            'https://rms-front-ixef.onrender.com'
        ]
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve static files from the project's root 'uploads' directory
app.use('/uploads', express_1.default.static(path_1.default.resolve(process.cwd(), 'uploads')));
// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// --- Routes ---
app.use('/api/auth', authRoutes_1.default);
app.use('/api/requests', requestRoutes_1.default);
app.use('/api/sessions', sessionRoutes_1.default);
app.use('/api/accounts', accountRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
// Add the new registration route
app.use('/api/register', registrationRoutes_1.default);
// Student enrollment routes (for student dashboard) - register BEFORE studentRoutes to avoid conflicts
app.use('/api/students', enrollmentRoutes_1.default);
// Student management routes (for admin functions like viewing student details)
app.use('/api/students', studentRoutes_1.default);
// Add new routes for enrollment and subject management
app.use('/api/enrollments', enrollmentRoutes_1.default);
app.use('/api/subjects', subjectRoutes_1.default);
app.use('/api/schedules', scheduleRoutes_1.default);
app.use('/api/courses', courseRoutes_1.default);
app.use('/api/bsit-curriculum', bsitCurriculumRoutes_1.default);
app.use('/api/admin/dashboard', dashboardRoutes_1.default);
app.use('/api/photos', photoRoutes_1.default);
app.use('/api/requirements', requirementsRoutes_1.default);
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
        // Initialize database and sync all models
        yield (0, database_1.connectAndInitialize)();
        console.log('🚀 Server starting up...');
        // Automatically seed BSIT curriculum and schedules
        try {
            console.log('🌱 Starting automatic data seeding...');
            yield (0, seedData_1.seedInitialData)();
            console.log('✅ Automatic seeding completed successfully!');
        }
        catch (seedError) {
            console.warn('⚠️  Warning: Automatic seeding failed, but server will continue:', seedError);
        }
        // Start the server
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 API available at: http://localhost:${PORT}/api`);
            console.log(`📚 Database tables created/verified automatically`);
            console.log(`🌱 BSIT curriculum and schedules seeded automatically`);
            console.log(`🔑 Sample users created for testing`);
        });
    }
    catch (err) {
        console.error('❌ Unable to start the server:', err);
        process.exit(1);
    }
});
startServer();
exports.default = app;

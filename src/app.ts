import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { sequelize, connectAndInitialize } from './database';
import { seedInitialData } from './seedData';
import authRoutes from './routes/authRoutes';
import requestRoutes from './routes/requestRoutes';
import studentRoutes from './routes/studentRoutes';
import sessionRoutes from './routes/sessionRoutes';
import accountRoutes from './routes/accountRoutes';
import notificationRoutes from './routes/notificationRoutes';
// Import the new registration routes
import registrationRoutes from './routes/registrationRoutes';
// Import new routes for enrollment and subject management
import enrollmentRoutes from './routes/enrollmentRoutes';
import subjectRoutes from './routes/subjectRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import courseRoutes from './routes/courseRoutes';
import bsitCurriculumRoutes from './routes/bsitCurriculumRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import photoRoutes from './routes/photoRoutes';
import requirementsRoutes from './routes/requirementsRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.set('json spaces', 2);

// --- Global Middleware ---
// CORS configuration for production
const corsOptions = {
    origin: isProduction
        ? [
        process.env.FRONTEND_URL || 'https://rms-front-9our.onrender.com',
        'https://ly-ann-kate-candido.vercel.app'
         ]
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the project's root 'uploads' directory
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Health check endpoint for Render
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});


// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/notifications', notificationRoutes);
// Add the new registration route
app.use('/api/register', registrationRoutes);

// Student enrollment routes (for student dashboard) - register BEFORE studentRoutes to avoid conflicts
app.use('/api/students', enrollmentRoutes);

// Student management routes (for admin functions like viewing student details)
app.use('/api/students', studentRoutes);

// Add new routes for enrollment and subject management
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/bsit-curriculum', bsitCurriculumRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/requirements', requirementsRoutes);

// --- Error Handling Middleware ---
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error("An error occurred:", err.message);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ message: err.message || 'An internal server error occurred.' });
};

app.use(errorHandler);


const startServer = async () => {
    try {
        // Initialize database and sync all models
        await connectAndInitialize();
        console.log('🚀 Server starting up...');

        // Automatically seed BSIT curriculum and schedules
        try {
            console.log('🌱 Starting automatic data seeding...');
            await seedInitialData();
            console.log('✅ Automatic seeding completed successfully!');
        } catch (seedError) {
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

    } catch (err) {
        console.error('❌ Unable to start the server:', err);
        process.exit(1);
    }
};

startServer();

export default app;
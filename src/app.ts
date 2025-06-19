import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { sequelize, connectAndInitialize } from './database';
import authRoutes from './routes/authRoutes';
import requestRoutes from './routes/requestRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global Middleware ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the project's root 'uploads' directory
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));


// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);


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
        await connectAndInitialize();
        // Using { alter: true } is safer for development as it tries to update tables
        // without dropping them, preserving your data.
        await sequelize.sync({ alter: true }); 
        console.log('All models were synchronized successfully.');

        const { User } = require('./database');
        
        // Seeding dummy accounts if they don't exist
        await User.findOrCreate({
            where: { idNumber: 'S001' },
            defaults: { idNumber: 'S001', password: 'password', role: 'student' }
        });
        console.log('Dummy student S001 created or already exists.');

        await User.findOrCreate({
            where: { idNumber: 'A001' },
            defaults: { idNumber: 'A001', password: 'adminpass', role: 'admin' }
        });
        console.log('Dummy admin A001 created or exists.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('Unable to start the server:', err);
        process.exit(1);
    }
};

startServer();

export default app;

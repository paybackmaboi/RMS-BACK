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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);


// --- Error Handling Middleware ---
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // Check for Multer-specific errors
    if (err.code && err.code.startsWith('LIMIT_')) {
        res.status(400).json({ message: err.message });
        return;
    }
    // Check for our custom file filter error
    if (err.message.includes('File upload only supports')) {
        res.status(400).json({ message: err.message });
        return;
    }

    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Something broke!' });
};

app.use(errorHandler);


const startServer = async () => {
    try {
        await connectAndInitialize();
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');

        const { User } = require('./database');
        
        await User.findOrCreate({
            where: { idNumber: 'S001' },
            defaults: { idNumber: 'S001', password: 'password', role: 'student' }
        });
        console.log('Dummy student S001 created or exists.');

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

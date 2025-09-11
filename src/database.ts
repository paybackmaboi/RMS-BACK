import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2';

// Import all model initializers
import { User as UserModel, initUser } from './models/User';
import { Student as StudentModel, initStudent } from './models/Student';
import { Department as DepartmentModel, initDepartment } from './models/Department';
import { Course as CourseModel, initCourse } from './models/Course';
import { SchoolYear as SchoolYearModel, initSchoolYear } from './models/SchoolYear';
import { Semester as SemesterModel, initSemester } from './models/Semester';
import { Enrollment as EnrollmentModel, initEnrollment } from './models/Enrollment';
import { StudentRegistration as StudentRegistrationModel, initStudentRegistration } from './models/StudentRegistration';
import { Subjects as SubjectsModel, initSubjects } from './models/Subjects';
import { Schedules as SchedulesModel, initSchedules } from './models/Schedules';
import { StudentEnrollment as StudentEnrollmentModel, initStudentEnrollment } from './models/StudentEnrollment';
import { UserSession as UserSessionModel, initUserSession } from './models/UserSession';
import { Request as RequestModel, initRequest } from './models/Request';
import { Notification as NotificationModel, initNotification } from './models/Notification';
import { LoginHistory as LoginHistoryModel, initLoginHistory } from './models/LoginHistory';
import { Accounting as AccountingModel, initAccounting } from './models/Accounting';
import { Document as DocumentModel, initDocument } from './models/Document';

// Load environment variables
dotenv.config();

// check if we are in production
const isProduction = process.env.NODE_ENV === 'production';

// Database configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME;
const DB_PORT = parseInt(process.env.DB_PORT || '3306');

// Create Sequelize instance
export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    dialectModule: mysql2,
    dialectOptions: {
        // MySQL2 configuration
        supportBigNumbers: true,
        bigNumberStrings: true,
        dateStrings: true,
        decimalNumbers: true,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000
    },
    logging: console.log, // Enable logging for debugging
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Initialize all models
export const initializeModels = () => {
    initUser(sequelize);
    initStudent(sequelize);
    initDepartment(sequelize);
    initCourse(sequelize);
    initSchoolYear(sequelize);
    initSemester(sequelize);
    initEnrollment(sequelize);
            initStudentRegistration(sequelize);
        initSubjects(sequelize);
        initSchedules(sequelize);
        initStudentEnrollment(sequelize);
        initUserSession(sequelize);
        initRequest(sequelize);
        initNotification(sequelize);
        initAccounting(sequelize);
        initLoginHistory(sequelize);
        initDocument(sequelize);
};

// Define associations
export const defineAssociations = () => {
    // User associations
    UserModel.hasOne(StudentModel, { foreignKey: 'userId' });
    StudentModel.belongsTo(UserModel, { foreignKey: 'userId' });

     // A User (who is a student) has one Accounting record
    UserModel.hasOne(AccountingModel, { foreignKey: 'studentId', as: 'accounting' });
    AccountingModel.belongsTo(UserModel, { foreignKey: 'studentId', as: 'user' });

    // Department associations
    DepartmentModel.hasMany(CourseModel, { foreignKey: 'departmentId' });
    CourseModel.belongsTo(DepartmentModel, { foreignKey: 'departmentId' });

    // Course associations
    CourseModel.hasMany(StudentModel, { foreignKey: 'courseId' });
    StudentModel.belongsTo(CourseModel, { foreignKey: 'courseId' });

    // Schedule associations
    SchedulesModel.belongsTo(SubjectsModel, { foreignKey: 'subjectId' });
    SubjectsModel.hasMany(SchedulesModel, { foreignKey: 'subjectId' });

    // Enrollment associations
    EnrollmentModel.belongsTo(StudentModel, { foreignKey: 'studentId' });
    StudentModel.hasMany(EnrollmentModel, { foreignKey: 'studentId' });
    EnrollmentModel.belongsTo(SchedulesModel, { foreignKey: 'scheduleId' });
    SchedulesModel.hasMany(EnrollmentModel, { foreignKey: 'scheduleId' });

    // Student Registration associations
    StudentRegistrationModel.belongsTo(UserModel, { foreignKey: 'userId' });
    UserModel.hasMany(StudentRegistrationModel, { foreignKey: 'userId' });

    // Subjects associations
    SubjectsModel.hasMany(SchedulesModel, { foreignKey: 'subjectId' });
    SchedulesModel.belongsTo(SubjectsModel, { foreignKey: 'subjectId' });

    // Student Enrollment associations
    StudentEnrollmentModel.belongsTo(StudentModel, { foreignKey: 'studentId' });
    StudentModel.hasMany(StudentEnrollmentModel, { foreignKey: 'studentId' });
    StudentEnrollmentModel.belongsTo(SchedulesModel, { foreignKey: 'scheduleId' });
    SchedulesModel.hasMany(StudentEnrollmentModel, { foreignKey: 'scheduleId' });

    // Request associations
    RequestModel.belongsTo(UserModel, { foreignKey: 'studentId', as: 'student' });
    UserModel.hasMany(RequestModel, { foreignKey: 'studentId', as: 'requests' });

    // Notification associations
    NotificationModel.belongsTo(UserModel, { foreignKey: 'userId' });
    UserModel.hasMany(NotificationModel, { foreignKey: 'userId' });
    NotificationModel.belongsTo(RequestModel, { foreignKey: 'requestId' });
    RequestModel.hasMany(NotificationModel, { foreignKey: 'requestId' });

    // Login History associations
    LoginHistoryModel.belongsTo(UserModel, { foreignKey: 'userId' });
    UserModel.hasMany(LoginHistoryModel, { foreignKey: 'userId' });

    // Document associations
    DocumentModel.belongsTo(StudentModel, { foreignKey: 'studentId' });
    StudentModel.hasMany(DocumentModel, { foreignKey: 'studentId', as: 'documents' });
    DocumentModel.belongsTo(UserModel, { foreignKey: 'reviewedBy', as: 'reviewer' });
    UserModel.hasMany(DocumentModel, { foreignKey: 'reviewedBy', as: 'reviewedDocuments' });
};

// Connect to database and initialize
export const connectAndInitialize = async () => {
    try {
        console.log('🔌 Attempting to connect to database...');
        console.log(`📍 Host: ${DB_HOST}:${DB_PORT}`);
        console.log(`👤 User: ${DB_USER}`);
        console.log(`🗄️  Database: ${DB_NAME}`);

        // Validate required environment variables
        if (!DB_NAME) {
            throw new Error('DB_NAME environment variable is required. Please check your .env file.');
        }

        // Create database if it doesn't exist
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        await connection.end();
        console.log(`✅ Database '${DB_NAME}' ensured to exist.`);

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Initialize models
        initializeModels();
        console.log('✅ Models initialized successfully.');

        // Define associations
        defineAssociations();
        console.log('✅ Model associations defined successfully.');

        // Database sync with minimal changes to avoid key limit issues
        await sequelize.sync({ alter: false }); // Don't alter existing tables to avoid key conflicts
        console.log('✅ Database tables created/synced successfully.');

        const { seedInitialData } = await import('./seedData');
        await seedInitialData();

        // Create sample admin user if it doesn't exist
        const adminUser = await UserModel.findOne({
            where: { idNumber: 'A001' }
        });

        if (!adminUser) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('adminpass', 10);
            
            await UserModel.create({
                idNumber: 'A001',
                password: hashedPassword,
                role: 'admin',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@benedicto.edu.ph',
                isActive: true
            });
            console.log('✅ Sample admin user created (A001/adminpass)');
        }

        // Create sample accounting user if it doesn't exist
        const accountingUser = await UserModel.findOne({
            where: { idNumber: 'ACC01' }
        });

        if (!accountingUser) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('accpass', 10);
            
            await UserModel.create({
                idNumber: 'ACC01',
                password: hashedPassword,
                role: 'accounting',
                firstName: 'Accounting',
                lastName: 'User',
                email: 'accounting@benedicto.edu.ph',
                isActive: true
            });
            console.log('✅ Sample accounting user created (ACC01/accpass)');
        }

        // Create sample student user if it doesn't exist
        const studentUser = await UserModel.findOne({
            where: { idNumber: '2022-00037' }
        });

        if (!studentUser) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('password', 10);
            
            const newUser = await UserModel.create({
                idNumber: '2022-00037',
                password: hashedPassword,
                role: 'student',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@student.benedicto.edu.ph',
                isActive: true
            });

            // Create student record
            await StudentModel.create({
                userId: newUser.id,
                studentNumber: '2022-00037',
                fullName: 'Doe, John',
                yearOfEntry: new Date().getFullYear(),
                studentType: 'First',
                semesterEntry: 'First',
                applicationType: 'Freshmen',
                academicStatus: 'Regular',
                currentYearLevel: 1,
                currentSemester: 1,
                totalUnitsEarned: 0,
                cumulativeGPA: 0.00,
                isActive: true
            });
            console.log('✅ Sample student user created (2022-00037/password)');
        }

        console.log('🎉 Database initialization completed successfully!');
        
    } catch (error) {
        console.error('❌ Database initialization failed:');
        if (error instanceof Error) {
            console.error(`   Error: ${error.message}`);
            if (error.message.includes('ECONNREFUSED')) {
                console.error('   💡 Make sure MySQL server is running and accessible');
                console.error('   💡 Check if the host and port are correct');
            } else if (error.message.includes('Access denied')) {
                console.error('   💡 Check your username and password');
            } else if (error.message.includes('Unknown database')) {
                console.error('   💡 Make sure the database exists');
            }
        } else {
            console.error('   Unknown error:', error);
        }
        throw error;
    }
};

// Export models for use in other parts of the application
export {
    UserModel,
    StudentModel,
    DepartmentModel,
    CourseModel,
    SchoolYearModel,
    SemesterModel,
    EnrollmentModel,
    StudentRegistrationModel,
    SubjectsModel,
    SchedulesModel,
    StudentEnrollmentModel,
    UserSessionModel,
    RequestModel,
    NotificationModel,
    AccountingModel,
    LoginHistoryModel,
    DocumentModel
};
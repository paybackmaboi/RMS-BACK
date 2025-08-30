import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2';

// Import all model initializers
import { User as UserModel, initUser } from './models/User';
import { Student as StudentModel, initStudent } from './models/Student';
import { Department as DepartmentModel, initDepartment } from './models/Department';
import { Course as CourseModel, initCourse } from './models/Course';
import { Subject as SubjectModel, initSubject } from './models/Subject';
import { SchoolYear as SchoolYearModel, initSchoolYear } from './models/SchoolYear';
import { Semester as SemesterModel, initSemester } from './models/Semester';
import { Schedule as ScheduleModel, initSchedule } from './models/Schedule';
import { Enrollment as EnrollmentModel, initEnrollment } from './models/Enrollment';
import { StudentRegistration as StudentRegistrationModel, initStudentRegistration } from './models/StudentRegistration';
import { BsitCurriculum as BsitCurriculumModel, initBsitCurriculum } from './models/BsitCurriculum';
import { BsitSchedule as BsitScheduleModel, initBsitSchedule } from './models/BsitSchedule';
import { StudentEnrollment as StudentEnrollmentModel, initStudentEnrollment } from './models/StudentEnrollment';
import { UserSession as UserSessionModel, initUserSession } from './models/UserSession';
import { Request as RequestModel, initRequest } from './models/Request';
import { Notification as NotificationModel, initNotification } from './models/Notification';
import { Requirements as RequirementsModel, initRequirements } from './models/Requirements';

// Load environment variables
dotenv.config();

// Check if we're in production
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
        connectTimeout: 60000
    },
    logging: isProduction ? false : console.log, // Disable logging in production
    pool: {
        max: isProduction ? 10 : 5,
        min: isProduction ? 2 : 0,
        acquire: 60000,
        idle: 10000
    }
});

// Initialize all models
export const initializeModels = () => {
    initUser(sequelize);
    initStudentRegistration(sequelize);
    initBsitCurriculum(sequelize);
    initBsitSchedule(sequelize);
    initStudentEnrollment(sequelize);
    initRequirements(sequelize);
    initUserSession(sequelize); // Re-enabled for login functionality
    
    // Temporarily skip these models to avoid key limit issues
    // initStudent(sequelize);
    // initDepartment(sequelize);
    // initCourse(sequelize);
    // initSubject(sequelize);
    // initSchoolYear(sequelize);
    // initSemester(sequelize);
    // initSchedule(sequelize);
    // initEnrollment(sequelize);
    // initRequest(sequelize);
    initNotification(sequelize); // Re-enabled for notification functionality
};

// Define associations
export const defineAssociations = () => {
    // Only essential associations for now
    // User associations
    // UserModel.hasOne(StudentModel, { foreignKey: 'userId' });
    // StudentModel.belongsTo(UserModel, { foreignKey: 'userId' });

    // Department associations
    // DepartmentModel.hasMany(CourseModel, { foreignKey: 'departmentId' });
    // CourseModel.belongsTo(DepartmentModel, { foreignKey: 'departmentId' });

    // Course associations
    // CourseModel.hasMany(StudentModel, { foreignKey: 'courseId' });
    // StudentModel.belongsTo(CourseModel, { foreignKey: 'courseId' });

    // Subject associations
    // SubjectModel.belongsTo(CourseModel, { foreignKey: 'courseId' });
    // CourseModel.hasMany(SubjectModel, { foreignKey: 'courseId' });

    // Schedule associations
    // ScheduleModel.belongsTo(SubjectModel, { foreignKey: 'subjectId' });
    // SubjectModel.hasMany(ScheduleModel, { foreignKey: 'subjectId' });

    // Enrollment associations
    // EnrollmentModel.belongsTo(StudentModel, { foreignKey: 'studentId' });
    // StudentModel.hasMany(EnrollmentModel, { foreignKey: 'studentId' });
    // EnrollmentModel.belongsTo(ScheduleModel, { foreignKey: 'scheduleId' });
    // ScheduleModel.hasMany(EnrollmentModel, { foreignKey: 'scheduleId' });

    // Student Registration associations
    StudentRegistrationModel.belongsTo(UserModel, { foreignKey: 'userId' });
    UserModel.hasMany(StudentRegistrationModel, { foreignKey: 'userId' });

    // BSIT Curriculum associations
    BsitCurriculumModel.hasMany(BsitScheduleModel, { foreignKey: 'curriculumId' });
    BsitScheduleModel.belongsTo(BsitCurriculumModel, { foreignKey: 'curriculumId' });

    // Student Enrollment associations
    // StudentEnrollmentModel.belongsTo(StudentModel, { foreignKey: 'studentId' });
    // StudentModel.hasMany(StudentEnrollmentModel, { foreignKey: 'studentId' });
    StudentEnrollmentModel.belongsTo(BsitScheduleModel, { foreignKey: 'scheduleId' });
    BsitScheduleModel.hasMany(StudentEnrollmentModel, { foreignKey: 'scheduleId' });

    // Request associations
    // RequestModel.belongsTo(UserModel, { foreignKey: 'studentId', as: 'student' });
    // UserModel.hasMany(RequestModel, { foreignKey: 'studentId', as: 'requests' });

    // Notification associations
    NotificationModel.belongsTo(UserModel, { foreignKey: 'userId' });
    UserModel.hasMany(NotificationModel, { foreignKey: 'userId' });
    // NotificationModel.belongsTo(RequestModel, { foreignKey: 'requestId' }); // Keep commented since RequestModel is disabled
    // RequestModel.hasMany(NotificationModel, { foreignKey: 'requestId' }); // Keep commented since RequestModel is disabled
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



        // Database sync - ensure all tables exist with correct structure
        await sequelize.sync({ alter: true }); // This will create missing tables and alter existing ones
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
            
            await UserModel.create({
                idNumber: '2022-00037',
                password: hashedPassword,
                role: 'student',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@student.benedicto.edu.ph',
                isActive: true
            });

            // Temporarily skip student record creation since StudentModel is commented out
            // await StudentModel.create({
            //     userId: newUser.id,
            //     studentNumber: '2022-00037',
            //     fullName: 'Doe, John',
            //     yearOfEntry: new Date().getFullYear(),
            //     studentType: 'First',
            //     semesterEntry: 'First',
            //     applicationType: 'Freshmen',
            //     academicStatus: 'Regular',
            //     currentYearLevel: 1,
            //     currentSemester: 1,
            //     totalUnitsEarned: 0,
            //     cumulativeGPA: 0.00,
            //     isActive: true
            // });
            console.log('✅ Sample student user created (2022-00037/password) - Student record creation skipped');
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
    StudentRegistrationModel,
    BsitCurriculumModel,
    BsitScheduleModel,
    StudentEnrollmentModel,
    UserSessionModel,
    RequirementsModel,
    NotificationModel
    // Temporarily skip these models to avoid key limit issues
    // StudentModel,
    // DepartmentModel,
    // CourseModel,
    // SubjectModel,
    // SchoolYearModel,
    // SemesterModel,
    // ScheduleModel,
    // EnrollmentModel,
    // RequestModel,
};
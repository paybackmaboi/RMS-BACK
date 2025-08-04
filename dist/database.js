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
exports.Notification = exports.Request = exports.Grade = exports.Enrollment = exports.Schedule = exports.Subject = exports.Course = exports.Student = exports.User = exports.connectAndInitialize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
// Import all model initializers
const User_1 = require("./models/User");
const Student_1 = require("./models/Student");
const Course_1 = require("./models/Course");
const Subject_1 = require("./models/Subject");
const Schedule_1 = require("./models/Schedule");
const Enrollment_1 = require("./models/Enrollment");
const Grade_1 = require("./models/Grade");
const Request_1 = require("./models/Request");
const Notification_1 = require("./models/Notification");
dotenv_1.default.config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';
/**
 * Initializes the Sequelize instance, connects to the database,
 * and sets up the models and their associations.
 */
const connectAndInitialize = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // VALIDATION: Ensure all required environment variables are set for the database.
        if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
            throw new Error('One or more database environment variables are not set.');
        }
        // Initialize Sequelize directly with all connection details.
        exports.sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            port: Number(DB_PORT), // Port must be a number
            dialect: DB_DIALECT,
            logging: true, // Temporarily enable logging to see what's happening
        });
        // Initialize all models.
        (0, User_1.initUser)(exports.sequelize);
        (0, Student_1.initStudent)(exports.sequelize);
        (0, Course_1.initCourse)(exports.sequelize);
        (0, Subject_1.initSubject)(exports.sequelize);
        (0, Schedule_1.initSchedule)(exports.sequelize);
        (0, Enrollment_1.initEnrollment)(exports.sequelize);
        (0, Grade_1.initGrade)(exports.sequelize);
        (0, Request_1.initRequest)(exports.sequelize);
        (0, Notification_1.initNotification)(exports.sequelize);
        // --- Define all associations ---
        // User -> Student (One-to-One)
        User_1.User.hasOne(Student_1.Student, { foreignKey: 'userId', as: 'studentDetails' });
        Student_1.Student.belongsTo(User_1.User, { foreignKey: 'userId', as: 'user' });
        // User (as Teacher) -> Schedule (One-to-Many)
        User_1.User.hasMany(Schedule_1.Schedule, { foreignKey: 'teacherId', as: 'schedulesTaught' });
        Schedule_1.Schedule.belongsTo(User_1.User, { foreignKey: 'teacherId', as: 'teacher' });
        // User -> Request (One-to-Many)
        User_1.User.hasMany(Request_1.Request, { foreignKey: 'studentId' });
        Request_1.Request.belongsTo(User_1.User, { foreignKey: 'studentId' });
        // User -> Notification (One-to-Many)
        User_1.User.hasMany(Notification_1.Notification, { foreignKey: 'userId' });
        Notification_1.Notification.belongsTo(User_1.User, { foreignKey: 'userId' });
        // Subject -> Schedule (One-to-Many)
        Subject_1.Subject.hasMany(Schedule_1.Schedule, { foreignKey: 'subjectId' });
        Schedule_1.Schedule.belongsTo(Subject_1.Subject, { foreignKey: 'subjectId' });
        // Student -> Enrollment (One-to-Many)
        Student_1.Student.hasMany(Enrollment_1.Enrollment, { foreignKey: 'studentId' });
        Enrollment_1.Enrollment.belongsTo(Student_1.Student, { foreignKey: 'studentId' });
        // Schedule -> Enrollment (One-to-Many)
        Schedule_1.Schedule.hasMany(Enrollment_1.Enrollment, { foreignKey: 'scheduleId' });
        Enrollment_1.Enrollment.belongsTo(Schedule_1.Schedule, { foreignKey: 'scheduleId' });
        // Enrollment -> Grade (One-to-One)
        Enrollment_1.Enrollment.hasOne(Grade_1.Grade, { foreignKey: 'enrollmentId' });
        Grade_1.Grade.belongsTo(Enrollment_1.Enrollment, { foreignKey: 'enrollmentId' });
        // Authenticate the connection.
        yield exports.sequelize.authenticate();
        console.log('Sequelize has connected to the database successfully.');
        // Sync all models with the database
        yield exports.sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    }
    catch (error) {
        console.error('Failed to connect and initialize the database:', error);
        throw error;
    }
});
exports.connectAndInitialize = connectAndInitialize;
// Export all models for use in other parts of the application.
exports.User = User_1.User;
exports.Student = Student_1.Student;
exports.Course = Course_1.Course;
exports.Subject = Subject_1.Subject;
exports.Schedule = Schedule_1.Schedule;
exports.Enrollment = Enrollment_1.Enrollment;
exports.Grade = Grade_1.Grade;
exports.Request = Request_1.Request;
exports.Notification = Notification_1.Notification;

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2/promise';

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
import { Grade as GradeModel, initGrade } from './models/Grade';
import { Request as RequestModel, initRequest } from './models/Request';
import { Notification as NotificationModel, initNotification } from './models/Notification';

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

export let sequelize: Sequelize;

/**
 * Initializes the Sequelize instance, connects to the database,
 * and sets up the models and their associations.
 */
export const connectAndInitialize = async () => {
    try {
        // VALIDATION: Ensure all required environment variables are set for the database.
        if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
            throw new Error('One or more database environment variables are not set.');
        }

        // Initialize Sequelize directly with all connection details.
        sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            port: Number(DB_PORT), // Port must be a number
            dialect: DB_DIALECT as 'mysql',
            logging: true, // Temporarily enable logging to see what's happening
        });

        // Initialize all models.
        initUser(sequelize);
        initStudent(sequelize);
        initDepartment(sequelize);
        initCourse(sequelize);
        initSubject(sequelize);
        initSchoolYear(sequelize);
        initSemester(sequelize);
        initSchedule(sequelize);
        initEnrollment(sequelize);
        initGrade(sequelize);
        initRequest(sequelize);
        initNotification(sequelize);

        // --- Define all associations ---

        // Department -> Course (One-to-Many)
        DepartmentModel.hasMany(CourseModel, { foreignKey: 'departmentId', as: 'courses' });
        CourseModel.belongsTo(DepartmentModel, { foreignKey: 'departmentId', as: 'department' });

        // Course -> Subject (One-to-Many)
        CourseModel.hasMany(SubjectModel, { foreignKey: 'courseId', as: 'subjects' });
        SubjectModel.belongsTo(CourseModel, { foreignKey: 'courseId', as: 'course' });

        // User -> Student (One-to-One)
        UserModel.hasOne(StudentModel, { foreignKey: 'userId', as: 'studentDetails' });
        StudentModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

        // Course -> Student (One-to-Many)
        CourseModel.hasMany(StudentModel, { foreignKey: 'courseId', as: 'students' });
        StudentModel.belongsTo(CourseModel, { foreignKey: 'courseId', as: 'course' });

        // SchoolYear -> Schedule (One-to-Many)
        SchoolYearModel.hasMany(ScheduleModel, { foreignKey: 'schoolYearId', as: 'schedules' });
        ScheduleModel.belongsTo(SchoolYearModel, { foreignKey: 'schoolYearId', as: 'schoolYear' });

        // Semester -> Schedule (One-to-Many)
        SemesterModel.hasMany(ScheduleModel, { foreignKey: 'semesterId', as: 'schedules' });
        ScheduleModel.belongsTo(SemesterModel, { foreignKey: 'semesterId', as: 'semester' });

        // Subject -> Schedule (One-to-Many)
        SubjectModel.hasMany(ScheduleModel, { foreignKey: 'subjectId', as: 'schedules' });
        ScheduleModel.belongsTo(SubjectModel, { foreignKey: 'subjectId', as: 'subject' });

        // Student -> Enrollment (One-to-Many)
        StudentModel.hasMany(EnrollmentModel, { foreignKey: 'studentId', as: 'enrollments' });
        EnrollmentModel.belongsTo(StudentModel, { foreignKey: 'studentId', as: 'student' });

        // Schedule -> Enrollment (One-to-Many)
        ScheduleModel.hasMany(EnrollmentModel, { foreignKey: 'scheduleId', as: 'enrollments' });
        EnrollmentModel.belongsTo(ScheduleModel, { foreignKey: 'scheduleId', as: 'schedule' });

        // Enrollment -> Grade (One-to-One)
        EnrollmentModel.hasOne(GradeModel, { foreignKey: 'enrollmentId', as: 'grade' });
        GradeModel.belongsTo(EnrollmentModel, { foreignKey: 'enrollmentId', as: 'enrollment' });

        // User -> Request (One-to-Many)
        UserModel.hasMany(RequestModel, { foreignKey: 'studentId', as: 'requests' });
        RequestModel.belongsTo(UserModel, { foreignKey: 'studentId', as: 'student' });

        // User -> Notification (One-to-Many)
        UserModel.hasMany(NotificationModel, { foreignKey: 'userId', as: 'notifications' });
        NotificationModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

        // Authenticate the connection.
        await sequelize.authenticate();
        console.log('Sequelize has connected to the database successfully.');
        
        // Sync database
        await sequelize.sync({ force: false, alter: false });
        console.log('All models were synchronized successfully.');

        // Seed initial data
        const { seedInitialData } = await import('./seedData');
        await seedInitialData();

    } catch (error) {
        console.error('Failed to connect and initialize the database:', error);
        throw error;
    }
};

// Export all models for use in other parts of the application.
export const User = UserModel;
export const Student = StudentModel;
export const Department = DepartmentModel;
export const Course = CourseModel;
export const Subject = SubjectModel;
export const SchoolYear = SchoolYearModel;
export const Semester = SemesterModel;
export const Schedule = ScheduleModel;
export const Enrollment = EnrollmentModel;
export const Grade = GradeModel;
export const Request = RequestModel;
export const Notification = NotificationModel;

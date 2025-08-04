"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStudent = exports.Student = void 0;
const sequelize_1 = require("sequelize");
class Student extends sequelize_1.Model {
}
exports.Student = Student;
const initStudent = (sequelize) => {
    Student.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            // Removed unique constraint to allow multiple student records per user if needed
        },
        courseId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true, // Allow null initially for existing records
        },
        studentNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        // I. PERSONAL DATA
        fullName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        gender: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        maritalStatus: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        dateOfBirth: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        placeOfBirth: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        contactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        religion: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        citizenship: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Filipino',
        },
        country: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Philippines',
        },
        acrNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // Address Information
        cityAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        cityTelNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        provincialAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        provincialTelNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        // II. FAMILY BACKGROUND
        // Father's Information
        fatherName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        fatherAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        fatherOccupation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        fatherCompany: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        fatherContactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        fatherIncome: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // Mother's Information
        motherName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        motherAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        motherOccupation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        motherCompany: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        motherContactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        motherIncome: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // Guardian's Information
        guardianName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        guardianAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        guardianOccupation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        guardianCompany: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        guardianContactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        guardianIncome: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // III. CURRENT ACADEMIC BACKGROUND
        major: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        studentType: {
            type: sequelize_1.DataTypes.ENUM('First', 'Second', 'Summer'),
            allowNull: false,
            defaultValue: 'First',
        },
        semesterEntry: {
            type: sequelize_1.DataTypes.ENUM('First', 'Second', 'Summer'),
            allowNull: false,
            defaultValue: 'First',
        },
        yearOfEntry: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        estimatedYearOfGraduation: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        applicationType: {
            type: sequelize_1.DataTypes.ENUM('Freshmen', 'Transferee', 'Cross Enrollee'),
            allowNull: false,
            defaultValue: 'Freshmen',
        },
        // IV. ACADEMIC HISTORY
        // Elementary
        elementarySchool: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        elementaryAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        elementaryHonor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        elementaryYearGraduated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        // Junior High School
        juniorHighSchool: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        juniorHighAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        juniorHighHonor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        juniorHighYearGraduated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        // Senior High School
        seniorHighSchool: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        seniorHighAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        seniorHighStrand: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighHonor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighYearGraduated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        // Additional Academic Information
        ncaeGrade: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        specialization: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        lastCollegeAttended: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        lastCollegeYearTaken: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        lastCollegeCourse: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        lastCollegeMajor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        // Academic Status
        academicStatus: {
            type: sequelize_1.DataTypes.ENUM('Regular', 'Irregular', 'Probationary', 'Graduated', 'Dropped'),
            allowNull: false,
            defaultValue: 'Regular',
        },
        currentYearLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        currentSemester: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        totalUnitsEarned: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        cumulativeGPA: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'students',
        sequelize: sequelize,
    });
};
exports.initStudent = initStudent;

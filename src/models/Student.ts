import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface StudentAttributes {
    id: number;
    userId: number;
    courseId: number | null; // Allow null for tertiary level students
    studentNumber: string;
    
    // I. PERSONAL DATA
    fullName: string;
    gender?: string;
    maritalStatus?: string; 
    dateOfBirth?: Date;
    placeOfBirth?: string; 
    email?: string;
    contactNumber?: string; 
    religion?: string; 
    citizenship?: string;
    country?: string; 
    acrNumber?: string; 
    
    // Address Information
    cityAddress?: string; 
    cityTelNumber?: string;
    provincialAddress?: string; 
    provincialTelNumber?: string;
    
    // II. FAMILY BACKGROUND
    // Father's Information
    fatherName?: string; 
    fatherAddress?: string;
    fatherOccupation?: string; 
    fatherCompany?: string; 
    fatherContactNumber?: string; 
    fatherIncome?: string; 
    
    // Mother's Information
    motherName?: string; 
    motherAddress?: string;
    motherOccupation?: string;
    motherCompany?: string;
    motherContactNumber?: string; 
    motherIncome?: string; 
    
    // Guardian's Information
    guardianName?: string; 
    guardianAddress?: string; 
    guardianOccupation?: string; 
    guardianCompany?: string; 
    guardianContactNumber?: string; 
    guardianIncome?: string; 
    
    // III. CURRENT ACADEMIC BACKGROUND
    major?: string;
    studentType: 'First' | 'Second' | 'Summer';
    semesterEntry: 'First' | 'Second' | 'Summer';
    yearOfEntry: number;
    estimatedYearOfGraduation?: number | null;
    applicationType: 'Freshmen' | 'Transferee' | 'Cross Enrollee';
    
    // IV. ACADEMIC HISTORY
    // Elementary
    elementarySchool?: string;
    elementaryAddress?: string; 
    elementaryHonor?: string;
    elementaryYearGraduated?: number; 
    
    // Junior High School
    juniorHighSchool?: string; 
    juniorHighAddress?: string; 
    juniorHighHonor?: string;
    juniorHighYearGraduated?: number;
    
    // Senior High School
    seniorHighSchool?: string; 
    seniorHighAddress?: string;
    seniorHighStrand?: string;
    seniorHighHonor?: string;
    seniorHighYearGraduated?: number; 
    
    // Additional Academic Information
    ncaeGrade?: string;
    specialization?: string;
    lastCollegeAttended?: string;
    lastCollegeYearTaken?: number | null;
    lastCollegeCourse?: string;
    lastCollegeMajor?: string;
    
    // Academic Status
    academicStatus: 'Regular' | 'Irregular' | 'Probationary' | 'Graduated' | 'Dropped';
    currentYearLevel: number;
    currentSemester: number;
    totalUnitsEarned: number;
    cumulativeGPA: number;
    isActive: boolean;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
    public id!: number;
    public userId!: number;
    public courseId!: number | null;
    public studentNumber!: string;
    
    // I. PERSONAL DATA
    public fullName!: string;
    public gender?: string;
    public maritalStatus?: string;
    public dateOfBirth?: Date;
    public placeOfBirth?: string;
    public email?: string;
    public contactNumber?: string;
    public religion?: string;
    public citizenship?: string;
    public country?: string;
    public acrNumber?: string;
    
    // Address Information
    public cityAddress?: string;
    public cityTelNumber?: string;
    public provincialAddress?: string;
    public provincialTelNumber?: string;
    
    // II. FAMILY BACKGROUND
    // Father's Information
    public fatherName?: string;
    public fatherAddress?: string;
    public fatherOccupation?: string;
    public fatherCompany?: string;
    public fatherContactNumber?: string;
    public fatherIncome?: string;
    
    // Mother's Information
    public motherName?: string;
    public motherAddress?: string;
    public motherOccupation?: string;
    public motherCompany?: string;
    public motherContactNumber?: string;
    public motherIncome?: string;
    
    // Guardian's Information
    public guardianName?: string;
    public guardianAddress?: string;
    public guardianOccupation?: string;
    public guardianCompany?: string;
    public guardianContactNumber?: string;
    public guardianIncome?: string;
    
    // III. CURRENT ACADEMIC BACKGROUND
    public major?: string;
    public studentType!: 'First' | 'Second' | 'Summer';
    public semesterEntry!: 'First' | 'Second' | 'Summer';
    public yearOfEntry!: number;
    public estimatedYearOfGraduation?: number | null;
    public applicationType!: 'Freshmen' | 'Transferee' | 'Cross Enrollee';
    
    // IV. ACADEMIC HISTORY
    // Elementary
    public elementarySchool?: string;
    public elementaryAddress?: string;
    public elementaryHonor?: string;
    public elementaryYearGraduated?: number;
    
    // Junior High School
    public juniorHighSchool?: string;
    public juniorHighAddress?: string;
    public juniorHighHonor?: string;
    public juniorHighYearGraduated?: number;
    
    // Senior High School
    public seniorHighSchool?: string;
    public seniorHighAddress?: string;
    public seniorHighStrand?: string;
    public seniorHighHonor?: string;
    public seniorHighYearGraduated?: number;
    
    // Additional Academic Information
    public ncaeGrade?: string;
    public specialization?: string;
    public lastCollegeAttended?: string;
    public lastCollegeYearTaken?: number | null;
    public lastCollegeCourse?: string;
    public lastCollegeMajor?: string;
    
    // Academic Status
    public academicStatus!: 'Regular' | 'Irregular' | 'Probationary' | 'Graduated' | 'Dropped';
    public currentYearLevel!: number;
    public currentSemester!: number;
    public totalUnitsEarned!: number;
    public cumulativeGPA!: number;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initStudent = (sequelize: Sequelize) => {
    Student.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            // Removed unique constraint to allow multiple student records per user if needed
        },
        courseId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true, // Allow null initially for existing records
        },
        studentNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        
        // I. PERSONAL DATA
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING(10),
            allowNull: true, // Will be filled later
        },
        maritalStatus: {
            type: DataTypes.STRING(20),
            allowNull: true, // Will be filled later
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true, // Will be filled later
        },
        placeOfBirth: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        contactNumber: {
            type: DataTypes.STRING(20),
            allowNull: true, // Will be filled later
        },
        religion: {
            type: DataTypes.STRING(50),
            allowNull: true, // Will be filled later
        },
        citizenship: {
            type: DataTypes.STRING(50),
            allowNull: true, // Will be filled later
            defaultValue: 'Filipino',
        },
        country: {
            type: DataTypes.STRING(50),
            allowNull: true, // Will be filled later
            defaultValue: 'Philippines',
        },
        acrNumber: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        
        // Address Information
        cityAddress: {
            type: DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        cityTelNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        provincialAddress: {
            type: DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        provincialTelNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        
        // II. FAMILY BACKGROUND
        // Father's Information
        fatherName: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        fatherAddress: {
            type: DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        fatherOccupation: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        fatherCompany: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        fatherContactNumber: {
            type: DataTypes.STRING(20),
            allowNull: true, // Will be filled later
        },
        fatherIncome: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        
        // Mother's Information
        motherName: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        motherAddress: {
            type: DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        motherOccupation: {
            type: DataTypes.STRING(100),
            allowNull: true, 
        },
        motherCompany: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        motherContactNumber: {
            type: DataTypes.STRING(20),
            allowNull: true, // Will be filled later
        },
        motherIncome: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        
        // Guardian's Information
        guardianName: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        guardianAddress: {
            type: DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        guardianOccupation: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        guardianCompany: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        guardianContactNumber: {
            type: DataTypes.STRING(20),
            allowNull: true, // Will be filled later
        },
        guardianIncome: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        
        // III. CURRENT ACADEMIC BACKGROUND
        major: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        studentType: {
            type: DataTypes.ENUM('First', 'Second', 'Summer'),
            allowNull: false,
            defaultValue: 'First',
        },
        semesterEntry: {
            type: DataTypes.ENUM('First', 'Second', 'Summer'),
            allowNull: false,
            defaultValue: 'First',
        },
        yearOfEntry: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        estimatedYearOfGraduation: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        applicationType: {
            type: DataTypes.ENUM('Freshmen', 'Transferee', 'Cross Enrollee'),
            allowNull: false,
            defaultValue: 'Freshmen',
        },
        
        // IV. ACADEMIC HISTORY
        // Elementary
        elementarySchool: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        elementaryAddress: {
            type: DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        elementaryHonor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        elementaryYearGraduated: {
            type: DataTypes.INTEGER,
            allowNull: true, // Will be filled later
        },
        
        // Junior High School
        juniorHighSchool: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        juniorHighAddress: {
            type: DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        juniorHighHonor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        juniorHighYearGraduated: {
            type: DataTypes.INTEGER,
            allowNull: true, // Will be filled later
        },
        
        // Senior High School
        seniorHighSchool: {
            type: DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        seniorHighAddress: {
            type: DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        seniorHighStrand: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighHonor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighYearGraduated: {
            type: DataTypes.INTEGER,
            allowNull: true, // Will be filled later
        },
        
        // Additional Academic Information
        ncaeGrade: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        specialization: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        lastCollegeAttended: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        lastCollegeYearTaken: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        lastCollegeCourse: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        lastCollegeMajor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        
        // Academic Status
        academicStatus: {
            type: DataTypes.ENUM('Regular', 'Irregular', 'Probationary', 'Graduated', 'Dropped'),
            allowNull: false,
            defaultValue: 'Regular',
        },
        currentYearLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        currentSemester: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        totalUnitsEarned: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        cumulativeGPA: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'students',
        sequelize: sequelize,
    });
};

export default initStudent;
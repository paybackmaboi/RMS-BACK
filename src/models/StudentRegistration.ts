import { Model, DataTypes, Sequelize } from 'sequelize';

export interface StudentRegistrationAttributes {
    id: number;
    userId: number;
    studentId: string;
    
    // Basic Information
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth?: Date;
    placeOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    nationality: string;
    religion?: string;
    
    // Contact Information
    email?: string;
    contactNumber?: string;
    cityAddress?: string;
    cityTelNumber?: string;
    provincialAddress?: string;
    provincialTelNumber?: string;
    
    // Family Background
    fatherName?: string;
    fatherAddress?: string;
    fatherOccupation?: string;
    fatherCompany?: string;
    fatherContactNumber?: string;
    fatherIncome?: string;
    
    motherName?: string;
    motherAddress?: string;
    motherOccupation?: string;
    motherCompany?: string;
    motherContactNumber?: string;
    motherIncome?: string;
    
    guardianName?: string;
    guardianAddress?: string;
    guardianOccupation?: string;
    guardianCompany?: string;
    guardianContactNumber?: string;
    guardianIncome?: string;
    
    // Academic Information
    yearLevel: string;
    semester: string;
    schoolYear: string;
    applicationType: string;
    studentType: string;
    
    // Academic Background
    elementarySchool?: string;
    elementaryAddress?: string;
    elementaryHonor?: string;
    elementaryYearGraduated?: number;
    
    juniorHighSchool?: string;
    juniorHighAddress?: string;
    juniorHighHonor?: string;
    juniorHighYearGraduated?: number;
    
    seniorHighSchool?: string;
    seniorHighAddress?: string;
    seniorHighStrand?: string;
    seniorHighHonor?: string;
    seniorHighYearGraduated?: number;
    
    ncaeGrade?: string;
    specialization?: string;
    
    // College Background (if applicable)
    lastCollegeAttended?: string;
    lastCollegeYearTaken?: number;
    lastCollegeCourse?: string;
    lastCollegeMajor?: string;
    
    // Course Information
    course: string;
    major: string;
    
    // Registration Status
    registrationStatus: 'Pending' | 'Approved' | 'Rejected';
    approvedBy?: string;
    approvedAt?: Date;
    remarks?: string;
    
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface StudentRegistrationCreationAttributes extends Omit<StudentRegistrationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class StudentRegistration extends Model<StudentRegistrationAttributes, StudentRegistrationCreationAttributes> implements StudentRegistrationAttributes {
    public id!: number;
    public userId!: number;
    public studentId!: string;
    
    // Basic Information
    public firstName!: string;
    public middleName?: string;
    public lastName!: string;
    public dateOfBirth?: Date;
    public placeOfBirth?: string;
    public gender?: string;
    public maritalStatus?: string;
    public nationality!: string;
    public religion?: string;
    
    // Contact Information
    public email?: string;
    public contactNumber?: string;
    public cityAddress?: string;
    public cityTelNumber?: string;
    public provincialAddress?: string;
    public provincialTelNumber?: string;
    
    // Family Background
    public fatherName?: string;
    public fatherAddress?: string;
    public fatherOccupation?: string;
    public fatherCompany?: string;
    public fatherContactNumber?: string;
    public fatherIncome?: string;
    
    public motherName?: string;
    public motherAddress?: string;
    public motherOccupation?: string;
    public motherCompany?: string;
    public motherContactNumber?: string;
    public motherIncome?: string;
    
    public guardianName?: string;
    public guardianAddress?: string;
    public guardianOccupation?: string;
    public guardianCompany?: string;
    public guardianContactNumber?: string;
    public guardianIncome?: string;
    
    // Academic Information
    public yearLevel!: string;
    public semester!: string;
    public schoolYear!: string;
    public applicationType!: string;
    public studentType!: string;
    
    // Academic Background
    public elementarySchool?: string;
    public elementaryAddress?: string;
    public elementaryHonor?: string;
    public elementaryYearGraduated?: number;
    
    public juniorHighSchool?: string;
    public juniorHighAddress?: string;
    public juniorHighHonor?: string;
    public juniorHighYearGraduated?: number;
    
    public seniorHighSchool?: string;
    public seniorHighAddress?: string;
    public seniorHighStrand?: string;
    public seniorHighHonor?: string;
    public seniorHighYearGraduated?: number;
    
    public ncaeGrade?: string;
    public specialization?: string;
    
    // College Background (if applicable)
    public lastCollegeAttended?: string;
    public lastCollegeYearTaken?: number;
    public lastCollegeCourse?: string;
    public lastCollegeMajor?: string;
    
    // Course Information
    public course!: string;
    public major!: string;
    
    // Registration Status
    public registrationStatus!: 'Pending' | 'Approved' | 'Rejected';
    public approvedBy?: string;
    public approvedAt?: Date;
    public remarks?: string;
    
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initStudentRegistration = (sequelize: Sequelize) => {
    StudentRegistration.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        studentId: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        
        // Basic Information
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        middleName: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        placeOfBirth: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        maritalStatus: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        nationality: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Filipino',
        },
        religion: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        
        // Contact Information
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        contactNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        cityAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cityTelNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        provincialAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        provincialTelNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        
        // Family Background
        fatherName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        fatherAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        fatherOccupation: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        fatherCompany: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        fatherContactNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        fatherIncome: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        
        motherName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        motherAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
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
            allowNull: true,
        },
        motherIncome: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        
        guardianName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        guardianAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        guardianOccupation: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        guardianCompany: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        guardianContactNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        guardianIncome: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        
        // Academic Information
        yearLevel: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        semester: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        schoolYear: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        applicationType: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'Freshmen',
        },
        studentType: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'First',
        },
        
        // Academic Background
        elementarySchool: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        elementaryAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        elementaryHonor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        elementaryYearGraduated: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        
        juniorHighSchool: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        juniorHighAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        juniorHighHonor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        juniorHighYearGraduated: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        
        seniorHighSchool: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        seniorHighStrand: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        seniorHighHonor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighYearGraduated: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        
        ncaeGrade: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        specialization: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        
        // College Background (if applicable)
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
        
        // Course Information
        course: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'Bachelor of Science in Information Technology',
        },
        major: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'Information Technology',
        },
        
        // Registration Status
        registrationStatus: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        approvedBy: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        
        // Timestamps
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'student_registrations',
        sequelize: sequelize,
        timestamps: true,
        indexes: [
            {
                name: 'idx_student_registrations_userId',
                fields: ['userId']
            },
            {
                name: 'idx_student_registrations_yearLevel',
                fields: ['yearLevel']
            },
            {
                name: 'idx_student_registrations_semester',
                fields: ['semester']
            },
            {
                name: 'idx_student_registrations_schoolYear',
                fields: ['schoolYear']
            }
        ]
    });
};

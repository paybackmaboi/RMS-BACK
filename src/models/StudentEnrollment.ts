import { Model, DataTypes, Sequelize } from 'sequelize';

export interface StudentEnrollmentAttributes {
    id: number;
    studentId: number;
    scheduleId: number;
    enrollmentDate: Date;
    enrollmentStatus: 'Enrolled' | 'Dropped' | 'Completed';
    grade?: string;
    remarks?: string;
}

export interface StudentEnrollmentCreationAttributes extends Omit<StudentEnrollmentAttributes, 'id' | 'enrollmentDate'> {}

export class StudentEnrollment extends Model<StudentEnrollmentAttributes, StudentEnrollmentCreationAttributes> implements StudentEnrollmentAttributes {
    public id!: number;
    public studentId!: number;
    public scheduleId!: number;
    public enrollmentDate!: Date;
    public enrollmentStatus!: 'Enrolled' | 'Dropped' | 'Completed';
    public grade?: string;
    public remarks?: string;
}

export const initStudentEnrollment = (sequelize: Sequelize) => {
    StudentEnrollment.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        scheduleId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'bsit_schedules',
                key: 'id'
            }
        },
        enrollmentDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        enrollmentStatus: {
            type: DataTypes.ENUM('Enrolled', 'Dropped', 'Completed'),
            allowNull: false,
            defaultValue: 'Enrolled',
        },
        grade: {
            type: DataTypes.STRING(5),
            allowNull: true,
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'student_enrollments',
        sequelize: sequelize,
        timestamps: false,
        indexes: [
            {
                name: 'unique_student_schedule',
                unique: true,
                fields: ['studentId', 'scheduleId']
            },
            {
                name: 'idx_student_enrollments_studentId',
                fields: ['studentId']
            },
            {
                name: 'idx_student_enrollments_scheduleId',
                fields: ['scheduleId']
            }
        ]
    });
};

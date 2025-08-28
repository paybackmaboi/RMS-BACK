"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStudentEnrollment = exports.StudentEnrollment = void 0;
const sequelize_1 = require("sequelize");
class StudentEnrollment extends sequelize_1.Model {
}
exports.StudentEnrollment = StudentEnrollment;
const initStudentEnrollment = (sequelize) => {
    StudentEnrollment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'students',
                key: 'id'
            }
        },
        scheduleId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'bsit_schedules',
                key: 'id'
            }
        },
        enrollmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        enrollmentStatus: {
            type: sequelize_1.DataTypes.ENUM('Enrolled', 'Dropped', 'Completed'),
            allowNull: false,
            defaultValue: 'Enrolled',
        },
        grade: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: true,
        },
        remarks: {
            type: sequelize_1.DataTypes.TEXT,
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
exports.initStudentEnrollment = initStudentEnrollment;

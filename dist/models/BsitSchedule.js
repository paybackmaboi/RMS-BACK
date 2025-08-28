"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBsitSchedule = exports.BsitSchedule = void 0;
const sequelize_1 = require("sequelize");
class BsitSchedule extends sequelize_1.Model {
}
exports.BsitSchedule = BsitSchedule;
const initBsitSchedule = (sequelize) => {
    BsitSchedule.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        curriculumId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'bsit_curriculum',
                key: 'id'
            }
        },
        schoolYear: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        semester: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        yearLevel: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        // Schedule Details
        day: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        startTime: {
            type: sequelize_1.DataTypes.TIME,
            allowNull: false,
        },
        endTime: {
            type: sequelize_1.DataTypes.TIME,
            allowNull: false,
        },
        room: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        instructor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        maxStudents: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 40,
        },
        currentEnrollment: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        // Schedule Status
        scheduleStatus: {
            type: sequelize_1.DataTypes.ENUM('Open', 'Closed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Open',
        },
        remarks: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        // Timestamps
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        tableName: 'bsit_schedules',
        sequelize: sequelize,
        timestamps: true,
        indexes: [
            {
                name: 'idx_schedule_lookup',
                fields: ['schoolYear', 'semester', 'yearLevel', 'day']
            },
            {
                name: 'idx_bsit_schedules_yearLevel',
                fields: ['yearLevel']
            },
            {
                name: 'idx_bsit_schedules_semester',
                fields: ['semester']
            },
            {
                name: 'idx_bsit_schedules_schoolYear',
                fields: ['schoolYear']
            },
            {
                name: 'idx_bsit_schedules_day',
                fields: ['day']
            }
        ]
    });
};
exports.initBsitSchedule = initBsitSchedule;

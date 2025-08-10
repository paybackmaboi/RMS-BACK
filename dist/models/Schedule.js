"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSchedule = exports.Schedule = void 0;
const sequelize_1 = require("sequelize");
class Schedule extends sequelize_1.Model {
}
exports.Schedule = Schedule;
const initSchedule = (sequelize) => {
    Schedule.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        subjectId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        schoolYearId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        semesterId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        dayOfWeek: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        startTime: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        endTime: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        room: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        maxStudents: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 50,
        },
        currentEnrolled: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'schedules',
        sequelize: sequelize,
    });
};
exports.initSchedule = initSchedule;

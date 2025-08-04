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
        schoolYear: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        semester: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        days: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        time: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        room: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        teacherId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
    }, {
        tableName: 'schedules',
        sequelize: sequelize,
    });
};
exports.initSchedule = initSchedule;

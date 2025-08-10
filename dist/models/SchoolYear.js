"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSchoolYear = exports.SchoolYear = void 0;
const sequelize_1 = require("sequelize");
class SchoolYear extends sequelize_1.Model {
}
exports.SchoolYear = SchoolYear;
const initSchoolYear = (sequelize) => {
    SchoolYear.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        year: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        isCurrent: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'school_years',
        sequelize: sequelize,
    });
};
exports.initSchoolYear = initSchoolYear;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDepartment = exports.Department = void 0;
const sequelize_1 = require("sequelize");
class Department extends sequelize_1.Model {
}
exports.Department = Department;
const initDepartment = (sequelize) => {
    Department.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'departments',
        sequelize: sequelize,
    });
};
exports.initDepartment = initDepartment;

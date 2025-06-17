"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRequest = exports.Request = void 0;
const sequelize_1 = require("sequelize");
class Request extends sequelize_1.Model {
}
exports.Request = Request;
const initRequest = (sequelize) => {
    Request.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        documentType: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        purpose: {
            type: new sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            // FIX: Added 'ready for pick-up' to the ENUM definition
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected', 'ready for pick-up'),
            defaultValue: 'pending',
            allowNull: false,
        },
        notes: {
            type: new sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        filePath: {
            type: new sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        tableName: 'requests',
        sequelize: sequelize,
    });
};
exports.initRequest = initRequest;

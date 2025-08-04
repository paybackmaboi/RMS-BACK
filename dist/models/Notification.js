"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initNotification = exports.Notification = void 0;
const sequelize_1 = require("sequelize");
class Notification extends sequelize_1.Model {
}
exports.Notification = Notification;
const initNotification = (sequelize) => {
    Notification.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        requestId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        message: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        isRead: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    }, {
        tableName: 'notifications',
        sequelize,
    });
};
exports.initNotification = initNotification;

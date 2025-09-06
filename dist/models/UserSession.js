"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserSession = exports.UserSession = void 0;
const sequelize_1 = require("sequelize");
class UserSession extends sequelize_1.Model {
}
exports.UserSession = UserSession;
const initUserSession = (sequelize) => {
    UserSession.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
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
        sessionToken: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'user_sessions',
        timestamps: false,
    });
};
exports.initUserSession = initUserSession;

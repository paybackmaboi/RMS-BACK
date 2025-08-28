"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUser = exports.User = void 0;
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User extends sequelize_1.Model {
    comparePassword(candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.compare(candidatePassword, this.password);
        });
    }
}
exports.User = User;
const initUser = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        idNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            // Removed unique constraint to avoid "Too many keys" error
            // Uniqueness will be handled at application level
        },
        password: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('student', 'admin', 'accounting'),
            allowNull: false,
            defaultValue: 'student',
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        middleName: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            // Removed unique constraint to avoid "Too many keys" error
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        profilePhoto: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'URL to stored profile photo'
        },
    }, {
        sequelize,
        tableName: 'users',
        hooks: {
            beforeCreate: (user) => __awaiter(void 0, void 0, void 0, function* () {
                const salt = yield bcryptjs_1.default.genSalt(10);
                user.password = yield bcryptjs_1.default.hash(user.password, salt);
            }),
            beforeUpdate: (user) => __awaiter(void 0, void 0, void 0, function* () {
                if (user.changed('password')) {
                    const salt = yield bcryptjs_1.default.genSalt(10);
                    user.password = yield bcryptjs_1.default.hash(user.password, salt);
                }
            }),
        },
    });
};
exports.initUser = initUser;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
function up(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Add profilePhoto column to users table
            yield queryInterface.addColumn('users', 'profilePhoto', {
                type: sequelize_1.DataTypes.STRING(500),
                allowNull: true,
                comment: 'URL to stored profile photo'
            });
            console.log('✅ Added profilePhoto column to users table');
        }
        catch (error) {
            console.error('❌ Error adding profilePhoto column:', error);
            throw error;
        }
    });
}
function down(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Remove profilePhoto column from users table
            yield queryInterface.removeColumn('users', 'profilePhoto');
            console.log('✅ Removed profilePhoto column from users table');
        }
        catch (error) {
            console.error('❌ Error removing profilePhoto column:', error);
            throw error;
        }
    });
}

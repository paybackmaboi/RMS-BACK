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
            // First, make requestId column nullable
            yield queryInterface.changeColumn('notifications', 'requestId', {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                comment: 'Optional request ID for document requests, null for requirements announcements'
            });
            // Add type column for different notification types
            yield queryInterface.addColumn('notifications', 'type', {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true,
                defaultValue: 'request',
                comment: 'Type of notification: request, requirements_reminder, general, etc.'
            });
            console.log('✅ Updated notifications table: made requestId nullable and added type column');
        }
        catch (error) {
            console.error('❌ Error updating notifications table:', error);
            throw error;
        }
    });
}
function down(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Remove type column
            yield queryInterface.removeColumn('notifications', 'type');
            // Make requestId required again
            yield queryInterface.changeColumn('notifications', 'requestId', {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                comment: 'Request ID for document requests'
            });
            console.log('✅ Reverted notifications table changes');
        }
        catch (error) {
            console.error('❌ Error reverting notifications table changes:', error);
            throw error;
        }
    });
}

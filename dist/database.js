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
exports.Request = exports.User = exports.connectAndInitialize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
// Import model initializers
const User_1 = require("./models/User");
const Request_1 = require("./models/Request");
dotenv_1.default.config();
const DB_NAME = process.env.DB_NAME || 'test_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root'; // Default to empty string for safety
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';
/**
 * Ensures the database exists, then initializes the Sequelize instance,
 * connects to the database, and sets up the models.
 */
const connectAndInitialize = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Connect to the MySQL server (not a specific database) to create the database.
        const connection = yield promise_1.default.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
        });
        yield connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`Database '${DB_NAME}' created or already exists.`);
        yield connection.end();
        // 2. NOW, initialize the Sequelize instance to connect to the newly verified database.
        exports.sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            dialect: DB_DIALECT,
            logging: false,
        });
        // 3. Initialize all models.
        (0, User_1.initUser)(exports.sequelize);
        (0, Request_1.initRequest)(exports.sequelize);
        // 4. Define all associations.
        User_1.User.hasMany(Request_1.Request, { foreignKey: 'studentId' });
        Request_1.Request.belongsTo(User_1.User, { foreignKey: 'studentId' });
        // 5. Authenticate the connection.
        yield exports.sequelize.authenticate();
        console.log('Sequelize has connected to the database successfully.');
    }
    catch (error) {
        console.error('Failed to connect and initialize the database:', error);
        throw error; // Re-throw the error to be caught by the calling function
    }
});
exports.connectAndInitialize = connectAndInitialize;
// Export the models for use in other parts of the application.
// Note: These are only usable *after* connectAndInitialize has been called.
exports.User = User_1.User;
exports.Request = Request_1.Request;

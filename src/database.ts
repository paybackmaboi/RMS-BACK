import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2/promise';

// Import model initializers
import { User as UserModel, initUser } from './models/User';
import { Request as RequestModel, initRequest } from './models/Request';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'test_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || ''; // Default to empty string for safety
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

// Declare sequelize variable, but do not initialize it yet.
export let sequelize: Sequelize;

/**
 * Ensures the database exists, then initializes the Sequelize instance,
 * connects to the database, and sets up the models.
 */
export const connectAndInitialize = async () => {
    try {
        // 1. Connect to the MySQL server (not a specific database) to create the database.
        const connection = await mysql2.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
        });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`Database '${DB_NAME}' created or already exists.`);
        await connection.end();

        // 2. NOW, initialize the Sequelize instance to connect to the newly verified database.
        sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            dialect: DB_DIALECT as 'mysql',
            logging: false,
        });

        // 3. Initialize all models.
        initUser(sequelize);
        initRequest(sequelize);

        // 4. Define all associations.
        UserModel.hasMany(RequestModel, { foreignKey: 'studentId' });
        RequestModel.belongsTo(UserModel, { foreignKey: 'studentId' });

        // 5. Authenticate the connection.
        await sequelize.authenticate();
        console.log('Sequelize has connected to the database successfully.');

    } catch (error) {
        console.error('Failed to connect and initialize the database:', error);
        throw error; // Re-throw the error to be caught by the calling function
    }
};

// Export the models for use in other parts of the application.
// Note: These are only usable *after* connectAndInitialize has been called.
export const User = UserModel;
export const Request = RequestModel;

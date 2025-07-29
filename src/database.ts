import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Import model initializers
import { User as UserModel, initUser } from './models/User';
import { Request as RequestModel, initRequest } from './models/Request';

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT; // ADDED: Port is needed for Aiven
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

export let sequelize: Sequelize;

/**
 * Initializes the Sequelize instance, connects to the database,
 * and sets up the models.
 */
export const connectAndInitialize = async () => {
    try {
        // VALIDATION: Ensure all required environment variables are set for the database.
        if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
            throw new Error('One or more database environment variables are not set.');
        }
        
        // CHANGED: Initialize Sequelize directly with all connection details.
        sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            port: Number(DB_PORT), // Port must be a number
            dialect: DB_DIALECT as 'mysql',
            dialectOptions: {
                // This SSL block is CRITICAL for connecting to Aiven
                ssl: {
                    require: true,
                    rejectUnauthorized: true,
                },
            },
            logging: false,
        });

        // Initialize all models.
        initUser(sequelize);
        initRequest(sequelize);

        // Define all associations.
        UserModel.hasMany(RequestModel, { foreignKey: 'studentId' });
        RequestModel.belongsTo(UserModel, { foreignKey: 'studentId' });

        // Authenticate the connection.
        await sequelize.authenticate();
        console.log('Sequelize has connected to the Aiven database successfully.');

    } catch (error) {
        console.error('Failed to connect and initialize the database:', error);
        throw error;
    }
};

// Export the models for use in other parts of the application.
export const User = UserModel;
export const Request = RequestModel;
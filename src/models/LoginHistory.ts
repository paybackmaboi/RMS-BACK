import { Model, DataTypes, Sequelize } from 'sequelize';

export interface LoginHistoryAttributes {
    id: number;
    userId: number;
    action: 'login' | 'logout';
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

export interface LoginHistoryCreationAttributes extends Omit<LoginHistoryAttributes, 'id' | 'createdAt'> {}

export class LoginHistory extends Model<LoginHistoryAttributes, LoginHistoryCreationAttributes> {
    public id!: number;
    public userId!: number;
    public action!: 'login' | 'logout';
    public ipAddress?: string;
    public userAgent?: string;
    public createdAt!: Date;
}

export const initLoginHistory = (sequelize: Sequelize): void => {
    LoginHistory.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            action: {
                type: DataTypes.ENUM('login', 'logout'),
                allowNull: false,
            },
            ipAddress: {
                type: DataTypes.STRING(45), 
                allowNull: true,
            },
            userAgent: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: 'login_history',
            timestamps: false,
        }
    );
};

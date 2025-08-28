import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserSessionAttributes {
    id: number;
    userId: number;
    sessionToken: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface UserSessionCreationAttributes extends Omit<UserSessionAttributes, 'id' | 'createdAt'> {}

export class UserSession extends Model<UserSessionAttributes, UserSessionCreationAttributes> {
    public id!: number;
    public userId!: number;
    public sessionToken!: string;
    public expiresAt!: Date;
    public createdAt!: Date;
}

export const initUserSession = (sequelize: Sequelize): void => {
    UserSession.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            sessionToken: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: 'user_sessions',
            timestamps: false,
        }
    );
};
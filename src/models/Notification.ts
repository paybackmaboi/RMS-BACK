import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { User } from './User';

interface NotificationAttributes {
    id: number;
    userId: number;
    message: string;
    isRead: boolean;
    requestId: number;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id'> {}

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
    public id!: number;
    public userId!: number;
    public message!: string;
    public isRead!: boolean;
    public requestId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initNotification = (sequelize: Sequelize) => {
    Notification.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
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
        requestId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    }, {
        tableName: 'notifications',
        sequelize,
    });
};
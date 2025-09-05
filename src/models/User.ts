import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

interface UserAttributes {
    id: number;
    idNumber: string;
    password: string;
    role: 'student' | 'admin' | 'accounting';
    firstName: string;
    lastName: string;
    middleName?: string;
    email?: string;
    phoneNumber?: string;
    isActive: boolean;
    profilePhoto?: string; // URL to stored photo
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public idNumber!: string;
    public password!: string;
    public role!: 'student' | 'admin' | 'accounting';
    public firstName!: string;
    public lastName!: string;
    public middleName?: string;
    public email?: string;
    public phoneNumber?: string;
    public isActive!: boolean;
    public profilePhoto?: string; // Add profile photo property
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
}

export const initUser = (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        idNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            // Removed unique constraint to avoid "Too many keys" error
            // Uniqueness will be handled at application level
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('student', 'admin', 'accounting'),
            allowNull: false,
            defaultValue: 'student',
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        middleName: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            // Removed unique constraint to avoid "Too many keys" error
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        profilePhoto: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'URL to stored profile photo'
        },
    }, {
        sequelize,
        tableName: 'users',
        indexes: [
            {
                unique: true,
                fields: ['idNumber']
            },
            {
                fields: ['role']
            },
            {
                fields: ['isActive']
            }
        ],
        hooks: {
            beforeCreate: async (user: User) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
            beforeUpdate: async (user: User) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    });
};
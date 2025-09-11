import { Model, DataTypes, Sequelize } from 'sequelize';

export interface SubjectsAttributes {
    id: number;
    courseCode: string;
    courseDescription: string;
    units: number;
    yearLevel: string;
    semester: string;
    courseType: 'Lecture' | 'Laboratory' | 'Both';
    prerequisites?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SubjectsCreationAttributes extends Omit<SubjectsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Subjects extends Model<SubjectsAttributes, SubjectsCreationAttributes> implements SubjectsAttributes {
    public id!: number;
    public courseCode!: string;
    public courseDescription!: string;
    public units!: number;
    public yearLevel!: string;
    public semester!: string;
    public courseType!: 'Lecture' | 'Laboratory' | 'Both';
    public prerequisites?: string;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSubjects = (sequelize: Sequelize) => {
    Subjects.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        courseCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        courseDescription: {
            // **FIX: Changed TEXT to STRING to allow indexing.**
            type: DataTypes.STRING, 
            allowNull: false,
        },
        units: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        yearLevel: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        semester: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        courseType: {
            type: DataTypes.ENUM('Lecture', 'Laboratory', 'Both'),
            allowNull: false,
        },
        prerequisites: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'subjects',
        sequelize: sequelize,
        timestamps: true,
        indexes: [
            {
                name: 'unique_course_year_sem_type',
                unique: true,
                fields: ['courseCode', 'yearLevel', 'semester', 'courseType']
            }
        ]
    });
};
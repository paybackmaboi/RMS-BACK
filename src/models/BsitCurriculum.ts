import { Model, DataTypes, Sequelize } from 'sequelize';

export interface BsitCurriculumAttributes {
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

export interface BsitCurriculumCreationAttributes extends Omit<BsitCurriculumAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class BsitCurriculum extends Model<BsitCurriculumAttributes, BsitCurriculumCreationAttributes> implements BsitCurriculumAttributes {
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

export const initBsitCurriculum = (sequelize: Sequelize) => {
    BsitCurriculum.init({
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
            type: DataTypes.TEXT,
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
            type: DataTypes.STRING(10),
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
        tableName: 'bsit_curriculum',
        sequelize: sequelize,
        timestamps: true,
        indexes: [
            {
                name: 'unique_course_year_sem',
                unique: true,
                fields: ['courseCode', 'yearLevel', 'semester']
            },
            {
                name: 'idx_bsit_curriculum_yearLevel',
                fields: ['yearLevel']
            },
            {
                name: 'idx_bsit_curriculum_semester',
                fields: ['semester']
            },
            {
                name: 'idx_bsit_curriculum_courseCode',
                fields: ['courseCode']
            }
        ]
    });
};

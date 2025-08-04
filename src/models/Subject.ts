import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface SubjectAttributes {
    id: number;
    subjectCode: string;
    description: string;
    units: number;
}

interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id'> {}

export class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
    public id!: number;
    public subjectCode!: string;
    public description!: string;
    public units!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSubject = (sequelize: Sequelize) => {
    Subject.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        subjectCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        units: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'subjects',
        sequelize: sequelize,
    });
};
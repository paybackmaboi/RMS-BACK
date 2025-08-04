import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface ScheduleAttributes {
    id: number;
    subjectId: number;
    schoolYear: string;
    semester: string;
    days?: string;
    time?: string;
    room?: string;
    teacherId?: number;
}

interface ScheduleCreationAttributes extends Optional<ScheduleAttributes, 'id'> {}

export class Schedule extends Model<ScheduleAttributes, ScheduleCreationAttributes> implements ScheduleAttributes {
    public id!: number;
    public subjectId!: number;
    public schoolYear!: string;
    public semester!: string;
    public days!: string;
    public time!: string;
    public room!: string;
    public teacherId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSchedule = (sequelize: Sequelize) => {
    Schedule.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        subjectId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        schoolYear: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        semester: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        days: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        room: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        teacherId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
    }, {
        tableName: 'schedules',
        sequelize: sequelize,
    });
};
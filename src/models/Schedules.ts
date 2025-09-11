import { Model, DataTypes, Sequelize } from 'sequelize';

export interface SchedulesAttributes {
    id: number;
    subjectId: number;
    schoolYearId: number;
    semesterId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room?: string;
    maxStudents?: number;
    currentEnrolled: number;
    isActive: boolean;
    
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface SchedulesCreationAttributes extends Omit<SchedulesAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Schedules extends Model<SchedulesAttributes, SchedulesCreationAttributes> implements SchedulesAttributes {
    public id!: number;
    public subjectId!: number;
    public schoolYearId!: number;
    public semesterId!: number;
    public dayOfWeek!: string;
    public startTime!: string;
    public endTime!: string;
    public room!: string;
    public maxStudents!: number;
    public currentEnrolled!: number;
    public isActive!: boolean;
    
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSchedules = (sequelize: Sequelize) => {
    Schedules.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        subjectId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'subjects',
                key: 'id'
            }
        },
        schoolYearId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'school_years',
                key: 'id'
            }
        },
        semesterId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'semesters',
                key: 'id'
            }
        },
        dayOfWeek: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        startTime: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        endTime: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        room: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        maxStudents: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 50,
        },
        currentEnrolled: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
        tableName: 'schedules',
        sequelize: sequelize,
        timestamps: true,
        indexes: [
            {
                name: 'idx_schedule_lookup',
                fields: ['subjectId', 'schoolYearId', 'semesterId']
            }
        ]
    });
};

import Sequelize from "sequelize";
import db from "../../db/models/db";

export interface IUser {
    id?: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email: string;
    password: string;
    role: number;
    statistic?: IUserStatistic;
    avatar?: string;
}

export interface IUserStatistic {
    onReview: number;
    open: number;
    pending: number;
    done: number;
    declined: number;
    count: number;
}

export const User: Sequelize.Model<IUser, IUser> = db.define<IUser, IUser>("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.STRING,
        validate: {
            len: [1, 255],
        },
    },
    lastName: {
        type: Sequelize.STRING,
        validate: {
            len: [1, 255],
        },
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [4, 15],
        },
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    password: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    avatar: {
        type: Sequelize.STRING,
    },
},
);

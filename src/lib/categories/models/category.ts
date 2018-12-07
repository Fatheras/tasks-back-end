import Sequelize from "sequelize";
import db from "../../db/models/db";

export interface ICategory {
    id?: number;
    name: string;
    statistic?: ICategoryStatistic;
}

export interface ICategoryStatistic {
    count: number;
    open: number;
}

export const Category: Sequelize.Model<ICategory, ICategory> = db.define<ICategory, ICategory>("category", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: [1, 255],
            notEmpty: true,
        },
    },
},
    {
        timestamps: false,
    });

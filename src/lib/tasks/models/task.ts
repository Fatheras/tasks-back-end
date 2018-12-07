import Sequelize from "sequelize";
import db from "../../db/models/db";
import { User, IUser } from "../../user/models/user";
import { ICategory, Category } from "../../categories/models/category";

export interface ITask {
    id?: number;
    title: string;
    cost: number;
    status: number;
    categoryId: number;
    category?: ICategory;
    time: string;
    description: string;
    ownerId: number;
    people: number;
    user?: IUser;
    countOfDeals?: number;
}

export const Task: Sequelize.Model<ITask, ITask> = db.define<ITask, ITask>("task", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
            notEmpty: true,
            len: [1, 255],
        },
    },
    cost: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        validate: {
            notEmpty: true,
        },
    },
    status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: true,
        },
    },
    categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: true,
        },
    },
    time: {
        allowNull: false,
        type: Sequelize.DATE,
        validate: {
            notEmpty: true,
        },
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255],
        },
    },
    ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        validate: { notEmpty: true },
    },
    people: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            max: 5,
            min: 1,
            notEmpty: true,
        },
    },
},
);

Task.belongsTo(User, { foreignKey: "ownerId" });
User.hasMany(Task, { foreignKey: "ownerId" });

Task.belongsTo(Category, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
    constraints: false,
});

Category.hasMany(Task, {
    onDelete: "CASCADE",
    constraints: false,
    foreignKey: "categoryId",
});

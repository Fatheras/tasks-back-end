import Sequelize from "sequelize";
import db from "../../db/models/db";
import { User } from "../../user/models/user";
import { Task } from "../../tasks/models/task";

export interface IDeal {
    id?: number;
    userId: number;
    taskId: number;
}

export const Deal: Sequelize.Model<IDeal, IDeal> = db.define<IDeal, IDeal>("deal", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        validate: { notEmpty: true },
    },
    taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Task,
            key: "id",
        },
        validate: { notEmpty: true },
    },
},
    {
        indexes: [
            {
                unique: true,
                fields: ["userId", "taskId"],
            },
        ],
    },
);

Deal.belongsTo(Task, { foreignKey: "taskId" });
Task.hasMany(Deal);

Deal.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Deal);

import Sequelize from "sequelize";
import db from "../../db/models/db";
import { Category, ICategory } from "../../categories/models/category";
import { User, IUser } from "../../user/models/user";

export interface ICategoryManager {
    id?: number;
    categoryId: number;
    userId: number;
    category?: ICategory;
    user?: IUser;
}

export const CategoryManager: Sequelize.Model<ICategoryManager, ICategoryManager> =
    db.define<ICategoryManager, ICategoryManager>("category_manager", {
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
            validate: {
                notEmpty: true,
            },
        },
        categoryId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Category,
                key: "id",
            },
            validate: {
                notEmpty: true,
            },
        },

    },
        {
            indexes: [
                {
                    unique: true,
                    fields: ["categoryId", "userId"],
                },
            ],
            timestamps: false,
        },
    );

CategoryManager.belongsTo(Category, {
    onDelete: "CASCADE",
    constraints: false,
    foreignKey: "categoryId",
});
Category.hasMany(CategoryManager, {
    onDelete: "CASCADE",
    constraints: false,
});

CategoryManager.belongsTo(User, {
    foreignKey: "userId",
});
User.hasMany(CategoryManager);

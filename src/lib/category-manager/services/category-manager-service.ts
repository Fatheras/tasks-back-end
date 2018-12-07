import { CategoryManager, ICategoryManager } from "../models/category-manager";
import { FindOptions } from "sequelize";
import { Category, ICategory } from "../../categories/models/category";
import { User, IUser } from "../../user/models/user";
import {Op} from "sequelize";

export class CategoryManagerService {
    // tslint:disable-next-line:max-line-length
    public static async subscribeCategoryManagers(categoryManagersIds: number[], categoryId: number): Promise<ICategoryManager[]> {
        const categoryManagers: ICategoryManager[] = categoryManagersIds
            .map((categoryManager, index, arr) => {
                return { userId: categoryManager, categoryId };
            });

        const res: number[]  = await CategoryManager.bulkCreate(categoryManagers).map((el) => el.id!);

        return await CategoryManager.findAll({
            where: {
                id: {
                    [Op.in]: res,
                },
            },
            include: [
                {
                    model: User,
                },
            ],
            raw: true,
        }) as any;
    }

    public static async getManagersByCategory(categoryId: number): Promise<IUser[]> {
        const managers: IUser[] = (await CategoryManager.findAll({
            where: {
                categoryId,
            },
            include: [
                {
                    model: User,
                },
            ],
            raw: true,
        }) as any);

        return managers;
    }

    public static async getAllManagerCategoriesIds(userId: number): Promise<number[]> {
        const options: FindOptions<ICategoryManager> = {
            attributes: ["categoryId"],
            where: {
                userId,
            },
            raw: true,
        };

        return (await CategoryManager.findAll(options) as any[])
            .map((category, index, categories) => category.categoryId);
    }

    public static async getAllManagerCategories(userId: number): Promise<ICategoryManager[]> {
        const options: FindOptions<ICategoryManager> = {
            attributes: ["categoryId"],
            where: {
                userId,
            },
            include: [{
                model: Category,
            }],
            subQuery: false,
            group: "categoryId",
        };

        return await CategoryManager.findAll(options);
    }

    public static async removeManager(id: number): Promise<void> {
        await CategoryManager.destroy({
            where: {
                id,
            },
        });
    }
}

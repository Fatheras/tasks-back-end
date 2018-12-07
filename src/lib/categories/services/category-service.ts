import { ICategory, Category } from "../models/category";
import CustomError from "../../tools/error";

export default class CategoryService {
    public static async getAllCategories(): Promise<ICategory[]> {
        return Category.findAll({
            raw: true,
        });
    }

    public static async getCategory(id: number): Promise<ICategory> {
        const category: ICategory | null = await Category.findById(id);

        if (category) {
            return category;
        } else {
            throw new CustomError(400);
        }
    }

    public static async deleteCategory(id: number): Promise<number> {
        return Category.destroy({
            where: {
                id,
            },
        });
    }

    public static async addCategory(category: ICategory): Promise<ICategory> {
        return Category.create(category);
    }
}

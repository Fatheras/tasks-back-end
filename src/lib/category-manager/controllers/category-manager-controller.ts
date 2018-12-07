import { ICategoryManager } from "../models/category-manager";
import { CategoryManagerService } from "../services/category-manager-service";
import { IUser } from "../../user/models/user";
import UserService from "../../user/services/user-service";
import { Request, Response } from "express";
import { ICategory } from "../../categories/models/category";

export class CategoryManagerController {
    public static async getAllManagersCategories(req: Request, res: Response): Promise<void> {
        const token: string = req.headers.authorization!;
        const user: IUser = await UserService.getUserByToken(token);

        const obligations: ICategoryManager[] = await CategoryManagerService.getAllManagerCategories(user.id!);

        const categories: ICategory[] = obligations.map((obligation) => obligation.category!);

        res.status(200).send(categories);
    }

    public static async getAllManagersByCategory(req: Request, res: Response): Promise<void> {
        const managers: IUser[] = await CategoryManagerService.getManagersByCategory(req.query.categoryId);

        res.status(200).send(managers);
    }

    public static async subscribeCategoryManagers(req: Request, res: Response): Promise<void> {
        const categoryManager: ICategoryManager[] = await CategoryManagerService.subscribeCategoryManagers(
            req.body.managers, req.params.id,
        );

        res.status(200).send(categoryManager);
    }

    public static async removeManager(req: Request, res: Response): Promise<void> {
        await CategoryManagerService.removeManager(req.params.id);

        res.status(200).send();
    }
}

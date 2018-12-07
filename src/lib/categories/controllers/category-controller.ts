import { Request, Response } from "express";
import { ICategory } from "../models/category";
import CategoryService from "../services/category-service";
import CustomError from "../../tools/error";
import { ITask } from "../../tasks/models/task";
import TaskService from "../../tasks/services/task-service";
import { Status } from "../../tasks/models/status";
import { CategoryManagerService } from "../../category-manager/services/category-manager-service";

export class CategoryController {
    public static async getAllCategories(req: Request, res: Response): Promise<void> {
        const categories: ICategory[] = await CategoryService.getAllCategories();

        res.status(200).send(categories);
    }

    public static async getCategoriesWithStatistic(req: Request, res: Response): Promise<void> {
        const categories: ICategory[] = (await CategoryService.getAllCategories());
        const tasks: ITask[] = await TaskService.getAllTasks();

        categories.map((category, i, arr) => {
            category.statistic = {
                count: 0,
                open: 0,
            };

            category.statistic!.count = tasks.filter((task, index, array) => {
                return task.categoryId === category.id;
            })!.length;

            category.statistic!.open = tasks.filter((task, index, array) => {
                return task.categoryId === category.id && task.status === Status.Open;
            })!.length;
        });

        res.status(200).send(categories);
    }

    public static async getCategory(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);
        const category: ICategory = await CategoryService.getCategory(id);

        if (category) {
            res.status(200).send(category);
        } else {
            throw new CustomError(404);
        }
    }

    public static async deleteCategory(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);
        const tasks: ITask[] = await TaskService.getAllTasksByCategory(id);
        const hasOpenTasks: boolean = tasks.some((task) => task.status === Status.Open);

        if (hasOpenTasks) {
            throw new CustomError(404);
        }

        const result = await CategoryService.deleteCategory(id);

        if (result) {
            res.status(200).send();
        } else {
            throw new CustomError(400);
        }
    }

    public static async addCategory(req: Request, res: Response): Promise<void> {
        const model: ICategory = {
            name: req.body.categoryName,
        };

        const category: ICategory = await CategoryService.addCategory(model);

        const categoryManagersIds: any = JSON.parse(req.body.managers);

        await CategoryManagerService.subscribeCategoryManagers(categoryManagersIds, category.id!);

        if (category) {
            res.status(200).send(category);
        } else {
            throw new CustomError(400);
        }
    }
}

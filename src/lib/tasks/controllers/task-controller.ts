import TaskService from "../services/task-service";
import { ITask } from "../models/task";
import CustomError from "../../tools/error";
import { Request, Response } from "express";
import { Status } from "../models/status";
import moment from "moment";
import UserService from "../../user/services/user-service";
import { IUser } from "../../user/models/user";
import { CategoryManagerService } from "../../category-manager/services/category-manager-service";
import { Role } from "../../user/models/roles";
import CategoryService from "../../categories/services/category-service";

export class TaskController {
    public static async getAllTasksForUser(req: Request, res: Response): Promise<void> {
        let tasks: ITask[];

        const user: IUser = await UserService.getUserByToken(req.headers.authorization!);

        tasks = await TaskService.getAllTasksForUser(req.query, user.id!);

        res.status(200).send(tasks);
    }

    public static async getTasksForAdmin(req: Request, res: Response): Promise<void> {
        let tasks: ITask[];

        tasks = await TaskService.getTasksForAdmin(req.query);

        res.status(200).send(tasks);
    }

    public static async getTasksForManager(req: Request, res: Response): Promise<void> {
        let tasks: ITask[];

        const token: string = req.headers.authorization!;
        const user: IUser = await UserService.getUserByToken(token);

        let categories: number[];

        switch (user.role) {
            case Role.Manager: {
                categories = await CategoryManagerService.getAllManagerCategoriesIds(user.id!);
                break;
            }
            case Role.Admin: {
                categories = (await CategoryService.getAllCategories()).map((category) => category.id!);
                break;
            }
            default: {
                categories = [];
            }
        }

        tasks = await TaskService.getTasksForManager(req.query, categories);

        res.status(200).send(tasks);
    }

    public static async getUserTasks(req: Request, res: Response): Promise<void> {
        let tasks: ITask[];

        const token: string = req.headers.authorization!;
        const user: IUser = await UserService.getUserByToken(token);

        tasks = await TaskService.getUserTasks(req.query, user.id!);

        res.status(200).send(tasks);
    }

    public static async getUsersTasks(req: Request, res: Response): Promise<void> {
        let tasks: ITask[];

        tasks = await TaskService.getUsersTasks(req.query);

        res.status(200).send(tasks);
    }

    public static async getTask(req: Request, res: Response): Promise<void> {
        const task: ITask = await TaskService.getTask(req.params.id);

        if (task) {
            res.status(200).send(task);
        } else {
            throw new CustomError(400);
        }
    }

    public static async deleteTask(req: Request, res: Response): Promise<void> {
        const result: number = await TaskService.deleteTask(req.params.id);

        if (result) {
            res.json(200);
        } else {
            throw new CustomError(400);
        }
    }

    public static async updateTask(req: Request, res: Response): Promise<void> {
        const taskId = +req.params.id;
        const model: ITask = req.body;
        const task: ITask = await TaskService.updateTask(taskId, model);

        if (task) {
            res.status(200).send(task);
        } else {
            throw new CustomError(400);
        }
    }

    public static async addTask(req: Request, res: Response): Promise<void> {
        const taskModel: ITask = req.body;

        if (taskModel) {
            taskModel.status = Status.OnReview;
        } else {
            throw new CustomError(400);
        }

        const token: string = req.headers.authorization!;
        const user: IUser = await UserService.getUserByToken(token);

        const fiftyNineMinutes: number = 59 * 60000;
        const msTime: number = Date.parse(taskModel.time);
        const msCurrentTime: number = Date.now();

        if (msTime < (msCurrentTime + fiftyNineMinutes)) {
            throw new CustomError(400);
        }

        const time = new Date(taskModel.time);

        taskModel.time = moment(taskModel.time)
            .hours(time.getHours() + time.getTimezoneOffset() / 60).format("YYYY-MM-DD kk:mm:ss");

        taskModel.ownerId = user.id!;

        const task: ITask = await TaskService.addTask(taskModel);

        if (task) {
            res.status(200).send(task);
        } else {
            throw new CustomError(400);
        }
    }

    public static async updateTaskStatus(req: Request, res: Response): Promise<void> {
        const taskId: number = +req.params.id;
        const status: number = req.body.status;

        const currentTask: ITask = await TaskService.getTask(taskId);

        if (status) {
            currentTask.status = status;
        } else {
            throw new CustomError(400);
        }

        const task: ITask = await TaskService.updateTask(taskId, currentTask);

        if (task) {
            res.status(200).send(task);
        } else {
            throw new CustomError(400);
        }
    }
}

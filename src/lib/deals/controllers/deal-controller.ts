import DealService from "../services/deal-service";
import { IDeal } from "../models/deal";
import CustomError from "../../tools/error";
import { ITask } from "../../tasks/models/task";
import TaskService from "../../tasks/services/task-service";
import { Request, Response } from "express";
import { Status } from "../../tasks/models/status";
import UserService from "../../user/services/user-service";
import { IUser } from "../../user/models/user";

export class DealController {
    public static async getAllDeals(req: Request, res: Response): Promise<void> {
        const deals: IDeal[] = await DealService.getAllDeals();

        res.status(200).send(deals);
    }

    public static async getDeal(req: Request, res: Response): Promise<void> {
        let deal: IDeal;

        deal = await DealService.getDeal(req.params.id);

        if (deal) {
            res.status(200).send(deal);
        } else {
            throw new CustomError(400);
        }
    }

    public static async deleteDeal(req: Request, res: Response): Promise<void> {
        let result: number;

        result = await DealService.deleteDeal(req.params.id);

        if (result) {
            res.sendStatus(200);
        } else {
            throw new CustomError(400);
        }
    }

    public static async updateDeal(req: Request, res: Response): Promise<void> {
        const dealId: number = parseInt(req.params.id, 10);
        let deal: IDeal = req.body;

        deal = await DealService.updateDeal(dealId, deal);

        if (deal) {
            res.status(200).send(deal);
        } else {
            throw new CustomError(400);
        }
    }

    public static async addDeal(req: Request, res: Response): Promise<void> {
        let deal: any = req.body;
        const token: string = req.headers.authorization!;
        const user: IUser = await UserService.getUserByToken(token);

        if (user) {
            deal.userId = user.id;
        } else {
            throw new CustomError(400);
        }

        const task: ITask = await TaskService.getTask(deal.taskId);

        if (task.countOfDeals! < task.people) {
            if (task.countOfDeals! === task.people - 1) {
                deal = await DealService.addDeal(deal);

                task.status = Status.Pending;

                await TaskService.updateTask(deal.taskId, task);
            } else {
                deal = await DealService.addDeal(deal);
            }

            if (deal) {
                res.status(200).send(deal);
            } else {
                throw new CustomError(400);
            }
        } else if (task.countOfDeals! === task.people && task.status !== Status.Pending) {
            task.status = Status.Pending;

            await TaskService.updateTask(deal.taskId, task);

            throw new CustomError(400);
        } else {
            throw new CustomError(400);
        }
    }
}

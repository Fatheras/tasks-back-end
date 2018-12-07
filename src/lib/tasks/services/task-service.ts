import { Task, ITask } from "../models/task";
import { Deal, IDeal } from "../../deals/models/deal";
import sequelize, { FindOptions, Op } from "sequelize";
import CustomError from "../../tools/error";
import { Status } from "../models/status";
import DealService from "../../deals/services/deal-service";
import { User, IUser } from "../../user/models/user";
import { Category } from "../../categories/models/category";

export default class TaskService {
    public static async addTask(task: ITask) {
        return await Task.create(task);
    }

    public static async getTask(id: number): Promise<ITask> {
        const task: ITask | null = await Task.findById(id, {
            raw: true,
            attributes: {
                include: [[sequelize.fn("COUNT", sequelize.col("deals.id")), "countOfDeals"]],
            },
            include: [{
                model: Deal, attributes: [],
            }],
            group: ["Task.id"],
            subQuery: false,
        });

        if (task) {
            return task;
        } else {
            throw new CustomError(400);
        }
    }

    public static async getAllTasks(): Promise<ITask[]> {
        const tasks: ITask[] = await Task.findAll();

        if (tasks) {
            return tasks;
        } else {
            throw new CustomError(400);
        }
    }

    public static async getAllTasksForUser(query: any, userId: number): Promise<ITask[]> {
        const deals: IDeal[] = await DealService.getUserDeals(userId);
        const taskIds: number[] = deals.map((el, i, arr) => el.taskId);

        const options: FindOptions<ITask> = {
            offset: +query.offset,
            limit: +query.limit,
            order: [["time", "ASC"]],
            where: {
                status: Status.Open,
                ownerId: {
                    [Op.not]: userId,
                },
                id: {
                    [Op.not]: taskIds,
                },
            },
            attributes: {
                include: [[sequelize.fn("COUNT", sequelize.col("deals.id")), "countOfDeals"]],
            },
            include: [{
                model: Deal, attributes: [],
            }],
            group: ["Task.id"],
            subQuery: false,
        };

        if (query.categoryId) {
            Object.assign(options.where, {
                categoryId: query.categoryId,
            });
        }

        return Task.findAll(options);
    }

    public static async getUserTasks(query: any, userId: number): Promise<ITask[]> {
        const options: FindOptions<ITask> = {
            attributes: {
                include: [[sequelize.fn("COUNT", sequelize.col("deals.id")), "countOfDeals"]],
            },
            offset: +query.offset,
            limit: +query.limit,
            order: [["time", "ASC"]],
            where: {
                status: Status.Open,
                ownerId: userId,
            },
            include: [
                {
                    model: Deal, attributes: [],
                },
                {
                    model: Category,
                },
            ],
            group: ["Task.id"],
            subQuery: false,
        };

        if (query.pattern) {
            Object.assign(options.where,
                {
                    title: {
                        [Op.like]: query.pattern + "%",
                    },
                });
        }

        if (query.categories) {
            Object.assign(options.where, {
                categoryId:
                {
                    [Op.in]: query.categories,
                },
            });
        }

        if (query.status) {
            Object.assign(options.where, { status: query.status });
        }

        if (query.startDate && query.endDate) {
            Object.assign(options.where, {
                time: {
                    [Op.between]: [new Date(query.startDate), new Date(query.endDate)],
                },
            });
        } else if (query.startDate) {
            Object.assign(options.where, {
                time: {
                    [Op.gt]: query.startDate,
                },
            });
        } else if (query.endDate) {
            Object.assign(options.where, {
                time: {
                    [Op.lt]: query.endDate,
                },
            });
        }

        return Task.findAll(options);
    }

    public static async getTasksForAdmin(query: any): Promise<ITask[]> {
        const options: FindOptions<ITask> = {
            attributes: {
                include: [[sequelize.fn("COUNT", sequelize.col("deals.id")), "countOfDeals"]],
            },
            offset: +query.offset,
            limit: +query.limit,
            order: [["time", "ASC"]],
            where: {

            },
            include: [
                {
                    model: Deal, attributes: [],
                },
                {
                    model: User,
                },
                {
                    model: Category,
                },
            ],
            group: ["Task.id"],
            subQuery: false,
        };

        if (query.categories) {
            Object.assign(options.where, {
                categoryId:
                {
                    [Op.in]: query.categories,
                },
            });
        }

        if (query.status) {
            Object.assign(options.where, { status: query.status });
        }

        if (query.startDate && query.endDate) {
            Object.assign(options.where, {
                time: {
                    [Op.between]: [new Date(query.startDate), new Date(query.endDate)],
                },
            });
        } else if (query.startDate) {
            Object.assign(options.where, {
                time: {
                    [Op.gt]: query.startDate,
                },
            });
        } else if (query.endDate) {
            Object.assign(options.where, {
                time: {
                    [Op.lt]: query.endDate,
                },
            });
        }

        if (query.pattern) {
            Object.assign(options.where,
                {
                    title: {
                        [Op.like]: query.pattern + "%",
                    },
                });
        }

        if (query.usersIds) {
            Object.assign(options.where, {
                ownerId:
                    { [Op.in]: query.usersIds },
            });
        }

        return Task.findAll(options);
    }

    public static async getAllTasksByCategory(categoryId: number): Promise<ITask[]> {
        const tasks: ITask[] = await Task.findAll(
            {
                where: {
                    categoryId,
                },
            },
        );

        if (tasks) {
            return tasks;
        } else {
            throw new CustomError(400);
        }
    }

    public static async getTasksForManager(query: any, categories: number[]): Promise<ITask[]> {
        const options: FindOptions<ITask> = {
            offset: +query.offset,
            limit: +query.limit,
            order: [["time", "ASC"]],
            where: {
                categoryId: {
                    [Op.in]: categories,
                },
                status: Status.OnReview,
            },
            include: [
                {
                    model: User, attributes: ["firstName", "lastName"],
                },
                {
                    model: Category,
                },
            ],
            subQuery: false,
        };

        if (query.categories) {
            options.where = {
                categoryId:
                {
                    [Op.in]: query.categories,
                },
                status: Status.OnReview,
            };
        }

        if (query.pattern) {
            Object.assign(options.where,
                {
                    title: {
                        [Op.like]: query.pattern + "%",
                    },
                });
        }

        return Task.findAll(options);
    }

    public static async getUsersTasks(query: any): Promise<ITask[]> {
        const options: FindOptions<ITask> = {
            offset: query.offset,
            limit: query.limit,
            order: [["time", "ASC"]],
            where: {},
            include: [{
                model: User, attributes: ["firstName", "lastName"],
            }],
            group: ["Task.id"],
            subQuery: true,
        };

        if (query.pattern) {
            Object.assign(options.where,
                {
                    title: {
                        [Op.like]: query.pattern + "%",
                    },
                });
        }

        if (query.categories) {
            Object.assign(options.where, {
                category:
                {
                    [Op.in]: query.categories,
                },
            });
        }

        if (query.status) {
            Object.assign(options.where, { status: query.status });
        }

        if (query.owners) {
            Object.assign(options.where, {
                ownerId: {
                    [Op.in]: query.owners,
                },
            });
        }

        if (query.startDate && query.endDate) {
            Object.assign(options.where, {
                time: {
                    [Op.between]: [new Date(query.startDate), new Date(query.endDate)],
                },
            });
        } else if (query.startDate) {
            Object.assign(options.where, {
                time: {
                    [Op.gt]: query.startDate,
                },
            });
        } else if (query.endDate) {
            Object.assign(options.where, {
                time: {
                    [Op.lt]: query.endDate,
                },
            });
        }

        return Task.findAll(options);
    }

    public static async deleteTask(id: number): Promise<number> {
        return await Task.destroy({
            where: {
                id,
            },
        });
    }

    public static async updateTask(id: number, model: ITask): Promise<ITask> {
        if (model) {
            delete model.id;

            await Task.update(model, {
                where: {
                    id,
                },
            });

            return this.getTask(id);
        } else {
            throw new CustomError(400);
        }
    }
}

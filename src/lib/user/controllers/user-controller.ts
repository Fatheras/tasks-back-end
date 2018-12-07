import UserService from "../services/user-service";
import { IUser } from "../models/user";
import CustomError from "../../tools/error";
import { Request, Response } from "express";
import AuthService from "../../authentication/services/auth-service";
import fs from "fs";
import path from "path";

export class UserController {
    public static async changePassword(req: Request, res: Response): Promise<void> {
        const id: number = +req.params.id;
        let user: IUser = await UserService.getUser(id);

        const isValid: boolean = await AuthService.isValidPassword(user.password, req.body.password);

        if (isValid) {
            const password: string = await AuthService.hashPassword(req.body.newPassword);
            user = await UserService.updateUser(id, { password } as IUser);

            if (user) {
                res.status(200).send(user);
            } else {
                throw new CustomError(400);
            }
        } else {
            throw new CustomError(400);
        }
    }

    public static async getAllUsers(req: Request, res: Response): Promise<void> {
        const users: IUser[] = await UserService.getAllUsers();

        res.status(200).send(users);
    }

    public static async getAllManagers(req: Request, res: Response): Promise<void> {
        const users: IUser[] = await UserService.getAllManagers();

        res.status(200).send(users);
    }

    public static async getUser(req: Request, res: Response, next: any): Promise<void> {
        const id: number = +req.params.id;
        const user: IUser | null = await UserService.getUser(id);

        if (user) {
            res.status(200).send(user);
        } else {
            throw new CustomError(404);
        }
    }

    public static async getUserWithStatistic(req: Request, res: Response): Promise<void> {
        const id: number = +req.params.id;
        const user: IUser = await UserService.getUserWithStatistic(id);

        if (user) {
            res.status(200).send(user);
        } else {
            throw new CustomError(404);
        }
    }

    public static async addUser(req: Request, res: Response): Promise<void> {
        const model: IUser = req.body;
        const user: IUser = await UserService.addUser(model);

        if (user) {
            res.status(200).send(user);
        } else {
            throw new CustomError(400);
        }
    }

    public static async deleteUser(req: Request, res: Response): Promise<void> {
        const id: number = +req.params.id;
        const result: number = await UserService.deleteUser(id);

        if (result) {
            res.sendStatus(200);
        } else {
            throw new CustomError(400);
        }
    }

    public static async updateUser(req: Request, res: Response): Promise<void> {
        const model: IUser = req.body;
        const user: IUser = await UserService.getUser(model.id!);

        if (req.body.password && req.body.newPassword) {
            const isValid: boolean = await AuthService.isValidPassword(user.password, req.body.password);

            if (isValid) {
                model.password = await AuthService.hashPassword(req.body.newPassword);
            } else {
                throw new CustomError(400);
            }
        }

        const updatedUser: IUser = await UserService.updateUser(model.id!, model);

        const oldAvatar = user.avatar;

        if (model.avatar && oldAvatar) {
            const oldFilePATH = path.resolve(path.dirname("lib"), "public", "uploads", oldAvatar);

            fs.unlink(oldFilePATH, (err) => {
                if (err) {
                    throw err;
                }
            });
        }

        if (updatedUser) {
            res.status(200).send(updatedUser);
        } else {
            throw new CustomError(400);
        }
    }

    public static async updateUserRole(req: Request, res: Response): Promise<void> {
        const id: number = +req.params.id;
        const role: number = +req.body.role;

        const updatedUser: IUser = await UserService.updateUserRole(id, role);

        if (updatedUser) {
            res.json(200);
        } else {
            throw new CustomError(400);
        }
    }

    public static async getAllUsersWithStatistic(req: Request, res: Response): Promise<void> {
        const users: IUser[] = await UserService.getAllUsers();
        const usersWithStatictics: IUser[] = [];

        for (const user of users) {
            usersWithStatictics.push(await UserService.getUserWithStatistic(user.id!));
        }

        if (usersWithStatictics) {
            res.status(200).send(usersWithStatictics);
        } else {
            throw new CustomError(404);
        }
    }

    public static async getUserByToken(req: Request, res: Response): Promise<void> {
        const user: IUser = await UserService.getUserByToken(req.headers.authorization!);

        if (user) {
            res.status(200).send(user);
        } else {
            throw new CustomError(404);
        }
    }
}

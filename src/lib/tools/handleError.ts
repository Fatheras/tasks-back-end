import { Request, Response, NextFunction } from "express";
import * as path from "path";
import * as fs from "fs";

export const handleError = (func: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await func(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const avatarHandleError = (func: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await func(req, res, next);
    } catch (error) {
        if (req.file) {
            const filePATH = path.resolve(path.dirname("lib"), "public", "uploads", req.file.filename);

            fs.unlink(filePATH, (error: Error) => {
                if (error) {
                    throw Error();
                }
            });
        }

        next(error);
    }
};

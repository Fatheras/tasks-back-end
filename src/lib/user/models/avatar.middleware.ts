import { Request, Response, NextFunction } from "express";
import avatar from "./avatar-uploader";

export const uploadAvatarMiddleware = (req: Request, res: Response, next: NextFunction) => {
    avatar(req, res, async (err) => {
        if (err) {
            res.sendStatus(500);
        } else {
            if (req.file) {
                req.body.avatar = req.file.filename;
            }

            next();
        }
    });
};

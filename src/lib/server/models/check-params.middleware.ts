import * as joi from "joi";
import { Requests } from "../enums/request-verb-enum";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../tools/error";

export default class CheckParamsMiddleware {
    public static getCollection(req: Request): any {
        switch (req.method) {
            case Requests.GET:
                return req.query;
            case Requests.DELETE:
            case Requests.POST:
            case Requests.PUT:
                return req.body;
            default:
                throw new CustomError(500);
        }
    }

    public static validateParamsJoi(schema: joi.Schema) {
        return (req: Request, res: Response, next: NextFunction) => {
            const collection: any = CheckParamsMiddleware.getCollection(req);
            const result: joi.ValidationResult<any> = joi.validate(collection, schema);

            if (!result.error) {
                next();
            } else {
                throw new CustomError(400);
            }
        };
    }

    public static validateSequelizeEntity(entity: any) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const collection = CheckParamsMiddleware.getCollection(req);
            const model: any = entity.build(collection);

            try {
                await model.validate();
                next();
            } catch (error) {
                throw new CustomError(400);
            }
        };
    }
}

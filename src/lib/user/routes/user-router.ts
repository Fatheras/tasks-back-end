import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { AuthController } from "../../authentication/controllers/auth-controller";
import { handleError, avatarHandleError } from "../../tools/handleError";
import CheckParamsMiddleware from "../../server/models/check-params.middleware";
import * as joi from "joi";
import { uploadAvatarMiddleware } from "../models/avatar.middleware";

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get("/", handleError(UserController.getAllUsers));
        this.router.get("/managers", handleError(UserController.getAllManagers));
        this.router.get("/me", handleError(UserController.getUserByToken));
        this.router.get("/:id/statistic", handleError(UserController.getUserWithStatistic));
        this.router.get("/statistic", handleError(UserController.getAllUsersWithStatistic));
        this.router.get("/:id", UserController.getUser);
        this.router.put("/:id/changeRole", CheckParamsMiddleware.validateParamsJoi(joi.object().keys({
            role: joi.number().integer().positive().required(),
        })), handleError(UserController.updateUserRole));
        this.router.delete("/:id", handleError(UserController.deleteUser));
        this.router.put("/:id", uploadAvatarMiddleware, avatarHandleError(CheckParamsMiddleware.validateParamsJoi
            (joi.object().keys({
                id: joi.number().integer().positive().required(),
                firstName: joi.string().max(255).required(),
                lastName: joi.string().max(255).required(),
                email: joi.string().email({ minDomainAtoms: 2 }).max(255).required(),
                password: joi.string().min(3).max(255).allow(""),
                newPassword: joi.string().min(3).max(255).allow(""),
                avatar: joi.string().allow(""),
            }))), handleError(UserController.updateUser));
        this.router.post("/signup", CheckParamsMiddleware.validateParamsJoi(joi.object().keys({
            email: joi.string().email({ minDomainAtoms: 2 }).required(),
            phone: joi.string().trim().required(),
            password: joi.string().min(3).max(30).required(),
        })), AuthController.signUp);
        this.router.post("/login", CheckParamsMiddleware.validateParamsJoi(joi.object().keys({
            email: joi.string().email({ minDomainAtoms: 2 }).required(),
            password: joi.string().min(3).max(30).required(),
        })), AuthController.signIn);
    }
}

const userRoutes: UserRouter = new UserRouter();

export default userRoutes.router;

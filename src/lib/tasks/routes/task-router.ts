import { Router } from "express";
import { TaskController } from "../controllers/task-controller";
import { handleError } from "../../tools/handleError";
import CheckParamsMiddleware from "../../server/models/check-params.middleware";
import * as joi from "joi";
import { Role } from "../../user/models/roles";
import CheckRoleMiddleware from "../../server/models/check-role.middleware";

class TaskRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get("/tasksForAdmin", CheckRoleMiddleware.checkRole(Role.Admin),
            CheckParamsMiddleware.validateParamsJoi(joi.object().keys({
                offset: joi.number().integer().min(0),
                limit: joi.number().integer().min(1),
                categories: joi.array(),
                usersIds: joi.array(),
                pattern: joi.string().min(1),
                status: joi.number().integer().positive().min(1).max(5),
                startDate: joi.string(),
                endDate: joi.string(),
            })), TaskController.getTasksForAdmin);
        this.router.put("/:id/updateStatus",
            CheckRoleMiddleware.checkRole(Role.Manager, Role.Admin),
            handleError(TaskController.updateTaskStatus),
        );
        this.router.get("/getTasksForManager", CheckRoleMiddleware.checkRole(Role.Manager, Role.Admin),
            handleError(TaskController.getTasksForManager));
        this.router.get("/getUserTasks", handleError(TaskController.getUserTasks));
        this.router.get(
            "/getUsersTasks",
            CheckRoleMiddleware.checkRole(Role.Admin),
            handleError(TaskController.getUsersTasks),
        );
        this.router.get("/", handleError(TaskController.getAllTasksForUser));
        this.router.get("/:id", handleError(TaskController.getTask));
        this.router.post("/", CheckParamsMiddleware.validateParamsJoi(joi.object().keys({
            title: joi.string().max(255).required(),
            people: joi.number().integer().positive().min(1).max(5).required(),
            categoryId: joi.number().integer().positive().required(),
            cost: joi.number().positive().min(1).required(),
            description: joi.string().max(255).required(),
            time: joi.date().required(),
        })), handleError(TaskController.addTask));
        this.router.put("/:id", handleError(TaskController.updateTask));
        this.router.delete("/:id", handleError(TaskController.deleteTask));
    }
}

const taskRoutes = new TaskRouter();

export default taskRoutes.router;

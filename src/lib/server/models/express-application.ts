import bodyParser = require("body-parser");
import passport = require("passport");
import { morganSetUp } from "../../tools/morgan";
import { log } from "../../tools/logger-service";
import express, { Request, Response, NextFunction } from "express";
import taskRouter from "../../tasks/routes/task-router";
import managerRouter from "../../category-manager/routes/category-manager-router";
import userRouter from "../../user/routes/user-router";
import dealRouter from "../../deals/routes/deal-router";
import categoryRouter from "../../categories/routes/category-router";
import CustomError from "../../tools/error";
import * as core from "express-serve-static-core";
import cors from "cors";

export class Server {
    public app: core.Express;
    private router: express.Router;

    constructor() {
        this.app = express();
        this.router = express.Router();

        try {
            this.app.use(morganSetUp());
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: true }));
            this.app.use(passport.initialize());

            this.app.use(cors());
            this.app.use(express.static("public"));

            this.setRoutes();

            this.app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
                switch (error.Code) {
                    case 400: {
                        res.sendStatus(400);
                        break;
                    }
                    case 404: {
                        res.sendStatus(404);
                        break;
                    }
                    case 500: {
                        res.sendStatus(500);
                        break;
                    }
                }
            });
        } catch (error) {
            log.error(error);
        }

    }

    private setRoutes() {
        this.app.use("/api/v1", this.router);
        this.router.use("/tasks", taskRouter);
        this.router.use("/categories", categoryRouter);
        this.router.use("/manager", managerRouter);
        this.router.use("/users", userRouter);
        this.router.use("/deals", dealRouter);
        this.router.get("*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            throw new CustomError(404);
        });
    }
}

export default new Server().app;

import { Router } from "express";
import { CategoryController } from "../controllers/category-controller";
import { handleError } from "../../tools/handleError";

class CategoryRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get("/", handleError(CategoryController.getAllCategories));
        this.router.get("/getCategoriesWithStatistic",
            handleError(CategoryController.getCategoriesWithStatistic));
        this.router.delete("/:id", handleError(CategoryController.deleteCategory));
        this.router.post("/", handleError(CategoryController.addCategory));
        this.router.get("/:id", handleError(CategoryController.getCategory));
    }
}

const categoryRoutes = new CategoryRouter();

export default categoryRoutes.router;

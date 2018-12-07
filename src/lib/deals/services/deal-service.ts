import { Deal, IDeal } from "../models/deal";
import CustomError from "../../tools/error";

export default class DealService {
    public static async addDeal(deal: IDeal): Promise<IDeal> {
        return Deal.create(deal);
    }

    public static async getDeal(id: number): Promise<IDeal> {
        const deal: IDeal | null = await Deal.findById(id);

        if (deal) {
            return deal;
        } else {
            throw new CustomError(400);
        }
    }

    public static async getUserDeals(userId: number) {
        return Deal.findAll({
            where: {
                userId,
            },
        });
    }

    public static async getAllDeals(): Promise<IDeal[]> {
        return Deal.findAll();
    }

    public static async deleteDeal(id: number) {
        return Deal.destroy({
            where: {
                id,
            },
        });
    }

    public static async updateDeal(id: number, model: IDeal): Promise<IDeal> {
        if (model) {
            delete model.id;

            await Deal.update(model, {
                where: {
                    id,
                },
            });

            return this.getDeal(id);
        } else {
            throw new CustomError(400);
        }
    }

    public static async getDealsByTaskId(taskId: number) {
        return Deal.findAll({
            where: {
                taskId,
            },
        });
    }
}

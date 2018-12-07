import { IUserStatistic } from "../../user/models/user";
import { Task } from "../../tasks/models/task";
import sequelize = require("sequelize");

interface IStatistic {
    status: number;
    count: number;
}

export default class StatisticService {
    public static async getStatistic(id: number): Promise<IUserStatistic> {
        const cleanStat: IStatistic[] = [];

        const stat: any = await Task.findAll({
            attributes: ["status", [sequelize.fn("COUNT", "*"), "count"]],
            where: {
                ownerId: id,
            },
            group: ["status"],
        });

        for (const item of stat) {
            cleanStat.push((item as sequelize.Instance<IStatistic>).get({ plain: true }) as IStatistic);
        }

        const statistic: IUserStatistic = {
            onReview: 0,
            open: 0,
            pending: 0,
            done: 0,
            declined: 0,
            count: 0,
        };

        for (const value of cleanStat) {
            statistic.count += value.count;

            switch (value.status) {
                case 1:
                    statistic.onReview = value.count;
                    break;
                case 2:
                    statistic.open = value.count;
                    break;
                case 3:
                    statistic.pending = value.count;
                    break;
                case 4:
                    statistic.done = value.count;
                case 5:
                    statistic.declined = value.count;

                default:
                    break;
            }
        }

        return statistic;
    }
}

import Sequelize from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(process.env.DB!, process.env.USER!, process.env.PASSWORD!, {
    host: process.env.HOST!,
    dialect: process.env.DIALECT!,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    timezone: "+00:00",
});

export default db;

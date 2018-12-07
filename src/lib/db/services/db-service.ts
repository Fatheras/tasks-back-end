import db from "../models/db";
import { log } from "../../tools/logger-service";

export default class DBService {
    public static async initDataBase() {
        try {
            await db.authenticate();
            await db.sync();

            log.info("Connected to database");
        } catch (err) {
            log.error(err.message);
        }
    }
}

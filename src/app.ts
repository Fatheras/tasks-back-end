import http, { Server } from "http";
import { log } from "./lib/tools/logger-service";
import AuthService from "./lib/authentication/services/auth-service";
import DBService from "./lib/db/services/db-service";
import app from "./lib/server/models/express-application";
import { SocketIo } from "./lib/sockets/socket.io";
import client from "./lib/redis/redis";

const initApplication = async () => {
    try {
        const server: Server = http.createServer(app);

        const io: SocketIo = new SocketIo(server);

        await DBService.initDataBase();

        AuthService.setUpPassport();

        server.listen(process.env.PORT, () => log.info("Server listening"));
    } catch (error) {
        log.error(error);
        log.error((error as Error).message);
    }
};

initApplication();

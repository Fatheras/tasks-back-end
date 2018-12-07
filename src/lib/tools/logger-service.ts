import * as winston from "winston";
import * as path from "path";
import { FileTransportInstance } from "winston/lib/winston/transports";
import { Format } from "logform";

const fileSize: number = 1024000;

const format: Format = winston.format.printf((info) => {
    return `${info.timestamp} ${info.level} ${info.message}`;
});

class LoggerService {
    public log: winston.Logger;

    constructor() {
        this.log = this.getLogger();
    }

    public getLogger(): winston.Logger {
        const logger: FileTransportInstance = new (winston.transports.File)({
            filename: path.join("logs", "common", "server.log"),
            handleExceptions: true,
            maxsize: fileSize,
            format: winston.format.combine(
                winston.format.timestamp(),
                format,
            ),
        });

        const res: winston.Logger = winston.createLogger({
            transports: [
                new (winston.transports.Console)({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp(),
                        format,
                    ),
                }),
                logger,
            ],
            exceptionHandlers: [
                logger,
            ],
        });

        return res;
    }
}

const loggerService: LoggerService = new LoggerService();

export const log = loggerService.log;

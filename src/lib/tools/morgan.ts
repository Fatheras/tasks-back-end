import * as path from "path";
import * as appRoot from "app-root-path";
import * as fs from "fs";
import morgan from "morgan";
import express from "express";

const requestLogStream: fs.WriteStream = fs.createWriteStream(path.join(appRoot.path,
    "logs", "common", "requests.log"), { flags: "a" });

export const morganSetUp = (): express.RequestHandler => {
    return morgan(":date :status :method :url :response-time", { stream: requestLogStream });
};

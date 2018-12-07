import socketIo from "socket.io";
import { Server } from "http";
import TaskService from "../tasks/services/task-service";
import { IUser } from "../user/models/user";
import UserService from "../user/services/user-service";
import { ITask } from "../tasks/models/task";
import client from "../redis/redis";

export class SocketIo {
    public io: socketIo.Server;

    constructor(server: Server) {
        this.io = socketIo(server);
        this.initEvents();
    }

    public initEvents() {
        this.io.on("connection", async (socket: socketIo.Socket) => {
            const userId: string = (await UserService.getUserByToken(socket.handshake.query.token)).id!.toString();

            client.set(userId, socket.id);

            socket.on("subscription", async (taskId: number) => {
                socket.broadcast.emit("subscription", await TaskService.getTask(taskId));
            });

            socket.on("notify", async (data) => {
                const info = JSON.parse(data);

                const subscriber: IUser = await UserService.getUserByToken(info.token);

                const task: ITask = await TaskService.getTask(info.taskId);

                client.get(task.ownerId.toString(), (err, socketId) => {
                    if (err) {
                        throw new Error();
                    }

                    socket.broadcast.to(socketId).emit("notify", JSON.stringify({ task, user: subscriber }));
                });
            });

            socket.on("disconnect", () => {
                client.del(userId);
            });
        });
    }
}

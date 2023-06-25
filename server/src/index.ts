import "dotenv/config";
import { Server } from "socket.io";
import { serverFastify, initiFastify } from "./libs/fastify";
import { SockerServer } from "./libs/socket/socket-io";
export const io: Server = require("socket.io")(serverFastify.server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
async function start() {
    initiFastify();
    SockerServer(io);
}

start();

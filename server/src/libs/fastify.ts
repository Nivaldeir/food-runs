import fastify from "fastify";
import cors from "@fastify/cors";
import { Route } from "../routes/index.routes";

export const serverFastify = fastify({ logger: true });
serverFastify.register(cors, {
    origin: "*",
});

serverFastify.register(Route, {
    prefix: "/v1",
});

export async function initiFastify() {
    try {
        serverFastify.listen(
            { port: Number(process.env.PORT), host: "0.0.0.0" },
            (e) => {
                console.log(e);
                console.log(
                    `✔  HTTP server running on http://localhost:${process.env.PORT}`
                );
            }
        );
    } catch (error) {
        serverFastify.log.error(error);
        process.exit(1);
    }
}

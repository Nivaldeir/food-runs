import { FastifyInstance } from "fastify";
import Motoboy from "../controllers/Motoboy";
import middleware from "../middleware";
export async function motoboyRoute(app: FastifyInstance) {
    app.post(
        "/motoboy",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Motoboy.create
    );
    app.get("/motoboy/:id", Motoboy.findOne);
    app.get(
        "/motoboy/",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Motoboy.findMany
    );
    app.delete(
        "/motoboy/:id",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Motoboy.findAndDelete
    );
    app.put(
        "/motoboy/:id",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Motoboy.findAndUpdate
    );
    app.put("/motoboy/location/:id", Motoboy.findUpdateLocation);
}

import { FastifyInstance } from "fastify";
import Other from "../controllers/Other";
import middleware from "../middleware";

export async function otherRoute(app: FastifyInstance) {
    app.post(
        "/other",
        { preHandler: [middleware.authenticationToken] },
        Other.create
    );
    app.get(
        "/other/:id",
        { preHandler: [middleware.authenticationToken] },
        Other.findOne
    );
    app.get(
        "/other/",
        { preHandler: [middleware.authenticationToken] },
        Other.findMany
    );
    app.put(
        "/other/:id",
        { preHandler: [middleware.authenticationToken] },
        Other.findAndUpdate
    );
    app.delete(
        "/other/:id",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Other.findAndDelete
    );

    app.post(
        "/other/direction/",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Other.findRoutes
    );
}

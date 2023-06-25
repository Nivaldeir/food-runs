import { FastifyInstance } from "fastify";
import Scheme from "../controllers/Scheme";
import middleware from "../middleware";

export async function schemeRoute(app: FastifyInstance) {
    app.post(
        "/scheme",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Scheme.create
    );
    app.get(
        "/scheme/:id",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Scheme.findOne
    );
    app.get(
        "/scheme/",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Scheme.findMany
    );
    app.put(
        "/scheme/:id",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Scheme.findAndUpdate
    );
    app.delete(
        "/scheme/:id",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Scheme.findAndDelete
    );
}

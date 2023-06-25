import { FastifyInstance } from "fastify";
import Company from "../controllers/Company";
import middleware from "../middleware";

export async function companyRoute(app: FastifyInstance) {
    app.post(
        "/company",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Company.create
    );
    app.get(
        "/company/:id",
        { preHandler: [middleware.authenticationToken] },
        Company.findOne
    );
    app.get(
        "/company/",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Company.findMany
    );
    app.delete(
        "/company/:id",
        { preHandler: [middleware.authenticationTokenIsAdmin] },
        Company.findAndDelete
    );
}

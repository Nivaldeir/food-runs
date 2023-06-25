import { FastifyInstance } from "fastify";
import Auth from "../controllers/Auth";
export async function authRoute(app: FastifyInstance) {
    app.post("/login", Auth.authentication);
}

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authRoute } from "./auth.routes";
import { companyRoute } from "./company.routes";
import { motoboyRoute } from "./motoboy.routes";
import { otherRoute } from "./other.routes";
import { schemeRoute } from "./scheme.routes";
import { IRideRequest } from "../model/Other";
import { Other } from "../model/Other";
export async function Route(app: FastifyInstance) {
    app.register(companyRoute);
    app.register(authRoute);
    app.register(motoboyRoute);
    app.register(otherRoute);
    app.register(schemeRoute);
    app.post(
        "/side-request",
        async (req: FastifyRequest, res: FastifyReply) => {
            const { userRequest, other } = req.body as IRideRequest;
            await new Other().sideRequest({
                userRequest,
                other,
            });
            res.send({
                error: false,
                message: "success",
            });
        }
    );
    app.post(
        "/cancell-request",
        async (req: FastifyRequest, res: FastifyReply) => {
            const { motoboyId, otherId } = req.body as {
                motoboyId: string;
                otherId: string;
            };
            const response = await new Other().findWithUpdateMotoboyAndOther(
                motoboyId,
                otherId,
                "cancell"
            );
            res.send(response);
        }
    );
}

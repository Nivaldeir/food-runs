import { FastifyReply, FastifyRequest } from "fastify";
import Auth from "../controllers/Auth";

export default {
  authenticationToken: async (
    req: FastifyRequest,
    res: FastifyReply,
    next: () => void
  ) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    var response = await Auth.getTokenInformation(String(token));
    if (response.error) {
      res.status(404).send({
        error: true,
        message: "Not authorized",
      });
    }
    next();
  },
  authenticationTokenIsAdmin: async (
    req: FastifyRequest,
    res: FastifyReply,
    next: () => void
  ) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    var response = await Auth.getTokenInformation(String(token));
    if (!response.isAdmin) {
      res.status(404).send({
        error: true,
        message: "Not authorized",
      });
    }
    next();
  },
};

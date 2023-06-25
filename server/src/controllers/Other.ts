import { Other as IOther } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { Other } from "../model/Other";
import { emitEventSocket } from "../libs/socket/socket-io";
import { MOTOBOY } from "../libs/socket/events";
import { io } from "..";
import { getRoute } from "../services/googleMaps";

interface LngLat {
    origin: number[];
    destination: number[];
}
export default {
    create: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const data = req.body as IOther;
            const response = await new Other().create(data);
            return res.status(201).send({
                error: false,
                data: response,
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error,
            });
        }
    },
    findOne: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const { id } = req.params as IOther;
            const response = await new Other().findOne({
                id: id,
            });
            return res.status(201).send({
                error: false,
                data: response,
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error,
            });
        }
    },
    findMany: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const {
                id,
                order,
                page = 0,
                take = 10,
            } = req.query as {
                id: string[];
                order: string[];
                page: number;
                take: number;
            };
            var ids: string[] = [];
            if (id) {
                ids = [String(order)].filter(
                    (item: string, i: number) => id.indexOf(item) === i
                );
            }
            const orderBy: { [key: string]: string | "asc" | "desc" } = {};
            [String(order)]?.map((e) => {
                orderBy[e.split("=")[0]] = e.split("=")[1];
            });
            console.log(page);
            const response = await new Other().findMany(
                {
                    ...(ids.length > 1 && {
                        id: {
                            in: ids,
                        },
                    }),
                },
                orderBy,
                page,
                Number(take)
            );
            return res.status(201).send({
                error: false,
                data: response,
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error,
            });
        }
    },
    findAndDelete: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const { id } = req.params as IOther;
            const response = await new Other().findAndDelete({
                id,
            });
            return res.status(201).send({
                error: false,
                data: response,
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error,
            });
        }
    },
    findAndUpdate: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const { id } = req.params as IOther;
            const response = await new Other().findAndUpdate(
                id,
                req.body as IOther
            );
            // emitEventSocket(io, MOTOBOY, response);
            // console.log(response);
            return res.status(201).send({
                error: false,
                data: response,
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error,
            });
        }
    },
    findRoutes: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const { origin, destination } = req.body as LngLat;
            const result = await getRoute(origin, destination);
            res.send(result);
        } catch (error) {
            res.send({ error: true, message: error });
        }
    },
};

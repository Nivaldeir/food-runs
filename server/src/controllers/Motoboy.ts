import { Motoboy as IMotoboy } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { Motoboy } from "../model/Motoboy";
import { io } from "..";
import { userSocketMap } from "../libs/socket/clients";

export default {
    create: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const data = req.body as IMotoboy;
            console.log(data);
            const response = await new Motoboy().create(data);
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
            const { id } = req.params as IMotoboy;
            const response = await new Motoboy().findOne({
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
            const response = await new Motoboy().findMany(
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
            const { id } = req.params as IMotoboy;
            const response = await new Motoboy().findAndDelete({
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
            const { id } = req.params as IMotoboy;
            const data = req.body as IMotoboy;
            const response = await new Motoboy().findAndUpdate(id, data);
            if (response.inRunning) {
            }
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
    findUpdateLocation: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const { id } = req.params as IMotoboy;
            const data = req.body as {
                coordinates: {
                    latitude: number;
                    longitude: number;
                };
                companyId?: string;
            };
            const response = await new Motoboy().findAndUpdate(id, {
                latitude: data.coordinates.latitude,
                longitude: data.coordinates.latitude,
            } as IMotoboy);
            console.log("MOTOBOY UPDATE", data);
            if (data.companyId) {
                console.log(userSocketMap[data?.companyId]);
                io.to(userSocketMap[data?.companyId]).emit(
                    "ride-update",
                    data.coordinates
                );
            }
            return res.status(201).send({
                error: false,
                data: "Success",
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error,
            });
        }
    },
};

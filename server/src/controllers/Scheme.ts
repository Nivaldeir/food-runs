import { Schema as IScheme } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { Scheme } from "../model/Scheme";
export default {
  create: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data = req.body as IScheme;
      const response = await new Scheme().create(data);
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
      const { id } = req.params as IScheme;
      const response = await new Scheme().findOne({
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
      const response = await new Scheme().findMany(
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
  findAndUpdate: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { id } = req.params as IScheme;
      const response = await new Scheme().findAndDelete({
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
  findAndDelete: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { id } = req.params as IScheme;
      const response = await new Scheme().findAndDelete({
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
};

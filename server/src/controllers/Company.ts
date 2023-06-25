import { Company as ICompany } from "@prisma/client";
import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { Company } from "../model/Company";

export default {
  create: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data = req.body as ICompany;
      const response = await new Company().create(data);
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
      const { id } = req.params as ICompany;
      const response = await new Company().findOne({
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
    // try {
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
    const response = await new Company().findMany(
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
    // } catch (error) {
    //   return res.status(500).send({
    //     error: true,
    //     message: error,
    //   });
    // }
  },
  findAndDelete: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { id } = req.params as ICompany;
      const response = await new Company().findAndDelete({
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

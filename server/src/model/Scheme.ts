import { Schema as ISchema } from "@prisma/client";
import { prisma } from "../libs/prisma";

export class Scheme {
  constructor() {}
  async create(data: ISchema) {
    try {
      const response = await prisma.schema.create({
        data: data,
      });
      return response;
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
  async findOne(where: {}): Promise<ISchema | object> {
    try {
      const response = await prisma.schema.findFirstOrThrow({
        where: where,
        include: {
          Company: true,
        },
      });
      if (typeof response != "object")
        return {
          error: true,
          message: "Não encontrado",
        };
      return response;
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
  async findMany(
    where: {} = {},
    orderBy: {} = {},
    page: number,
    take: number
  ): Promise<ISchema[] | object> {
    try {
      const response = await prisma.schema.findMany({
        where: where,
        orderBy: orderBy,
        include: {
          Company: true,
        },
        take: take, // Número de registros por página
        skip: page * take, // Número de registros a serem pulados
      });
      return response;
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
  async findAndUpdate(id: string, data: ISchema): Promise<Boolean> {
    await prisma.schema.update({
      where: {
        id: id,
      },
      data: data,
    });
    return true;
  }
  async findAndDelete(where: {}): Promise<Boolean> {
    await prisma.schema.delete({ where });
    return true;
  }
}

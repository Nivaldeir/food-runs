import { Motoboy as IMotoboy } from "@prisma/client";
import bycrpt from "bcrypt";
import { prisma } from "../libs/prisma";

export class Motoboy {
    constructor() {}
    async create(data: IMotoboy) {
        try {
            const isExist = await prisma.motoboy.findFirst({
                where: {
                    cellphone: data.cellphone,
                    email: data.email,
                    cpf: data.cpf,
                },
            });
            if (isExist) {
                return {
                    error: true,
                    message: "Usuario já cadastrado",
                };
            }
            const response = await prisma.motoboy.create({
                data: {
                    ...data,
                    password: await bycrpt.hash(
                        data.password.toString(),
                        Number(process.env.SALTORROUNDS)
                    ),
                },
            });
            return response;
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
            };
        }
    }
    async findOne(where?: {}): Promise<IMotoboy | object> {
        try {
            const response = await prisma.motoboy.findFirstOrThrow({
                where: where,
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
    ): Promise<IMotoboy[] | object> {
        try {
            const response = await prisma.motoboy.findMany({
                where: where,
                orderBy: orderBy,
                select: {
                    actived: true,
                    cellphone: true,
                    cpf: true,
                    email: true,
                    avatar: true,
                    id: true,
                    lastname: true,
                    moto: true,
                    Other: true,
                    name: true,
                    password: false,
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
    async findAndUpdate(id: string, data: IMotoboy): Promise<IMotoboy> {
        const res = await prisma.motoboy.update({
            where: {
                id: id,
            },
            data: data,
        });
        return res;
    }
    async findAndDelete(where: {}): Promise<Boolean> {
        return true;
    }
}

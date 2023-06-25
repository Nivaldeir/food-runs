import { Company as ICompany } from "@prisma/client";
import bycrpt from "bcrypt";
import { prisma } from "../libs/prisma";

export class Company {
    constructor() {}
    async create(data: ICompany) {
        try {
            const isExist = await prisma.company.findFirst({
                where: {
                    cellphone: data.cellphone,
                    email: data.email,
                    cnpj: data.cnpj,
                },
            });
            if (isExist) {
                return {
                    error: true,
                    message: "Usuario já cadastrado",
                };
            }
            const response = await prisma.company.create({
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
    async findOne(where?: {}): Promise<ICompany | object> {
        try {
            const response = await prisma.company.findFirstOrThrow({
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
    ): Promise<ICompany[] | object> {
        try {
            const response = await prisma.company.findMany({
                where: where,
                orderBy: orderBy,
                select: {
                    avatar: true,
                    cnpj: true,
                    password: false,
                    cellphone: true,
                    createAt: true,
                    email: true,
                    actived: true,
                    id: true,
                    // schema: true,
                    name: true,
                    Other: true,
                    isAdmin: true,
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
    async findAndUpdate(id: string, data: ICompany): Promise<Boolean> {
        await prisma.company.update({
            where: {
                id: id,
            },
            data: data,
        });
        return true;
    }
    async findAndDelete(where: {}): Promise<Boolean> {
        await prisma.company.delete({ where });
        return true;
    }
}

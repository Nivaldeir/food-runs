import { Other as IOther } from "@prisma/client";
import { prisma } from "../libs/prisma";
import { getRoute } from "../services/googleMaps";
import { io } from "..";
import { userSocketMap } from "../libs/socket/clients";
import { Motoboy } from "../model/Motoboy";
import { Motoboy as IMotoboy } from "@prisma/client";

export interface IRideRequest {
    userRequest: {
        latitude: number;
        longitude: number;
    };
    other: {
        id: string;
        address: string;
        number: string;
        geo: {
            latitude: number;
            longitude: number;
        };
    };
}

export class Other {
    constructor() {}
    async create(data: IOther) {
        try {
            const response = await prisma.other.create({
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
    async findOne(where: {}): Promise<IOther | object> {
        try {
            const response = await prisma.other.findFirstOrThrow({
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
    ): Promise<IOther[] | object> {
        try {
            const response = await prisma.other.findMany({
                where: where,
                orderBy: orderBy,
                select: {
                    company: true,
                    motoboy: {
                        select: {},
                    },
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
    async findAndUpdate(id: string, data: IOther): Promise<IOther> {
        const response = await prisma.other.update({
            where: {
                id: id,
            },
            data: { ...data },
        });
        return response;
    }
    async findAndDelete(where: {}): Promise<Boolean> {
        await prisma.other.delete({ where });
        return true;
    }

    async findWithUpdateMotoboyAndOther(
        motoboyId: string,
        otherId: string,
        type: "cancell" | "find"
    ) {
        const response = await prisma.$transaction(async (transaction) => {
            await transaction.motoboy.update({
                where: {
                    id: motoboyId,
                },
                data: {
                    inRunning: type == "cancell" ? false : true,
                },
            });
            await transaction.other.update({
                where: {
                    id: otherId,
                },
                data: {
                    motoboyId: type == "cancell" ? null : motoboyId,
                } as IOther,
            });
            return true;
        });
        return response;
    }
    async sideRequest({ userRequest, other }: IRideRequest) {
        const raioEmKm: number = 5;
        if (!userRequest?.longitude && !userRequest?.latitude && !other?.geo) {
            return {
                error: true,
                essage: "Latitude e Longitude obrigatorio",
            };
        }

        const motoboys = await prisma.motoboy.findMany({
            // where: {
            //     latitude: {
            //         gte: userRequest?.latitude - raioEmKm / 111.12,
            //         lte: userRequest?.latitude + raioEmKm / 111.12,
            //     },
            //     longitude: {
            //         gte: userRequest?.longitude - raioEmKm / 111.12,
            //         lte: userRequest?.longitude + raioEmKm / 111.12,
            //     },
            //     // inRunning: false,
            // },
        });
        const responseGoogleApi = await getRoute(
            [userRequest.latitude, userRequest.longitude],
            [other.geo.latitude, other.geo.longitude]
        );

        if (motoboys.length) {
            let count = 0;
            console.log(motoboys.length - 1);
            while (count <= motoboys.length - 1) {
                let accepted = false;
                console.log(motoboys[count].id);
                io.sockets.sockets.get(userSocketMap[motoboys[count].id])?.emit(
                    "ride-request",
                    {
                        ...responseGoogleApi,
                        userRequest,
                        other,
                    },
                    async function awaitBody(type: boolean) {
                        if (type) {
                            accepted = true;
                            new Other().findWithUpdateMotoboyAndOther(
                                motoboys[count].id,
                                other.id,
                                "find"
                            );
                            return {
                                idMotoboy: motoboys[count].id,
                            };
                        }
                    }
                );
                await delay(10000);
                if (accepted) {
                    break;
                }
                count++;
            }
            return {
                Message: "Nao encontrado",
            };
        }
    }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { userSocketMap } from "./clients";

interface IUser {
    name: string;
    avatarUrl: string;
    id: string;
    isAdmin: boolean;
}

async function SockerServer(io: Server) {
    io.use((req: any, next) => {
        const authHeader =
            req.headers?.token ||
            req.handshake.query.token ||
            req.handshake.headers?.token;
        if (authHeader) {
            const token = authHeader;
            if (!token) {
                return;
            }
            jwt.verify(
                token,
                String(process.env.SECRET_JWT),
                (err: any, decoded: any) => {
                    if (err) {
                        return {
                            error: true,
                            message: "Token invalido",
                        };
                    }
                    req.user = decoded as IUser;
                    next();
                }
            );
        }
    });

    io.on("connection", (socket) => {
        if (!userSocketMap[socket?.user?.id]) {
            userSocketMap[socket?.user?.id] = socket.id;
        }
        console.log("USER SOCKET: ", userSocketMap);

        socket.on("disconnect", () => {
            // Remover a associação do usuário quando a conexão é encerrada
            const userId = Object.keys(userSocketMap).find(
                (key) => userSocketMap[key] === socket.id
            );
            if (userId) {
                delete userSocketMap[userId];
                console.log(
                    `Usuário ${userId} desconectado - socketId: ${socket.id}`
                );
            }
        });
    });
}

export { SockerServer };

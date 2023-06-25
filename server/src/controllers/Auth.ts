import bycrpt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";

export default {
  authentication: async (req: FastifyRequest, res: FastifyReply) => {
    const { email, password } = req.body as IAuth;
    var response = (await prisma.$transaction([
      prisma.motoboy.findUnique({
        where: {
          email,
        },
      }),
      prisma.company.findUnique({
        where: {
          email,
        },
      }),
    ])) as any;
    response = response.filter((e: object) => e)[0];
    if (!(await response)) {
      return res.status(400).send({
        error: true,
        message: "Email ou senha incorreto",
      });
    }
    if (response.id && (await bycrpt.compare(password, response.password))) {
      const token = jwt.sign(
        {
          name: response.name as string,
          avatarUrl: response.avatar as string,
          id: response.id as string,
          isAdmin: response.isAdmin as boolean,
        },
        process.env.SECRET_JWT as string,
        {
          expiresIn: "07 days",
        }
      );
      return res.status(200).send({
        error: false,
        token: token,
      });
    }

    return res.status(400).send({
      error: true,
      message: "Usuario ou Senha incorreto",
    });
  },
  getTokenInformation: async (
    token: string
  ): Promise<{ error: boolean; message: string } | any> => {
    const result = jwt.verify(
      token,
      String(process.env.SECRET_JWT),
      (error, decoded) => {
        if (error) {
          return {
            error: true,
            message: "Token invalido",
          };
        }
        return decoded;
      }
    );
    return result;
  },
};

import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import * as bcrypt from 'bcrypt'
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKey, Payload, verifyAuthAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import cookie from "cookie";
import { NextApiRequest } from "next";


export const User = router({

    login: publicProcedure.input(
        z.object({
            email: z.string(),
            password: z.string(),

        })).mutation(async ({ ctx, input }) => {

            const { db, res } = ctx
            const { email, password } = input
            const isExistEmail = await db.user.findFirst({ where: { email } }
            )


            if (isExistEmail) {

                const senhaHashed = await bcrypt.compare(password, isExistEmail.password)

                if (senhaHashed) {

                    if (isExistEmail.role === "user") {

                        const token = await new SignJWT({ admin: false, idUser: isExistEmail.id }).setProtectedHeader({ alg: 'HS256' }).setJti(nanoid()).setIssuedAt().setExpirationTime('1h').sign(new TextEncoder().encode(getJwtSecretKey()));

                        res.setHeader('Set-Cookie', cookie.serialize('user-token', token, {
                            httpOnly: true,
                            path: '/',
                            secure: process.env.NODE_ENV === "production"
                        }))

                    } else {

                        const token = await new SignJWT({ admin: true, idUser: isExistEmail.id }).setProtectedHeader({ alg: 'HS256' }).setJti(nanoid()).setIssuedAt().setExpirationTime('1h').sign(new TextEncoder().encode(getJwtSecretKey()));

                        res.setHeader('Set-Cookie', cookie.serialize('user-token', token, {
                            httpOnly: true,
                            path: '/',
                            secure: process.env.NODE_ENV === "production"
                        }))

                    }


                    return { success: true, message: "Logado com sucesso" }


                }

            }


            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "E-mail ou senha inválidos"
            })


        }),


    register: publicProcedure.input(
        z.object({

            firstName: z.string(),
            secondName: z.string(),
            email: z.string().email(),
            password: z.string(),

        }))
        .mutation(async ({ ctx, input }) => {

            const { db } = ctx
            const { firstName, secondName, email, password } = input


            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)


            try {

                if (!(db.$connect))

                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Não foi possível se registrar , erro no servidor!!',
                    })


                await db.user.create({
                    data: {
                        name: firstName + " " + secondName,
                        email,
                        password: hashedPassword,
                    },
                });

                return { success: true, message: "Cadastro criado com sucesso." }

            } catch (error) {

                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "E-mail já existe"
                    })
                }
            }


        }),


    get: publicProcedure.query(async ({ ctx }) => {
        const { db, req } = ctx

        const tokenValue = token(req as NextApiRequest);

        try {
            const verifyToken = tokenValue && (await verifyAuthAdmin(tokenValue));

            if (!verifyToken) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Token inválido ou expirado"
                });


            }


            const isUserExist = await db.user.findFirst({
                where: {
                    id: verifyToken.userId
                }
            })


            if (isUserExist) {
                return isUserExist
            }


        } catch (err) {
            console.error("Erro ao verificar o token:");

        }


    })


})

export function token(req: NextApiRequest): string | undefined {
    return req.cookies['user-token'];
}
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "@/lib/auth";
import cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import bcrypt from 'bcrypt'

export const adminRouter = router({
    login: publicProcedure.input(z.object({ email: z.string().email(), password: z.string() })).mutation(async ({ ctx, input }) => {
        const { res, db } = ctx
        const { email, password } = input
        const dataUserDB = await db.usuario.findFirst({ where: { email } })

        if (dataUserDB) {
            // Autenticação do usuário como admin
            const senhaHashed = await bcrypt.compare(password, dataUserDB.password)

            if (senhaHashed) {

                const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setJti(nanoid()).setIssuedAt().setExpirationTime('1h').sign(new TextEncoder().encode(getJwtSecretKey()))

                res.setHeader('Set-Cookie', cookie.serialize('user-Token', token, {
                    httpOnly: true,
                    path: '/',
                    secure: process.env.NODE_ENV === "production"
                }))
                return { success: true }
            }

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Senha inválida"
            })
        }

        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email inválido"
        })


    }),


    registerUser: publicProcedure.input(
        z.object({
            name: z.string(),
            email: z.string(),
            password: z.string(),

        })
    ).mutation(async ({ ctx, input }) => {
        const { name, email, password, } = input
        const salt = await bcrypt.genSalt(10)
        const hashaedPassword = await bcrypt.hash(password, salt)

        try {
            if (!(ctx.db.$connect))

                return { success: false }

            else

                await ctx.db.usuario.create({
                    data: {
                        name,
                        email,
                        password: hashaedPassword,

                    },
                })

            return { success: true }

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Email já existe"
                    })
                }


            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Não foi possível se registrar , erro no servidor!!',
            })




        }
    }),

})



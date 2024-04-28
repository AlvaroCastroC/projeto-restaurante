import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "@/lib/auth";
import cookie from "cookie";
import { TRPCError } from "@trpc/server";


export const adminRouter = router({
    login: publicProcedure.input(z.object({ email: z.string().email(), password: z.string() })).mutation(async ({ ctx, input }) => {
        const { res } = ctx
        const { email, password } = input

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Autenticação do usuário como admin

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
            message: "Email ou Senha inválidos"
        })
    }),

    registerUser: publicProcedure.input(
        z.object({
            name: z.string(),
            phone: z.string(),
            email: z.string(),
            password: z.string(),
            keywords: z.array(z.union([z.literal("maca"), z.literal("gato"), z.literal("cachorro")]))

        })
    ).mutation(async ({ ctx, input }) => {
        const { name, email, phone, password, keywords } = input

        const createUser = await ctx.db.usuario.create({
            data: {
                name,
                email,
                password,
                phone,
                keywords,

            },
        })
        return createUser
    }),

})


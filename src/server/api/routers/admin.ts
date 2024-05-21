import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "@/lib/auth";
import cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import { Resend } from "resend";
import { Email } from "@/components/email-template/email-template";
import { NextResponse } from "next/server";
import { addMinutes, format } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);


export const adminRouter = router({



    login: publicProcedure.input(
        z.object({
            email: z.string(),
            password: z.string(),

        })).mutation(async ({ ctx, input }) => {

            const { res, db } = ctx
            const { email, password, } = input
            const dataUserDB = await db.user.findFirst({ where: { email } }).catch(() => {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Não foi possivel fazer o login, teste mais tarde!',
                })
            })



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

                } else {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Senha inválida"
                    })
                }



            } else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Email inválido"
                })
            }

        }),


    registerUser: publicProcedure.input(
        z.object({

            firstName: z.string(),
            secondName: z.string(),
            email: z.string(),
            password: z.string(),
            phone: z.string(),
            role: z.string(),

        })
    ).mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { firstName, secondName, email, password, phone, role } = input

        const salt = await bcrypt.genSalt(10)
        const hashaedPassword = await bcrypt.hash(password, salt)


        if (!(db.$connect))

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Não foi possível se registrar , erro no servidor!!',
            })

        else
            if (role === process.env.ROLE) {
                try {
                    await db.user.create({
                        data: {
                            firstName,
                            secondName,
                            email,
                            password: hashaedPassword,
                            phone,
                        },
                    })
                } catch (error) {
                    if (error instanceof Prisma.PrismaClientKnownRequestError) {
                        throw new TRPCError({
                            code: "UNAUTHORIZED",
                            message: "E-mail já existe"
                        })
                    }

                }
                return { success: true }
            } else {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Código não é válido"
                })
            }





    }),

    forgotPassword: publicProcedure.input(z.object({

        email: z.string().email(),
        phone: z.string(),
    })).mutation(async ({ ctx, input }) => {

        const { db } = ctx
        const { email, phone } = input
        const dataUserDB = await db.user.findFirst({ where: { email } }).catch(() => {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Não foi possivel fazer o login, teste mais tarde!',
            })
        })




        if (dataUserDB) {
            if (dataUserDB.phone === phone) {


                // try {
                //     const data = await db.user.findUnique({ where: { email } })
                //     await resend.emails.send({
                //         from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
                //         to: [`${email}`],
                //         subject: 'Olá, tudo bem com você',
                //         react: Email({ firstName: `${data?.name}` }),
                //     });
                // } catch (error) {
                //     console.log(error)
                // }
                try {
                    const salt = await bcrypt.genSalt(10)

                    let token = (await bcrypt.hash('s0/\/\P4$$w0rD', salt)).toString()
                    token = token.replace(/[^\A-Z]+/g, "").substring(0, 6)
                    //Configuring the Date Type
                    let date: any;

                    // Receiving the values and converting them
                    date = addMinutes(new Date(), 5)
                    date = format(date, "HH:mm:ss")


                    await db.user.update({
                        where: { email },
                        data: {
                            passwordResetToken: token,
                            passwordResetExpires: date
                        }
                    })


                } catch (error) {
                    console.log(error)
                }
                return { success: true }
            }

            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Alteração não autorizada, telefone inválido"
            })



        }

        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Alteração não autorizada, email não existe"
        })
    }),


    resetPassword: publicProcedure.input(z.object({
        token: z.string(),
        password: z.string(),
        email: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { token, password, email } = input


        //Receiving the values and converting them
        const date = format(new Date(), "HH:mm:ss")


        const dataUserDB = await db.user.findUnique({ where: { email } })

        if (dataUserDB) {

            if (token === dataUserDB.passwordResetToken) {

                if (dataUserDB?.passwordResetExpires !== null) {

                    if (date < dataUserDB.passwordResetExpires) {

                        const salt = await bcrypt.genSalt(10)
                        const hashaedPassword = await bcrypt.hash(password, salt)

                        await db.user.update({
                            where: { email },
                            data: {
                                password: hashaedPassword,
                                passwordResetExpires: null,
                                passwordResetToken: null,
                            }
                        })


                        return { success: true }
                    }

                    // await db.user.update({
                    //     where: { email },
                    //     data: {
                    //         passwordResetToken: null,
                    //         passwordResetExpires: null,
                    //     }
                    // })

                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Token com o tempo expirado, gere um novo token!"
                    })


                }
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Token não existe, gere um novo token!"
                })

            }

            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Requisição não confere, verifique o token novamente!"
            })
        }

        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Email não encontrado, por favor digite o e-mail correspondente!"
        })



    }),

});



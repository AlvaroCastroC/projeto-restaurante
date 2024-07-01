import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKeyAdmin, getJwtSecretKeyClient } from "@/lib/auth";
import cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import { Resend } from "resend";
import { Email } from "@/components/email-template/email-template";
import { NextResponse } from "next/server";
import { addMinutes, format, parseISO } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);


export const CreateUser = router({



    login: publicProcedure.input(
        z.object({
            email: z.string(),
            password: z.string(),

        })).mutation(async ({ ctx, input }) => {

            const { res, db } = ctx
            const { email, password, } = input
            const dataUserDB = await db.user.findFirst({ where: { email } })
            const isUserExists = await db.user.findMany()


            if (email === process.env.ADMIN_EMAIL, password === process.env.ADMIN_PASSWORD) {

                if (!isUserExists.find(e => e.role === "admin")) {
                    const token = await new SignJWT({ email: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setJti(nanoid()).setIssuedAt().setExpirationTime('1h').sign(new TextEncoder().encode(getJwtSecretKeyAdmin()))

                    res.setHeader('Set-Cookie', cookie.serialize('user-Token-admin', token, {
                        httpOnly: false,
                        path: '/',
                        secure: process.env.NODE_ENV === "production"
                    }))

                    return { success: true, message: "Logado com sucesso" }
                }
                else {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Conta não existe"
                    })
                }
            } else if (dataUserDB) {

                if (dataUserDB.role === "user") {
                    // Autenticação do usuário como admin
                    const senhaHashed = await bcrypt.compare(password, dataUserDB.password)



                    if (senhaHashed) {

                        const token = await new SignJWT({ email: dataUserDB.email }).setProtectedHeader({ alg: 'HS256' }).setJti(nanoid()).setIssuedAt().setExpirationTime('1h').sign(new TextEncoder().encode(getJwtSecretKeyClient()))

                        res.setHeader('Set-Cookie', cookie.serialize('user-Token-client', token, {
                            httpOnly: false,
                            path: '/',
                            secure: process.env.NODE_ENV === "production"
                        }))

                        return { success: true, message: "Logado com sucesso" }

                    } else {
                        throw new TRPCError({
                            code: "UNAUTHORIZED",
                            message: "Senha inválida"
                        })
                    }



                }

                if (dataUserDB.role === "admin") {

                    const senhaHashed = await bcrypt.compare(password, dataUserDB.password)



                    if (senhaHashed) {

                        const token = await new SignJWT({ email: dataUserDB.email }).setProtectedHeader({ alg: 'HS256' }).setJti(nanoid()).setIssuedAt().setExpirationTime('1h').sign(new TextEncoder().encode(getJwtSecretKeyAdmin()))

                        res.setHeader('Set-Cookie', cookie.serialize('user-Token-admin', token, {
                            httpOnly: false,
                            path: '/',
                            secure: process.env.NODE_ENV === "production"
                        }))

                        return { success: true, message: "Logado com sucesso" }

                    } else {
                        throw new TRPCError({
                            code: "UNAUTHORIZED",
                            message: "Senha inválida"
                        })
                    }
                }
            } else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Conta não existe"
                })
            }



        }),


    registerUser: publicProcedure.input(
        z.object({

            firstName: z.string(),
            secondName: z.string(),
            email: z.string().email(),
            password: z.string(),
            phone: z.string(),
            role: z.enum(['admin', 'user']).default('user')

        })
    ).mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { firstName, secondName, email, password, phone, role } = input

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
                    firstName,
                    secondName,
                    email,
                    password: hashedPassword,
                    phone,
                    imageKey: 'null',
                    role

                }

            })

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

    updateUser: publicProcedure.input(
        z.object({
            id: z.string(),
            imageKey: z.string().optional(),
            firstName: z.string(),
            secondName: z.string()

        })
    ).mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { id, imageKey, firstName, secondName } = input



        if (!(db.$connect))

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Não foi possível se registrar , erro no servidor!!',
            })

        else

            await db.user.update({
                where: { id },
                data: {
                    imageKey,
                    firstName,
                    secondName,
                }

            })

        return { success: true, message: "Perfil atualizado com successo." }


    }),


    // registerAdmin: publicProcedure.input(
    //     z.object({

    //         firstName: z.string(),
    //         secondName: z.string(),
    //         email: z.string(),
    //         password: z.string(),
    //         phone: z.string(),
    //         imageKey: z.string().optional()

    //     })
    // ).mutation(async ({ ctx, input }) => {
    //     const { db } = ctx
    //     const { firstName, secondName, email, password, phone, imageKey } = input

    //     const salt = await bcrypt.genSalt(10)
    //     const hashedPassword = await bcrypt.hash(password, salt)


    //     if (!(db.$connect))

    //         throw new TRPCError({
    //             code: 'INTERNAL_SERVER_ERROR',
    //             message: 'Não foi possível se registrar , erro no servidor!!',
    //         })

    //     else

    //         try {
    //             await db.user.create({
    //                 data: {
    //                     firstName,
    //                     secondName,
    //                     email,
    //                     password: hashedPassword,
    //                     phone,
    //                     imageKey,
    //                     role: "admin"
    //                 },
    //             })
    //             return { success: true, message: "Cadastro do admin criado." }
    //         } catch (error) {
    //             if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //                 throw new TRPCError({
    //                     code: "UNAUTHORIZED",
    //                     message: "E-mail já existe"
    //                 })
    //             }

    //         }

    // }),

    forgotPassword: publicProcedure.input(z.object({

        email: z.string().email(),
        phone: z.string(),
        role: z.enum(['admin', 'user'])
    })).mutation(async ({ ctx, input }) => {

        const { db } = ctx
        const { email, phone, role } = input
        const dataUserDB = await db.user.findFirst({ where: { email, role } })




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
                    date = parseISO(addMinutes(new Date(), 5).toISOString())



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
                        const hashedPassword = await bcrypt.hash(password, salt)

                        await db.user.update({
                            where: { email },
                            data: {
                                password: hashedPassword,
                                passwordResetExpires: null,
                                passwordResetToken: null,
                            }
                        })


                        return { success: true }
                    }


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



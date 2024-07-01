import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { tokenClient } from "./user";
import { NextApiRequest } from "next";
import { verifyAuthClient } from "@/lib/auth";


export const bookingRouter = router({


    bookingCreate: publicProcedure.input(z.object({
        bookingDate: z.date(),
        clientName: z.string(),
        phone: z.string(),
        email: z.string(),
        service: z.string(),
        price: z.number(),
        idEmployee: z.number()

    })).mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { bookingDate, clientName, phone, email, service, price, idEmployee } = input

        const dataClient = await db.client.findMany({
            include: {
                services: true
            }
        })

        const isExistClient = dataClient.find(e => e.email === email)
        const isExistService = isExistClient?.services.find(e => e.clientid === isExistClient.id)


        if (!db.$connect) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao reservar, tente mais tarde!"
        })


        if (!email) throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Por favor, faça seu cadastro primeiro"
        })


        if (isExistClient && !isExistService) {
            await db.client.delete({
                where: {
                    id: isExistClient?.id
                }
            })

        }

        if (isExistClient && isExistService) {



            if (isExistClient.services.find(e => e.bookingDate < new Date())) {
                await db.services.delete({
                    where: {
                        id: isExistService?.id
                    }
                })

            }

            if (isExistClient.services.find(e => e.service === service)) {
                await db.services.update({
                    where: {
                        id: isExistService?.id
                    },

                    data: {
                        service,
                        bookingDate,
                        price,
                        employees: {
                            connect: {
                                id: idEmployee
                            }
                        }
                    }

                })
                return { success: true, message: "Horário remarcado com sucesso." }
            } else {
                await db.services.create({

                    data: {
                        bookingDate,
                        service,
                        price,
                        client: {

                            connect: {
                                id: isExistClient.id,

                            },

                        },
                        employees: {
                            connect: {
                                id: idEmployee
                            }
                        }
                    },


                })
                return { success: true, message: "Horário marcado com sucesso." }
            }
        } else {
            await db.client.create({
                data: {
                    clientName,
                    phone,
                    email,
                    services: {
                        create: {
                            service,
                            price,
                            bookingDate,
                            employeeId: idEmployee
                        }
                    }
                },


            })
            return { success: true, message: "Horário agendado com sucesso." }
        }

    }),



    bookingQuery: publicProcedure.query(async ({ ctx }) => {
        const { db, req } = ctx


        if (!await db.client.findMany()) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Erro no servidor, tente mais tarde!"
            })
        }

        const tokenValueClient = tokenClient(req as NextApiRequest);
        const verifyTokenClient = tokenValueClient && (await verifyAuthClient(tokenValueClient));
        if (!verifyTokenClient) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Token inválido ou expirado"
            });
        }
        const dataClient = await db.client.findFirst({
            where: {
                email: verifyTokenClient.email
            },
            include: {
                services: {
                    include: {
                        employees: true
                    }
                }
            }
        })

        dataClient?.services.map(async e => e.bookingDate < new Date() ? await db.services.delete({ where: { id: e.id } }) : dataClient)

        return dataClient
    }),


    allServiceQuery: publicProcedure.query(async ({ ctx }) => {
        const { db } = ctx

        if (!await db.allservices.findMany()) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Erro no servidor, tente mais tarde!"
            })
        }


        const services = await db.allservices.findMany()

        return services

    }),

    serviceDelelete: publicProcedure.input(z.object({
        id: z.number()
    })).mutation(async ({ ctx, input }) => {
        const { id } = input
        const { db, req } = ctx

        const tokenValueClient = tokenClient(req as NextApiRequest);
        const verifyTokenClient = tokenValueClient && (await verifyAuthClient(tokenValueClient));
        if (!verifyTokenClient) return

        const userQuery = await db.services.findMany();


        if (!db.$connect()) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro no servidor, tente mais tarde!"
        })

        await db.services.delete({
            where: {
                id
            }
        })

    })
})


import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";


export const bookingRouter = router({


    bookingCreate: publicProcedure.input(z.object({
        bookingDate: z.date(),
        clientName: z.string(),
        phone: z.string(),
        email: z.string(),
        service: z.string()

    })).mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { bookingDate, clientName, phone, email, service
        } = input

        const dataClient = await db.client.findUnique({ where: { email } })

        if (!db.$connect) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao reservar, tente mais tarde!"
        })


        if (!email) throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Por favor, faça seu cadastro primeiro"
        })


        if (dataClient) {
            if (new Date() > dataClient.bookingDate) {
                await db.client.delete({
                    where: { email }
                })
            }

            if (dataClient.bookingDate.getDate() === bookingDate.getDate()) {
                await db.client.update({
                    where: { email },
                    data: {
                        bookingDate,
                        service: {
                            update: {
                                name: service,
                                price: 30.55
                            }
                        }

                    },


                })
                return { success: true, message: "Horário remarcado com sucesso." }
            } else {
                await db.client.update({
                    where: { email },
                    data: {
                        bookingDate,
                        service: {
                            update: {
                                name: service,
                                price: 40.55
                            }
                        }

                    },

                })
                return { success: true, message: "Horário marcado com sucesso." }
            }
        } else {
            await db.client.create({
                data: {
                    bookingDate,
                    clientName,
                    phone,
                    email,
                    service: {
                        create: {
                            name: service,
                            price: 70.55
                        }
                    }
                },


            })
            return { success: true, message: "Horário agendado com sucesso." }
        }

    }),



    bookingQuery: publicProcedure.query(async ({ ctx }) => {
        const { db } = ctx


        if (!await db.client.findMany()) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Erro no servidor, tente mais tarde!"
            })
        }

        const dataClient = await db.client.findMany({
            include: {
                service: true
            }
        })

        return dataClient
    })
})
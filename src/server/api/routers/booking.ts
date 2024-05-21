import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";


export const bookingRouter = router({


    bookingCreate: publicProcedure.input(z.object({
        bookingDate: z.date(),
        clientName: z.string(),
        phone: z.string(),
        email: z.string(),
        service: z.string(),
        price: z.number()

    })).mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { bookingDate, clientName, phone, email, service, price } = input

        const dataClient = await db.client.findMany({
            include: {
                service: true
            }
        })

        const isExistClient = dataClient.find(e => e.email === email)
        const isExistService = isExistClient?.service.find(e => e.clientid === isExistClient.id)


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



            if (isExistClient.service.find(e => e.bookingDate < new Date())) {
                await db.services.delete({
                    where: {
                        id: isExistService?.id
                    }
                })

            }

            if (isExistClient.service.find(e => format(e.bookingDate, "d M HH:mm") === format(bookingDate, "d M HH:mm"))) {
                await db.services.update({
                    where: {
                        id: isExistService?.id
                    },

                    data: {
                        name: service,
                        bookingDate,
                        price,
                    }

                })
                return { success: true, message: "Horário remarcado com sucesso." }
            } else {
                await db.services.create({

                    data: {
                        bookingDate,
                        name: service,
                        price,
                        client: {

                            connect: {
                                id: isExistClient.id,

                            },

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
                    service: {
                        create: {
                            name: service,
                            price,
                            bookingDate,

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
    }),


    allServiceQuery: publicProcedure.query(async ({ ctx }) => {
        const { db } = ctx

        if (!await db.allServices.findMany()) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Erro no servidor, tente mais tarde!"
            })
        }


        const services = await db.allServices.findMany()

        return services

    }),

    serviceDelelete: publicProcedure.input(z.object({
        id: z.number()
    })).mutation(async ({ ctx, input }) => {
        const { id } = input
        const { db } = ctx



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


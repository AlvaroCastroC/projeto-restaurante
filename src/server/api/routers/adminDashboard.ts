import { TRPCError } from "@trpc/server";
import { adminProcedure, router } from "../trpc";
import { z } from "zod";
import { formatISO, parse } from "date-fns";



export const dashboardRouter = router({
    bookingQuery: adminProcedure.query(async ({ ctx }) => {
        const { db } = ctx

        if (!db.$connect) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao reservar, tente mais tarde!"
        })

        const isExistBooking = await db.client.findMany({
            include: {
                services: {
                    orderBy: {
                        bookingDate: 'asc',
                    },
                    include: {
                        employees: true
                    }
                }
            },

        })

        return isExistBooking



    }),

    bookingDelete: adminProcedure.input(z.object({
        id: z.string()
    })).mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { id } = input


        await db.client.delete({
            where: {
                id
            }
        })
    }),


    allServiceCreate: adminProcedure.input(z.object({
        service: z.string(),
        price: z.number()
    })).mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { service, price } = input

        const isExistService = await db.allservices.findFirst({
            where: {
                service
            }
        })
        const isExist = await db.allservices.count()
        if (!db.$connect) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao reservar, tente mais tarde!"
        })

        if (isExistService && isExist) {
            return { success: false, message: "Aparentemente este serviço já existe!" }
        }

        await db.allservices.create({
            data: {
                service,
                price,
            }
        })

        return { success: true, message: "Serviço criado." }


    }),


    allServiceQuery: adminProcedure.query(async ({ ctx }) => {
        const { db } = ctx


        if (!db.$connect) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao reservar, tente mais tarde!"
        })

        const allService = await db.allservices.findMany({
            orderBy: {
                service: 'asc'
            }
        })

        return allService
    }),


    allServiceUpdate: adminProcedure.input(z.object({
        id: z.string(),
        service: z.string(),
        price: z.number(),
    })).mutation(async ({ input, ctx }) => {
        const { db } = ctx
        const { service, price, id } = input

        const isExistService = await db.allservices.findFirst({
            where: {
                service
            }
        })
        if (!db.$connect) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao reservar, tente mais tarde!"
        })

        if (!isExistService) {

            await db.allservices.update({
                where: { id },
                data: {
                    service,
                    price
                }
            })

            return { success: true, message: "Serviço atualizado" }

        }

        return { success: false, message: "Já existe este serviço" }


    }),


    allServiceDelelete: adminProcedure.input(z.object({
        id: z.string().optional(),
        optional: z.enum(["all", "one"])
    })).mutation(async ({ ctx, input }) => {
        const { id, optional } = input
        const { db } = ctx

        const isExists = await db.allservices.count()

        if (!db.$connect()) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro no servidor, tente mais tarde!"
        })


        if (isExists) {
            if (optional === "all") {
                await db.allservices.deleteMany()

                return { success: true, message: "Concluido." }
            } else {
                await db.allservices.delete({
                    where: {
                        id
                    }
                })

                return { success: true, message: "Concluido." }
            }
        } else {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Serviços inexistentes"
            })
        }



    }),

    serviceDelelete: adminProcedure.input(z.object({
        id: z.number()
    })).mutation(async ({ ctx, input }) => {
        const { id } = input
        const { db } = ctx

        const clientService = await db.client.findMany({
            include: {
                services: true
            }
        })


        if (!db.$connect()) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro no servidor, tente mais tarde!"
        })

        try {
            if (clientService) {
                await db.services.delete({
                    where: {
                        id
                    }
                })

                return { success: true, message: "cliente excluido com sucesso!" }


            }
        } catch (error) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Serviço do cliente não encontrado"
            })
        }

    }),

    createEmployees: adminProcedure.input(z.object({
        name: z.string(),
        initTime: z.string(),
        imageKey: z.string(),
        category: z.array(z.union([z.literal('corte'), z.literal('hidratação'), z.literal('pedicure')]))
    })).mutation(async ({ ctx, input }) => {
        const { category, initTime, imageKey, name } = input
        const { db } = ctx

        const data = parse(initTime, 'yyyy-MM-dd', new Date())
        const dataFormatada = formatISO(data)


        await db.employees.create({
            data: {
                name,
                initTime: dataFormatada,
                category: {
                    createMany: {
                        data: category.map(catName => ({ name: catName })),
                    }
                },
                imageKey

            }
        })

        return { success: true, message: 'Funcionário adicionado' }
    })



})
import { TRPCError } from "@trpc/server";
import { adminProcedure, router } from "../trpc";
import { z } from "zod";





export const dashboardRouter = router({
    bookingQuery: adminProcedure.query(async ({ ctx }) => {
        const { db } = ctx

        if (!db.$connect) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao reservar, tente mais tarde!"
        })

        const isExistBooking = await db.client.findMany({
            include: {
                service: {
                    orderBy: {
                        bookingDate: 'asc',
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

    serviceDelelete: adminProcedure.input(z.object({
        id: z.number()
    })).mutation(async ({ ctx, input }) => {
        const { id } = input
        const { db } = ctx



        if (!db.$connect()) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro no servidor, tente mais tarde!"
        })

        try {
            await db.services.delete({
                where: {
                    id
                }
            })

        } catch (error) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Serviço do cliente não encontrado"
            })
        }

    })
})
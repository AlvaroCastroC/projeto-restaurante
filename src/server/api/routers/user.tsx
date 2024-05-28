import { z } from "zod";
import { publicProcedure, router } from "../trpc";


export const User = router({

    userQuery: publicProcedure.input(z.object({
        email: z.string()
    })).query(async ({ ctx, input }) => {
        const { db } = ctx
        const { email } = input

        const userQuery = await db.user.findUnique({
            where: { email }
        })

        return userQuery

    })
})
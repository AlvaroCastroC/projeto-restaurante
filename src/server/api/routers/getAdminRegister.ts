import { publicProcedure, router } from "../trpc";

export const getAdminRegister = router({

    getAllData: publicProcedure.query(async ({ ctx }) => {
        const getAll = ctx.db.usuario.findMany()

        return getAll
    })
})
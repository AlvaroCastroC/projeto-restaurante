import { createCallerFactory, router } from "@/server/api/trpc";
import { User } from "./routers/users";

export const appRouter = router({
    userLogin: User.login,
    userRegister: User.register,
    get: User.get
});

export type AppRouter = typeof appRouter;


export const createCaller = createCallerFactory(appRouter);
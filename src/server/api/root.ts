import { createCallerFactory, router } from "@/server/api/trpc";
import { CreateUser } from "./routers/admin";
import { openingRouter } from "./routers/opening";
import { bookingRouter } from "./routers/booking";
import { dashboardRouter } from "./routers/adminDashboard";
import { User } from "./routers/user";
import { pressignedUrl } from "./routers/imageS3";
import { employeesImage } from "./routers/employees";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  user: User,
  createUser: CreateUser,
  opening: openingRouter,
  booking: bookingRouter,
  dashboard: dashboardRouter,
  imagePressigned: pressignedUrl,
  employees: employeesImage,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

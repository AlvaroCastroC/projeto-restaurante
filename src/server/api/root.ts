import { createCallerFactory, router } from "@/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { openingRouter } from "./routers/opening";
import { bookingRouter } from "./routers/booking";
import { dashboardRouter } from "./routers/adminDashboard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  admin: adminRouter,
  opening: openingRouter,
  booking: bookingRouter,
  dashboard: dashboardRouter,
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

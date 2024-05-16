
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { verifyAuth } from "@/lib/auth";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */


export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const { res, req } = _opts
  return {
    req, res, db
  };
};


const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});


export const createCallerFactory = t.createCallerFactory;



export const isAdmin = t.middleware(async ({ ctx, next }) => {
  const { req } = ctx
  const token = req.cookies['user-Token']

  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: "Missing user Token" })
  }

  const verifiedToken = await verifyAuth(token)

  if (!verifiedToken) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid user Token' })
  }

  return next()
})

export const router = t.router;

export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(isAdmin)
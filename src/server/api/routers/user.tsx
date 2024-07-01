import { publicProcedure, router, adminProcedure } from "../trpc";
import { verifyAuthAdmin, verifyAuthClient } from "@/lib/auth";
import { s3 } from "@/lib/s3";
import { TRPCError } from "@trpc/server";
import { NextApiRequest } from "next";


export const User = router({

    userClient: publicProcedure.query(async ({ ctx, }) => {
        const { db, req } = ctx


        const tokenValueClient = tokenClient(req as NextApiRequest);



        try {
            const verifyTokenClient = tokenValueClient && (await verifyAuthClient(tokenValueClient));
            if (!verifyTokenClient) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Token inválido ou expirado"
                });
            }

            const userQuery = await db.user.findMany();

            const withUrls = await Promise.all(
                userQuery.map(async (menuItem) => {
                    if (menuItem.email === verifyTokenClient.email) {
                        return {
                            ...menuItem,
                            url: await s3.getSignedUrlPromise('getObject', {
                                Bucket: process.env.BUCKET_NAME_S3,
                                Key: menuItem.imageKey,
                            }),

                        }
                    }
                })
            )

            return withUrls


        } catch (error) {
            console.error("Erro ao verificar o token:");
        }



    }),

    userAdmin: adminProcedure.query(async ({ ctx }) => {
        const { db, req } = ctx




        const tokenValueAdmin = tokenAdmin(req as NextApiRequest);



        try {
            const verifyTokenAdmin = tokenValueAdmin && (await verifyAuthAdmin(tokenValueAdmin));
            if (!verifyTokenAdmin) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Token inválido ou expirado"
                });
            }




            const userQuery = await db.user.findMany();
            const adminExist = await db.user.findUnique({
                where: {
                    email: verifyTokenAdmin.email
                }
            })

            if (adminExist) {
                const withUrls = await Promise.all(
                    userQuery.map(async (menuItem) => {
                        if (menuItem.email === verifyTokenAdmin.email) {
                            return {
                                ...menuItem,
                                url: await s3.getSignedUrlPromise('getObject', {
                                    Bucket: process.env.BUCKET_NAME_S3,
                                    Key: menuItem.imageKey,
                                }),

                            }
                        }
                    })
                )

                return withUrls
            }


        } catch (error) {
            console.error("Erro ao verificar o token:");
        }



    })
})

export function tokenClient(req: NextApiRequest): string | undefined {
    return req.cookies['user-Token-client'];
}


function tokenAdmin(req: NextApiRequest): string | undefined {
    return req.cookies['user-Token-admin'];
}
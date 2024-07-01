import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import { s3 } from "@/lib/s3";
import { MAX_FILE_SIZE } from "@/constants/config";
import { TRPCError } from "@trpc/server";

export const pressignedUrl = router({

    createPresignedUrl: publicProcedure.input(z.object({
        fileType: z.string(),
        oldKey: z.string()
    })).mutation(async ({ input }) => {
        const id = nanoid()
        const ex = input.fileType.split('/')[1]
        const key = input.oldKey !== 'null' ? input.oldKey : `${id}.${ex}`


        const { url, fields } = (await new Promise((resolve, reject) => {
            s3.createPresignedPost(
                {
                    Bucket: "system-booking-images",
                    Fields: { key },
                    Expires: 60,
                    Conditions: [
                        ['content-length-range', 0, MAX_FILE_SIZE],
                        ['starts-with', '$Content-Type', 'image/'],
                    ],
                },
                (err, signed) => {
                    if (err) return reject(err)
                    resolve(signed)
                }
            )
        })) as any as { url: string; fields: any }

        return { url, fields, key, }
    }),

    createPresignedUrlEmployees: publicProcedure.input(z.object({
        fileType: z.string(),
    })).mutation(async ({ input }) => {
        const id = nanoid()
        const ex = input.fileType.split('/')[1]
        const key = `${id}.${ex}`


        const { url, fields } = (await new Promise((resolve, reject) => {
            s3.createPresignedPost(
                {
                    Bucket: "system-booking-images",
                    Fields: { key },
                    Expires: 60,
                    Conditions: [
                        ['content-length-range', 0, MAX_FILE_SIZE],
                        ['starts-with', '$Content-Type', 'image/'],
                    ],
                },
                (err, signed) => {
                    if (err) return reject(err)
                    resolve(signed)
                }
            )
        })) as any as { url: string; fields: any }

        return { url, fields, key, }
    }),

    deleteImage: publicProcedure.input(z.object({
        imageKey: z.string(),
        id: z.string()
    })).mutation(async ({ ctx, input }) => {
        const { id, imageKey } = input
        const { db } = ctx
        const imageKeyExist = await db.user.findFirst({ where: { id }, select: { imageKey: true } })
        if (!imageKeyExist?.imageKey) throw new TRPCError({
            code: "NOT_FOUND",
            message: "Imagem não existe no banco de dados."
        })


        if (imageKeyExist?.imageKey !== 'null') {
            await s3.deleteObject({
                Bucket: "system-booking-images",
                Key: imageKey,
            }).promise()

            await db.user.update({
                where: { id },
                data: { imageKey: 'null' }

            })

            return { success: true, message: 'Imagem apagada.' }
        } else {

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "O caminho da imagem não existe."
            })

        }





    }),


    deleteEmployees: publicProcedure.input(z.object({
        imageKey: z.string(),
        id: z.number()
    })).mutation(async ({ ctx, input }) => {
        const { id, imageKey } = input
        const { db } = ctx

        await s3.deleteObject({
            Bucket: 'system-booking-images', Key: imageKey,
        }).promise()

        await db.employees.delete({ where: { id } })

        return { success: true, message: 'Funcionário deletado com succeso' }


    }),

})
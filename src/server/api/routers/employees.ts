import { s3 } from '@/lib/s3'
import { publicProcedure, router } from '../trpc'

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const employeesImage = router({
    /**
     * Method for getting all menu items
     * @returns an array of all menu items with their image url
     */

    getEmployees: publicProcedure.query(async ({ ctx }) => {
        const menuItems = await ctx.db.employees.findMany({
            include: {
                category: true,
                services: true,
            }
        })

        // Each menu items only contains its AWS key. Extend all items with their actual img url
        const withUrls = await Promise.all(
            menuItems.map(async (menuItem) => {
                return {
                    ...menuItem,
                    url: await s3.getSignedUrlPromise('getObject', {
                        Bucket: process.env.BUCKET_NAME_S3,
                        Key: menuItem.imageKey,
                    }),
                }
            })
        )

        return withUrls
    }),

})
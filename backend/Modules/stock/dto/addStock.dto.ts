import z from "zod";

export const addStockDTO = z.object({
    body: z.object({
        warehouse_id: z.number(),
        batch_id: z.number(),
        quantity: z.number(),
    })
})

export type addStockDTO = z.infer<typeof addStockDTO>['body']

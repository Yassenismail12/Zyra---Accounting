import z from "zod"

export const addProductSchema = z.object({
    body: z.object({
        name: z.string(),
        sale_price: z.number(),
        purchase_price: z.number(),
        current_stock: z.number()
    })
})

export type addProductDTO = z.infer<typeof addProductSchema>['body']
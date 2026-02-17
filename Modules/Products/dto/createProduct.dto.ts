import z from "zod"

export const createProductSchema= z.object({
    body:z.object({
        name:z.string(),
        sale_price:z.number(),
        purchase_price :z.number(),
        current_stock :z.number()
    })
})

export type createProductDTO=z.infer<typeof createProductSchema>['body']
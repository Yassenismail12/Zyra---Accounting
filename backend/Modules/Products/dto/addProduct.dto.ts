import z from "zod"

export const addProductSchema = z.object({
  body: z.object({
    name: z.string(),
    sale_price: z.number().positive(),
    purchase_price: z.number().positive(),
  }),
})

export type addProductDTO = z.infer<typeof addProductSchema>["body"]

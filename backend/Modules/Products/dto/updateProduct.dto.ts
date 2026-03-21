import z from "zod"

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    sale_price: z.number().positive().optional(),
    purchase_price: z.number().positive().optional(),
  }),
})

export type updateProductDTO = z.infer<typeof updateProductSchema>["body"]

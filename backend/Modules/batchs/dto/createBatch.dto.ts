import z from "zod"

export const createBatchSchema = z.object({
  body: z.object({
    product_id: z.number(),
    batch_number: z.string(),
    expiry_date:z.date()
  }),
})

export type createBatchDTO = z.infer<typeof createBatchSchema>["body"]

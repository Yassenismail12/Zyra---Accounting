import z from "zod"

export const addWarehouseSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
})

export type addWarehouseDTO = z.infer<typeof addWarehouseSchema>["body"]

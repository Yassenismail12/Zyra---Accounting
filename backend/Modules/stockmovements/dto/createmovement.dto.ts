import { z } from "zod";

export const createMovementDTO = z.object({
    body: z.object({
        stock_id: z.number(),
        qty: z.number().positive("Quantity must be positive"),
        movement_type: z.enum(["SALE", "PURCHASE", "TRANSFER", "ADJUSTMENT"])
    })
})

export type createMovementDTO = z.infer<typeof createMovementDTO>['body'];
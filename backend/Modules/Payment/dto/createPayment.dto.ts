import z from "zod";

export const createPaymentSchema = z.object({
    body: z.object({

        amount:z.number().positive()
    })
})

export type createPaymentDTO = z.infer< typeof createPaymentSchema >['body']
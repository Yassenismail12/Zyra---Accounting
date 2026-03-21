import z from "zod"
import { Typeinvoice, invoice_status } from "../../../Shared/enums/invoice.enum"

export const addInvoiceSchema = z.object({
  body: z.object({
    type: z.enum([Typeinvoice.SALE, Typeinvoice.PURCHASE, Typeinvoice.RETURN]),
    invoice_date: z.coerce.date(),
    status: z.enum([invoice_status.PAID, invoice_status.UNPAID]).nullable(),
    notes: z.string().nullable(),
    party_id: z.number().nullable(),
    created_by: z.number(),
    items: z
      .array(
        z.object({
          stock_id: z.number(),
          qty: z.number().positive(),
        }),
      )
      .min(1),
  }),
})

export type addInvoiceDTO = z.infer<typeof addInvoiceSchema>["body"]

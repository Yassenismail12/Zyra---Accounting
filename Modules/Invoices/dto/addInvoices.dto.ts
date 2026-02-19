import z from "zod";
import { Typeinvoice, invoice_status } from "../../../Shared/enums/invoice.enum";

export const addInvoiceSchema = z.object({
    body: z.object({
        type: z.enum([Typeinvoice.SALE, Typeinvoice.PURCHASE, Typeinvoice.INTERNAL]),
        invoice_date: z.coerce.date(),
        status: z.enum([invoice_status.PAID, invoice_status.UNPAID]),
        notes: z.string(),
        party_id: z.number(),
        created_by: z.number(),
        subtotal: z.number(),
        tax: z.number(),
        total: z.number()
    })
})

export type addInvoiceDTO = z.infer<typeof addInvoiceSchema>['body']
import z from "zod"
import { TypeParty } from "../../../Shared/enums/TypeParty.enum"

export const updatePartySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    type: z.enum([TypeParty.CUSTOMER, TypeParty.SUPPLIER]).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
})

export type updatePartyDTO = z.infer<typeof updatePartySchema>["body"]

import z from 'zod'
import { TypeParty } from '../../../Shared/enums/TypeParty.enum'

export const addPartySchema = z.object({
    body: z.object({
        name: z.string(),
        type: z.enum([TypeParty.CUSTOMER, TypeParty.SUPPLIER]),
        phone: z.string(),
        address: z.string()
    })
})

export type addPartyDTO = z.infer<typeof addPartySchema>['body']
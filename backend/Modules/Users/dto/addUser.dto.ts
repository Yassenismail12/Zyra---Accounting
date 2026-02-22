import z from 'zod'
import { UserRoles } from '../../../Shared/enums/userRoles.enum'
export const addUserSchema= z.object({
    body:z.object({
        name:z.string(),
        email:z.email(),
        password:z.string(),
        role:z.enum([UserRoles.ADMIN ,UserRoles.USER])
    })
})

export type addUserDTO=z.infer<typeof addUserSchema>['body']
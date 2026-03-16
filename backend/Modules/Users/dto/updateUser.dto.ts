import z from "zod"
import { UserRoles } from "../../../Shared/enums/userRoles.enum"
export const UpdateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    role: z.enum([UserRoles.ADMIN, UserRoles.USER]).optional(),
  }),
})

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>["body"]

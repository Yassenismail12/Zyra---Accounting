import z from "zod"

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
})

export type loginDTO = z.infer<typeof loginSchema>["body"]

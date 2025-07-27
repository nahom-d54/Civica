import { z } from "zod"

export const signInSchema = z.object({
  faydaId: z
    .string()
    .min(1, "errors.required")
    .regex(/^FYD\d{9}$/, "errors.invalidFaydaId"),
  password: z.string().optional(),
})

export type SignInFormData = z.infer<typeof signInSchema>

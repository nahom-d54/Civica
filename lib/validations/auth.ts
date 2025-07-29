import { z } from "zod";

export const signInSchema = z.object({
  email: z.email().min(1, "errors.required"),
  password: z.string().optional(),
});

export type SignInFormData = z.infer<typeof signInSchema>;

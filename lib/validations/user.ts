import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  email: z.email("Invalid email address"),
  faydaId: z.string().min(1, "Fayda ID is required"),
});

import { z } from "zod";

export const feedbackSchema = z.object({
  title: z
    .string()
    .min(1, "errors.required")
    .min(5, "errors.minLength")
    .max(255, "errors.maxLength"),
  message: z
    .string()
    .min(1, "errors.required")
    .min(10, "errors.minLength")
    .max(2000, "errors.maxLength"),
  category: z.enum(["complaint", "suggestion", "report", "inquiry"] as const),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  toProposal: z.uuid(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

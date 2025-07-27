import { z } from "zod";

export const proposalSchema = z.object({
  title: z
    .string()
    .min(1, "errors.required")
    .min(10, "errors.minLength")
    .max(255, "errors.maxLength"),
  description: z
    .string()
    .min(1, "errors.required")
    .min(50, "errors.minLength")
    .max(2000, "errors.maxLength"),
  category: z.enum([
    "infrastructure",
    "budget",
    "policy",
    "development",
    "other",
  ]),
  regionScope: z.enum(["kebele", "woreda", "regional", "national"]),
  targetRegion: z
    .string()
    .min(1, "errors.required")
    .min(2, "errors.minLength")
    .max(100, "errors.maxLength"),
  duration: z.string().min(1, "errors.required"),
});

export type ProposalFormData = z.infer<typeof proposalSchema>;

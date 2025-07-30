import { z } from "zod";
import { proposalCategory, proposalScopes } from "../constants";

export const proposalSchema = z.object({
  title: z
    .string()
    .min(1, "errors.required")
    .min(10, "errors.minLength")
    .max(255, "errors.maxLength"),
  description: z
    .string()
    .min(1, "errors.required")
    .min(10, "errors.minLength")
    .max(255, "errors.maxLength"),
  category: z.enum(proposalCategory),
  scope: z.enum(proposalScopes),
  target: z.string().min(1, "Target is required"),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: z.string().min(1, "End date is required"),
});

export type proposalSchemaType = z.infer<typeof proposalSchema>;

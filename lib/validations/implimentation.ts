import z from "zod";
import { implementationChoices } from "../constants";

export const implementationSchema = z.object({
  proposalId: z.uuid(),
  status: z.enum(implementationChoices),
  progressPercentage: z.number().min(0).max(100),
  budgetAllocated: z.number(),
  budgetSpent: z.number(),
  startDate: z.date(),
  expectedCompletion: z.date(),
  actualCompletion: z.date().optional(),
  notes: z.string().optional(),
});

export type implementationSchemaType = z.infer<typeof implementationSchema>;

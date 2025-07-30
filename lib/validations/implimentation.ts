import z from "zod";
import { implementationChoices } from "../constants";

const toDate = (arg: unknown) =>
  typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg;
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
export const implementationSchemaBackend = z.object({
  proposalId: z.uuid(),
  status: z.enum(implementationChoices),
  progressPercentage: z.number().min(0).max(100),
  budgetAllocated: z.number(),
  budgetSpent: z.number(),
  startDate: z.preprocess(toDate, z.date()),
  expectedCompletion: z.preprocess(toDate, z.date()),
  actualCompletion: z.preprocess(toDate, z.date()).optional(),
  notes: z.string().optional(),
});

export type implementationSchemaTypeBackend = z.infer<
  typeof implementationSchema
>;

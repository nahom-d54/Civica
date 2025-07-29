import { z } from "zod";
import { proposalScopes } from "../constants";

export const adminSchema = z.object({
  assignedRegion: z
    .string()
    .min(1, "Region is required")
    .max(100, "Region name too long"),
  assignedZoneOrSubcity: z
    .string()
    .min(1, "Zone or City is required")
    .max(100, "Zone or Subcity name too long"),
  assignedWoreda: z
    .string()
    .min(1, "Woreda is required")
    .max(100, "Woreda name too long"),
  jobDescription: z.string(),
  permissions: z
    .array(z.enum(proposalScopes))
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Each permission must be unique",
    }),
  contactInfo: z.string().optional(),
});

export type adminSchemaType = z.infer<typeof adminSchema>;

import { z } from "zod";
import { priority } from "@/lib/constants";

export const complaintSchema = z
  .object({
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
    category: z.enum(["complaint", "suggestion"] as const),
    priority: z.enum(priority),
    toWhom: z.uuid(),
    region: z.string().max(100, "errors.maxLength").optional(),
    zoneOrSubcity: z.string().max(100, "errors.maxLength").optional(),
    woreda: z.string().max(100, "errors.maxLength").optional(),
  })
  .refine(
    (data) => {
      // Ensure at least one of region, zoneOrSubcity, or woreda is provided
      // This is optional but can be useful for filtering or categorization
      return data.region || data.zoneOrSubcity || data.woreda;
    },
    {
      message: "errors.locationRequired",
    }
  );

export type ComplaintFormData = z.infer<typeof complaintSchema>;

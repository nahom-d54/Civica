import { z } from "zod";
import { locales } from "../constants";

export const installationSchema = z
  .object({
    siteName: z
      .string()
      .min(1, "Site name is required")
      .max(100, "Site name too long"),
    siteDescription: z
      .string()
      .min(1, "Site description is required")
      .max(500, "Description too long"),
    defaultLanguage: z.enum(locales),
    name: z
      .string()
      .min(1, "Administrator name is required")
      .max(255, "Name too long"),
    email: z.email("Invalid email address"),
    faydaId: z.string().min(1, "Fayda ID is required"),
    contactInfo: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(255, "Password too long"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type installationSchemaType = z.infer<typeof installationSchema>;

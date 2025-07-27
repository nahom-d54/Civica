import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    // Fayda ID integration would go here
    // For now, we'll use email/password
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  plugins: [admin()],
  user: {
    additionalFields: {
      fayda_id: {
        type: "string",
        label: "Fayda ID",
        description: "Unique identifier for the user in the Fayda system",
      },
      role: {
        type: "string",
        label: "Role",
        description: "Role of the user in the system (e.g., user, admin)",
        default: "user",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

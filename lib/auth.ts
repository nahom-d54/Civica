import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { admin, customSession } from "better-auth/plugins";
import { headers } from "next/headers";

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
  plugins: [
    admin({ adminRoles: ["admin", "superadmin"] }),
    customSession(async ({ user, session }) => {
      const data = {
        user: {
          ...user,
          // @ts-expect-error: user object contains 'role' at runtime
          role: user.role || "user",
        },
        session: {
          ...session,
        },
      };
      return data;
    }),
  ],
  user: {
    additionalFields: {
      fayda_id: {
        type: "string",
        label: "Fayda ID",
        description: "Unique identifier for the user in the Fayda system",
      },
    },
  },
});

export const getServerSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export type Session = typeof auth.$Infer.Session;

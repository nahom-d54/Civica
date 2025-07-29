import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, superadmin, user } from "./permissions";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    adminClient({
      ac: ac,
      roles: {
        user,
        admin,
        superadmin,
      },
    }),
    genericOAuthClient(),
  ],
});

export const { signIn, signUp, useSession } = authClient;

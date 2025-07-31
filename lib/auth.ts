import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import {
  admin as adminPlugin,
  createAuthMiddleware,
  customSession,
  genericOAuth,
} from "better-auth/plugins";
import { headers } from "next/headers";
import { ac, admin, superadmin, user } from "./permissions";
import {
  claims,
  generateSignedJwt,
  getUserInfoCustom,
  updateFaydaUserProfile,
} from "./authUtils";
import { eq } from "drizzle-orm";
import { user as userSchema } from "@/lib/db/schema";

export const auth = betterAuth({
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.includes("oauth2/callback/verifayda")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          const userFayda = await auth.api.accountInfo({
            body: {
              accountId: newSession.user.fayda_id as string,
            },
            headers: await headers(),
          });
          if (userFayda?.data) {
            await updateFaydaUserProfile({
              sub: newSession.user.id as string,
              name: userFayda.data.name as string,
              email: userFayda.data.email as string,
              birthdate: userFayda.data.birthdate as string,
              address: {
                zone: userFayda.data.address.zone as string,
                woreda: userFayda.data.address.woreda as string,
                region: userFayda.data.address.region as string,
              },
              phone_number: userFayda.data.phone_number as string,
              nationality: userFayda.data.nationality as string,
            });
          }
        }
      }
    }),
  },
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
    adminPlugin({
      ac,
      roles: {
        user,
        admin,
        superadmin,
      },
    }),
    genericOAuth({
      config: [
        {
          providerId: "verifayda",
          overrideUserInfo: true,
          discoveryUrl:
            "https://esignet.ida.fayda.et/.well-known/openid-configuration",
          clientId: process.env.ESIGNET_CLIENT_ID as string,
          userInfoUrl: process.env.ESIGNET_USERINFO_ENDPOINT as string,
          scopes: ["openid", "profile", "email"],
          redirectURI: `${process.env.BETTER_AUTH_URL}/callback`,
          authorizationUrlParams: {
            claims: JSON.stringify(claims),
          },
          injectClientAssertion: async ({ params }) => {
            const clientAssertion = await generateSignedJwt();
            return {
              ...params,
              client_assertion: clientAssertion,
              client_assertion_type:
                "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            };
          },
          getUserInfo: async (tokens) => {
            const payload = await getUserInfoCustom(
              tokens,
              process.env.ESIGNET_USERINFO_ENDPOINT as string
            );
            // Map payload to expected shape
            return {
              id: payload.sub as string,
              email: payload.email as string,
              name: payload.name as string,
              emailVerified: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              address: payload.address || null,
              birthdate: payload.birthdate || null,
              fayda_id: payload.sub as string,
              phone_number: payload.phone_number || null,
              nationality: payload.nationality || null,
              // ... map other fields as needed
            };
          },
        },
      ],
    }),
    customSession(async ({ user, session }) => {
      const userData = await db.query.user.findFirst({
        where: eq(userSchema.id, user.id),
      });
      const data = {
        user: {
          ...user,
          // @ts-expect-error: user object contains 'role' at runtime
          role: user.role || "user",
          fayda_id: userData?.fayda_id || null,
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

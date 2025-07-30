import { decodeJwt, importJWK, SignJWT } from "jose";
import { fayda } from "./db/schema";
import { db } from "./db";

export async function generateSignedJwt() {
  const {
    ESIGNET_CLIENT_ID,
    ESIGNET_TOKEN_ENDPOINT,
    ESIGNET_PRIVATE_KEY_BASE64,
  } = process.env;

  const header = { alg: "RS256", typ: "JWT" };

  const jwkJson = Buffer.from(ESIGNET_PRIVATE_KEY_BASE64!, "base64").toString();
  const jwk = JSON.parse(jwkJson);
  const privateKey = await importJWK(jwk, "RS256");

  const clientAssertion = await new SignJWT({
    iss: ESIGNET_CLIENT_ID,
    sub: ESIGNET_CLIENT_ID,
    aud: ESIGNET_TOKEN_ENDPOINT,
  })
    .setProtectedHeader(header)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(privateKey);

  return clientAssertion;
}

export async function getUserInfoCustom(tokens: any, userinfoEndpoint: string) {
  const token = tokens.accessToken;
  const response = await fetch(userinfoEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }
  const textResponse = await response.text();
  const decoded = decodeJwt(textResponse);
  if (!decoded) {
    throw new Error("Failed to decode user info response");
  }

  return decoded;
}
export async function updateFaydaUserProfile(params: {
  sub: string;
  name: string;
  email: string;
  birthdate: string;
  address: {
    zone: string;
    woreda: string;
    region: string;
  };
  phone_number: string;
  nationality: string;
}) {
  await db.insert(fayda).values({
    userId: params.sub as string,
    full_name: params.name || "",
    date_of_birth: params.birthdate
      ? new Date(params.birthdate).toISOString().split("T")[0] ?? null
      : null,
    region: params.address?.region || "",
    zoneOrSubcity: params.address?.zone || "",
    woreda: params.address?.woreda || "",
    nationality: params.nationality || "",
    phone_number: params.phone_number || "",
  });
}
export const claims = {
  userinfo: {
    name: { essential: true },
    email: { essential: true },
    birthdate: { essential: true },
    address: { essential: true },
    phone_number: { essential: true },
    nationality: { essential: true },
    individual_id: { essential: true },
  },
  id_token: {},
};

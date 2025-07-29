import { importJWK, SignJWT } from "jose";

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

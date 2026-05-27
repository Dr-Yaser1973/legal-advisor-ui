 // lib/jwt.ts
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET is not set");

const secretKey = new TextEncoder().encode(secret);
const issuer = "legal-advisor-app";

export async function signUserToken(payload: {
  id: number;
  role: string;
  isApproved: boolean;
}) {
  return await new SignJWT({
    role: payload.role,
    isApproved: payload.isApproved,
    type: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(payload.id))
    .setIssuer(issuer)
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function signRefreshToken(userId: number) {
  return await new SignJWT({ type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuer(issuer)
    .setExpirationTime("30d")
    .sign(secretKey);
}

export async function verifyUserToken(
  token: string
): Promise<JWTPayload & { role: string; isApproved: boolean }> {
  const { payload } = await jwtVerify(token, secretKey, { issuer });
  return payload as any;
}
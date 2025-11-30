// lib/jwt.ts
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

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
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(payload.id))
    .setIssuer(issuer)
    .setExpirationTime("1h")
    .sign(secretKey);
}

export async function verifyUserToken(token: string): Promise<
  JWTPayload & {
    role: string;
    isApproved: boolean;
  }
> {
  const { payload } = await jwtVerify(token, secretKey, { issuer });
  return payload as any;
}


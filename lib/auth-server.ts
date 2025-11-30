// lib/auth-server.ts
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { verifyUserToken } from "./jwt";

export type AuthUser = {
  id: number;
  role: string;
  isApproved: boolean;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  // 1) جلسة الويب (NextAuth)
  const session = await getServerSession(authOptions as any);
  if (session?.user) {
    const u: any = session.user;
    return {
      id: Number(u.id),
      role: u.role,
      isApproved: u.isApproved,
    };
  }

  // 2) توكن الموبايل في Authorization: Bearer
  const h = headers();
  const auth =
    h.get("authorization") || h.get("Authorization") || "";

  if (auth.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length).trim();
    if (!token) return null;

    try {
      const payload = await verifyUserToken(token);
      return {
        id: Number(payload.sub),
        role: payload.role,
        isApproved: payload.isApproved,
      };
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  }

  return null;
}


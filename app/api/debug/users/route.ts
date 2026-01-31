 // app/api/debug/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blockIfProduction, requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

export async function GET() {
  const env = blockIfProduction();
  if (!env.ok) return env.res;

  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, status: true },
    orderBy: { id: "desc" },
    take: 200,
  });

  return NextResponse.json({ ok: true, count: users.length, users });
}

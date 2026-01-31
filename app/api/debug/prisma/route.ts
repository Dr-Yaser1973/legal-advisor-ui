 // app/api/debug/prisma/route.ts
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

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, name: err?.name, message: err?.message },
      { status: 500 },
    );
  }
}

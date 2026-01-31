
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) return auth.res;

  const where: any = {};

  // ADMIN يرى الجميع، غير ذلك يرى سجلاته فقط
  if (auth.user.role !== UserRole.ADMIN) {
    where.createdById = auth.user.id;
  }

  const items = await prisma.generatedContract.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true },
  });

  return NextResponse.json({ items });
}

// app/api/translation/offices/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const offices = await prisma.user.findMany({
      where: {
        role: "TRANSLATION_OFFICE",
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ ok: true, offices });
  } catch (err) {
    console.error("translation/offices GET error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء جلب مكاتب الترجمة." },
      { status: 500 }
    );
  }
}


 // app/api/docs/list/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
  try {
    // اجلب الجلسة (قد يكون المستخدم غير مسجّل)
    const session = await getServerSession(authOptions);

    let isAdmin = false;
    if (session?.user?.email) {
      const me = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      });
      isAdmin = me?.role === "ADMIN";
    }

    // قائمة المستندات (متاحة للعرض للجميع)
    const docs = await prisma.legalDocument.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        filename: true,
        size: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, isAdmin, docs });
  } catch (err: any) {
    console.error("docs/list error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "failed to list docs" },
      { status: 500 }
    );
  }
}

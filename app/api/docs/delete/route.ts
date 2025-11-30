 // app/api/docs/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
    }

    // تأكد من أن المستخدم أدمن
    const me = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });
    if (me?.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "صلاحية الأدمن مطلوبة" }, { status: 403 });
    }

    // استلم الـ id
    const { documentId } = await req.json().catch(() => ({}));
    const id = Number(documentId);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "documentId غير صالح" }, { status: 400 });
    }

    // احذف عبر علاقة كاسكيد (لدينا onDelete: Cascade في الـ schema)
    // ومع ذلك سنحذف الـ chunks بشكل صريح كحماية
    await prisma.$transaction([
      prisma.legalDocChunk.deleteMany({ where: { documentId: id } }),
      prisma.legalDocument.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("docs/delete error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "failed to delete doc" },
      { status: 500 }
    );
  }
}

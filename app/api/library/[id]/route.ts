 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: { id: string };
};

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const id = Number(context.params.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { error: "معرّف غير صالح" },
        { status: 400 },
      );
    }

    const doc = await prisma.lawDoc.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json(
        { error: "المصدر غير موجود" },
        { status: 404 },
      );
    }

    await prisma.$transaction([
      prisma.lawArticle.deleteMany({ where: { lawDocId: id } }),
      prisma.lawDoc.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/library/[id] error:", e);
    return NextResponse.json(
      { error: e?.message ?? "فشل حذف المصدر" },
      { status: 500 },
    );
  }
}

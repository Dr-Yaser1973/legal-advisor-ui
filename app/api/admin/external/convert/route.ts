 // app/api/admin/external/convert/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole, LawCategory, DocStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json();

    const externalItemId = Number(body.externalItemId);
    if (!externalItemId || Number.isNaN(externalItemId)) {
      return NextResponse.json(
        { ok: false, error: "externalItemId مطلوب" },
        { status: 400 }
      );
    }

    // ✅ قراءة category و status مع تحقق آمن
    const category: LawCategory =
      body.category && Object.values(LawCategory).includes(body.category)
        ? body.category
        : LawCategory.ACADEMIC_STUDY;

    const status: DocStatus =
      body.status && Object.values(DocStatus).includes(body.status)
        ? body.status
        : DocStatus.DRAFT;

    const item = await prisma.externalSourceItem.findUnique({
      where: { id: externalItemId },
    });

    if (!item) {
      return NextResponse.json(
        { ok: false, error: "العنصر غير موجود" },
        { status: 404 }
      );
    }

    // ✅ إن كان محوّل مسبقًا
    if (item.lawUnitId) {
      return NextResponse.json({
        ok: true,
        lawUnitId: item.lawUnitId,
        already: true,
      });
    }

    // ✅ Transaction آمنة
    const lawUnit = await prisma.$transaction(async (tx) => {
      const created = await tx.lawUnit.create({
        data: {
          title: item.title.slice(0, 300),
          content: item.summary || "— مادة مستوردة من مصدر خارجي —",
          category,
          status,
        },
      });

      await tx.externalSourceItem.update({
        where: { id: item.id },
        data: { lawUnitId: created.id },
      });

      return created;
    });

    return NextResponse.json({
      ok: true,
      lawUnitId: lawUnit.id,
    });
  } catch (e) {
    console.error("external convert error:", e);
    return NextResponse.json(
      { ok: false, error: "خطأ في الخادم" },
      { status: 500 }
    );
  }
}

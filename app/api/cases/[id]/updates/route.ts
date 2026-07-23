// app/api/cases/[id]/updates/route.ts
// المكتب ينشر تحديثاً موجّهاً للعميل (الموكّل) — يظهر في بوابة «قضاياي».
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCaseAccess } from "@/lib/auth/guards";
import { notifyUser } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caseId = Number(id);
    if (!Number.isFinite(caseId)) {
      return NextResponse.json({ error: "معرّف القضية غير صالح." }, { status: 400 });
    }

    const auth = await requireCaseAccess(caseId);
    if (!auth.ok) return auth.res;

    const body = (await req.json().catch(() => ({}))) as { title?: string; content?: string };
    const title = (body.title || "").trim();
    const content = (body.content || "").trim();

    if (!content) {
      return NextResponse.json({ error: "محتوى التحديث مطلوب." }, { status: 400 });
    }

    const update = await prisma.caseUpdate.create({
      data: {
        caseId,
        title: title || null,
        content,
        authorId: auth.user?.id ? Number(auth.user.id) : null,
      },
    });

    // إشعار العميل المرتبط (إن وُجد) — best-effort
    const c = await prisma.case.findUnique({
      where: { id: caseId },
      select: { clientId: true, title: true },
    });
    if (c?.clientId) {
      await notifyUser({
        userId: c.clientId,
        title: `📌 تحديث في قضيتك: ${c.title || `#${caseId}`}`,
        body: title || content.slice(0, 140),
        pushData: { type: "case_update", caseId },
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, update });
  } catch (e: any) {
    console.error("case update error:", e);
    return NextResponse.json({ error: e?.message || "فشل إضافة التحديث." }, { status: 500 });
  }
}

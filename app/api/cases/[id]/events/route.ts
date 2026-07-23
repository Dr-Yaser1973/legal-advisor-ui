 // app/api/cases/[id]/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCaseAccess } from "@/lib/auth/guards";
import { CaseEventType } from "@prisma/client";

export const runtime = "nodejs";

const VALID_TYPES = Object.values(CaseEventType) as string[];

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caseId = Number(id);
    if (!Number.isFinite(caseId)) {
      return NextResponse.json({ error: "معرّف القضية غير صالح." }, { status: 400 });
    }

    const auth = await requireCaseAccess(caseId);
    if (!auth.ok) return auth.res;

    const body = (await req.json().catch(() => ({}))) as {
      title?: string;
      note?: string;
      type?: string;
      date?: string;
      location?: string;
      remindBefore?: number | string; // دقائق قبل الموعد للتذكير (0 = بلا تذكير)
    };

    const title = (body.title || "").trim();
    const note = (body.note || "").trim();
    const location = (body.location || "").trim();

    if (!title) {
      return NextResponse.json({ error: "عنوان الحدث مطلوب." }, { status: 400 });
    }

    // النوع — مع fallback آمن
    const type = VALID_TYPES.includes(String(body.type))
      ? (body.type as CaseEventType)
      : CaseEventType.OTHER;

    // التاريخ — يقبل موعداً مستقبلياً؛ افتراضياً الآن
    const date = body.date ? new Date(body.date) : new Date();
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "تاريخ الحدث غير صالح." }, { status: 400 });
    }

    // حساب موعد التذكير من الإزاحة (بالدقائق قبل التاريخ)
    const remindBefore = Number(body.remindBefore) || 0;
    const notifyAt =
      remindBefore > 0 ? new Date(date.getTime() - remindBefore * 60_000) : null;

    const createdBy = auth.user?.id ? Number(auth.user.id) : null;

    await prisma.caseEvent.create({
      data: {
        caseId,
        title,
        note: note || null,
        type,
        location: location || null,
        date,
        notifyAt,
        createdBy,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("case event error:", e);
    return NextResponse.json({ error: e?.message || "فشل إضافة حدث." }, { status: 500 });
  }
}
 // app/api/cases/[id]/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCaseAccess } from "@/lib/auth/guards";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const caseId = Number(params.id);
    if (!Number.isFinite(caseId)) {
      return NextResponse.json({ error: "معرّف القضية غير صالح." }, { status: 400 });
    }

    const auth = await requireCaseAccess(caseId);
    if (!auth.ok) return auth.res;

    const body = (await req.json().catch(() => ({}))) as { title?: string; note?: string };
    const title = (body.title || "").trim();
    const note = (body.note || "").trim();

    if (!title) {
      return NextResponse.json({ error: "title مطلوب." }, { status: 400 });
    }

    await prisma.caseEvent.create({
      data: { caseId, title, note: note || null, date: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("case event error:", e);
    return NextResponse.json({ error: e?.message || "فشل إضافة حدث." }, { status: 500 });
  }
}

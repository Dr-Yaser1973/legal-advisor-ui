// app/api/cases/[id]/notes/route.ts
// ملاحظات فريق داخلية على القضية (CaseNote) — خاصة بالكاتب أو مشتركة مع الفريق.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCaseAccess } from "@/lib/auth/guards";

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

    const userId = auth.user?.id ? Number(auth.user.id) : null;
    if (!userId) {
      return NextResponse.json({ error: "تعذّر تحديد المستخدم." }, { status: 400 });
    }

    const body = (await req.json().catch(() => ({}))) as { content?: string; isPrivate?: boolean };
    const content = (body.content || "").trim();
    if (!content) {
      return NextResponse.json({ error: "محتوى الملاحظة مطلوب." }, { status: 400 });
    }

    const note = await prisma.caseNote.create({
      data: {
        caseId,
        userId,
        content,
        isPrivate: Boolean(body.isPrivate),
      },
    });

    return NextResponse.json({ ok: true, note });
  } catch (e: any) {
    console.error("case note error:", e);
    return NextResponse.json({ error: e?.message || "فشل إضافة الملاحظة." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caseId = Number(id);
    if (!Number.isFinite(caseId)) {
      return NextResponse.json({ error: "معرّف القضية غير صالح." }, { status: 400 });
    }

    const auth = await requireCaseAccess(caseId);
    if (!auth.ok) return auth.res;

    const userId = auth.user?.id ? Number(auth.user.id) : null;
    const { searchParams } = new URL(req.url);
    const noteId = Number(searchParams.get("noteId"));
    if (!Number.isFinite(noteId)) {
      return NextResponse.json({ error: "معرّف الملاحظة مطلوب." }, { status: 400 });
    }

    const note = await prisma.caseNote.findUnique({ where: { id: noteId }, select: { userId: true, caseId: true } });
    if (!note || note.caseId !== caseId) {
      return NextResponse.json({ error: "الملاحظة غير موجودة." }, { status: 404 });
    }
    // يحذف الكاتب ملاحظته فقط (أو الأدمن)
    if (note.userId !== userId && auth.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "لا يمكنك حذف ملاحظة غيرك." }, { status: 403 });
    }

    await prisma.caseNote.delete({ where: { id: noteId } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("case note delete error:", e);
    return NextResponse.json({ error: e?.message || "فشل حذف الملاحظة." }, { status: 500 });
  }
}

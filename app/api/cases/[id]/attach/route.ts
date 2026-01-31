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

    const body = (await req.json().catch(() => ({}))) as { documentId?: number };
    const documentId = Number(body.documentId);

    if (!Number.isFinite(documentId) || documentId <= 0) {
      return NextResponse.json({ error: "documentId مطلوب." }, { status: 400 });
    }

    await prisma.caseDocument.create({ data: { caseId, documentId } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("case attach error:", e);
    return NextResponse.json({ error: e?.message || "فشل إرفاق المستند." }, { status: 500 });
  }
}

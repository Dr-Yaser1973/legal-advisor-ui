// app/api/cases/[id]/client/route.ts
// ربط/فكّ ربط حساب عميل (موكّل) بالقضية — للمكتب فقط (WRITE).
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

    const body = (await req.json().catch(() => ({}))) as { email?: string };
    const email = (body.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "بريد العميل مطلوب." }, { status: 400 });
    }

    const client = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, name: true, email: true },
    });

    if (!client) {
      return NextResponse.json(
        { error: "لا يوجد حساب بهذا البريد. اطلب من الموكّل إنشاء حساب على المنصة أولاً." },
        { status: 404 }
      );
    }

    await prisma.case.update({
      where: { id: caseId },
      data: { clientId: client.id },
    });

    const caseInfo = await prisma.case.findUnique({
      where: { id: caseId },
      select: { title: true },
    });

    await notifyUser({
      userId: client.id,
      title: "تم ربط حسابك بقضية",
      body: `يمكنك الآن متابعة تطوّرات قضيتك «${caseInfo?.title || `#${caseId}`}» من صفحة «قضاياي».`,
      pushData: { type: "case_linked", caseId },
    }).catch(() => {});

    return NextResponse.json({ ok: true, client });
  } catch (e: any) {
    console.error("case link-client error:", e);
    return NextResponse.json({ error: e?.message || "فشل ربط العميل." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caseId = Number(id);
    if (!Number.isFinite(caseId)) {
      return NextResponse.json({ error: "معرّف القضية غير صالح." }, { status: 400 });
    }

    const auth = await requireCaseAccess(caseId);
    if (!auth.ok) return auth.res;

    await prisma.case.update({
      where: { id: caseId },
      data: { clientId: null },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("case unlink-client error:", e);
    return NextResponse.json({ error: e?.message || "فشل فكّ الربط." }, { status: 500 });
  }
}

 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/options";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

function isAdmin(session: any) {
  return session?.user?.role === UserRole.ADMIN;
}

async function callWorker() {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const secret = process.env.OCR_WORKER_SECRET!;

  const res = await fetch(`${base}/api/ocr/worker`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-worker-secret": secret,
    },
    body: JSON.stringify({ limit: 1 }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`OCR Worker failed: ${res.status} ${t}`);
  }
}

async function callExplain(lawUnitId: number) {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  await fetch(`${base}/api/library/${lawUnitId}/explain`, {
    method: "POST",
  });
}

async function callFaq(lawUnitId: number) {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  await fetch(`${base}/api/library/${lawUnitId}/faq`, {
    method: "POST",
  });
}

async function callRelations(lawUnitId: number) {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  await fetch(`${base}/api/library/${lawUnitId}/relations/rebuild`, {
    method: "POST",
  });
}

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!isAdmin(session)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const lawUnitId = Number(ctx.params.id);
    if (!Number.isFinite(lawUnitId)) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    // تأكيد أن هناك مستند مرتبط
    const link = await prisma.lawUnitDocument.findFirst({
      where: { lawUnitId },
    });

    if (!link) {
      return NextResponse.json({
        ok: false,
        error: "لا يوجد مستند مرتبط بهذه المادة لتشغيل OCR",
      });
    }

    // ضع المستند في طابور OCR
    await prisma.legalDocument.update({
      where: { id: link.documentId },
      data: { ocrStatus: "PENDING" },
    });

    // شغّل السلسلة
    await callWorker();
    await callExplain(lawUnitId);
    await callFaq(lawUnitId);
    await callRelations(lawUnitId);

    return NextResponse.json({
      ok: true,
      message: "تم تشغيل OCR + الشرح + FAQ + العلاقات + الفهرسة بنجاح",
    });
  } catch (e: any) {
    console.error("REBUILD_CHAIN_ERROR", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "فشل تنفيذ السلسلة الذكية" },
      { status: 500 }
    );
  }
}



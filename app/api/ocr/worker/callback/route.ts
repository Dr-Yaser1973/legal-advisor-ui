 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function json(res: any, status = 200) {
  return NextResponse.json(res, { status });
}

export async function POST(req: NextRequest) {
  try {
    // 1. التحقق من الهوية (Security)
    const secret = req.headers.get("x-worker-secret");
    if (!secret || secret !== process.env.OCR_CALLBACK_SECRET) {
      console.error("⚠️ Unauthorized callback attempt");
      return json({ ok: false, error: "Unauthorized" }, 401);
    }

    const body = await req.json().catch(() => null);
    if (!body) return json({ ok: false, error: "Invalid JSON body" }, 400);

    const documentId = Number(body.documentId);
    if (!Number.isFinite(documentId)) return json({ ok: false, error: "Invalid documentId" }, 400);

    const ok = Boolean(body.ok);
    // تنظيف النص من أي رموز صفرية (Null bytes) قد يرسلها الـ OCR
    const text = typeof body.text === "string" ? body.text.replace(/\0/g, '').trim() : "";
    const errorMsg = typeof body.error === "string" ? body.error : null;

    // 2. تحديث حالة المستند القانوني
    await prisma.legalDocument.update({
      where: { id: documentId },
      data: {
        ocrStatus: ok ? "COMPLETED" : "FAILED",
        // يمكنك إضافة حقل لتخزين الخطأ إذا فشل الـ OCR للمراجعة لاحقاً
        // notes: ok ? null : `OCR Error: ${errorMsg}`
      },
    });

    if (!ok || !text) {
      console.error("❌ OCR WORKER REPORTED FAILURE", { documentId, error: errorMsg });
      return json({ ok: true, status: "FAILED" });
    }

    // 3. البحث عن الوحدة القانونية المرتبطة (LawUnit)
    const link = await prisma.lawUnitDocument.findFirst({
      where: { documentId },
      include: { lawUnit: true },
    });

    if (!link?.lawUnit) {
      console.warn("⚠️ OCR Success but no LawUnit link found", { documentId });
      return json({ ok: true, status: "COMPLETED_NO_LAWUNIT" });
    }

    // 4. تخزين النص المستخرج في LawUnit
    await prisma.lawUnit.update({
      where: { id: link.lawUnit.id },
      data: {
        content: text,
        // updatedAt: new Date(), // مفيد للتعقب
      },
    });

    logSuccess(documentId, link.lawUnit.id, text.length);

    return json({
      ok: true,
      status: "COMPLETED",
      lawUnitId: link.lawUnit.id,
    });

  } catch (e: any) {
    console.error("❌ CALLBACK INTERNAL ERROR", e?.message || e);
    return json({ ok: false, error: "Internal server error" }, 500);
  }
}

function logSuccess(docId: number, unitId: string | number, length: number) {
  console.log(`✅ [OCR SUCCESS] Document:${docId} -> LawUnit:${unitId} (${length} chars)`);
}
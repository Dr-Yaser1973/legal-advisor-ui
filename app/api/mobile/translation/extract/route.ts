//app/api/mobile/translation/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SOURCE_BUCKET = "library-documents";

export async function POST(req: NextRequest) {
  try {
    // ── المصادقة عبر Bearer token ──
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
    }
    await verifyUserToken(authHeader.split(" ")[1]);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Supabase غير متاح حاليًا" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string" || file.size === 0) {
      return NextResponse.json({ ok: false, error: "ملف غير صالح" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "الملف كبير جداً (الحد الأقصى 5MB)" },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalFileName = file.name || "document";
    const contentType = file.type.toLowerCase();

    let text = "";

    if (contentType === "application/pdf" || originalFileName.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const result = await pdfParse(buffer);
      text = result.text || "";
    } else if (
      contentType.includes("officedocument.wordprocessingml.document") ||
      originalFileName.endsWith(".docx")
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value || "";
    } else {
      return NextResponse.json(
        { ok: false, error: "نوع الملف غير مدعوم" },
        { status: 415 }
      );
    }

    text = text.trim();
    if (!text) {
      return NextResponse.json(
        { ok: false, error: "المستند فارغ أو عبارة عن صور فقط" },
        { status: 422 }
      );
    }

    const safeFileName = originalFileName.replace(/[^\w.-]+/g, "_");
    const filePath = `translation/source/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(SOURCE_BUCKET)
      .upload(filePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("❌ Supabase upload error:", uploadError);
      throw uploadError;
    }

    const doc = await prisma.legalDocument.create({
      data: {
        title: originalFileName,
        filename: originalFileName,
        mimetype: contentType,
        size: file.size,
        filePath,
      },
    });

    return NextResponse.json({
      ok: true,
      text,
      documentId: doc.id,
      fileName: originalFileName,
    });
  } catch (err: any) {
    console.error("🔥 mobile extract error:", err);
    return NextResponse.json(
      { ok: false, error: "خطأ داخلي في الخادم", debug: err?.message || err },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "library-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Supabase غير متاح" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // 1️⃣ تحقق من الملف
    if (!file || typeof file === "string" || file.size === 0) {
      return NextResponse.json(
        { ok: false, error: "ملف غير صالح" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "حجم الملف أكبر من المسموح" },
        { status: 413 }
      );
    }

    // 2️⃣ إعداد البيانات
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name || "document";
    const safeName = originalName.replace(/[^\w.-]+/g, "_");
    const filePath = `translation/official/${Date.now()}-${safeName}`;

    // 3️⃣ رفع الملف إلى Supabase
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw uploadError;
    }

    // 4️⃣ إنشاء LegalDocument
    const doc = await prisma.legalDocument.create({
      data: {
        title: originalName,
        filename: originalName,
        mimetype: file.type,
        size: file.size,
        filePath,
      },
    });

    // 5️⃣ الاستجابة
    return NextResponse.json({
      ok: true,
      documentId: doc.id,
    });
  } catch (err: any) {
    console.error("official upload error:", err);
    return NextResponse.json(
      { ok: false, error: "خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}


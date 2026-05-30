//app/api/mobile/translation/official/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";

const BUCKET = "library-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
    }
    await verifyUserToken(authHeader.split(" ")[1]);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Supabase غير متاح" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string" || file.size === 0) {
      return NextResponse.json({ ok: false, error: "ملف غير صالح" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, error: "حجم الملف أكبر من المسموح" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name || "document";
    const safeName = originalName.replace(/[^\w.-]+/g, "_");
    const filePath = `translation/official/${Date.now()}-${safeName}`;

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

    const doc = await prisma.legalDocument.create({
      data: {
        title: originalName,
        filename: originalName,
        mimetype: file.type,
        size: file.size,
        filePath,
      },
    });

    return NextResponse.json({ ok: true, documentId: doc.id });
  } catch (err: any) {
    console.error("mobile official upload error:", err);
    return NextResponse.json({ ok: false, error: "خطأ داخلي في الخادم" }, { status: 500 });
  }
}

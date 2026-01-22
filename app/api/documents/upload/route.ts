// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ ارفع الحد (صور الموبايل قد تكون كبيرة)
export const maxDuration = 60;

// --------- Helpers ----------
function safeName(name: string) {
  return name
    .replace(/[^\w.\-()\u0600-\u06FF ]+/g, "_")
    .replace(/\s+/g, " ")
    .trim();
}

function extFromType(mime: string) {
  if (mime === "application/pdf") return "pdf";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/heic" || mime === "image/heif") return "heic";
  return "bin";
}

function detectKind(mime: string): "PDF" | "IMAGE" {
  return mime === "application/pdf" ? "PDF" : "IMAGE";
}

function detectSource(userAgent: string | null) {
  const ua = (userAgent || "").toLowerCase();
  const isMobile =
    ua.includes("iphone") || ua.includes("android") || ua.includes("ipad");
  return isMobile ? "mobile" : "web";
}

// --------- Supabase Client ----------
function supabaseAdmin() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// --------- POST ----------
/**
 * multipart/form-data
 * fields:
 *  - file: File (required)
 *  - title: string (optional)
 *  - ocrLanguage: "ar" | "en" | "ar+en" (optional)
 */
export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const userId = session?.user?.id ? Number(session.user.id) : null;

    const userAgent = req.headers.get("user-agent");
    const source = detectSource(userAgent);

    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "الملف مطلوب (file)." },
        { status: 400 }
      );
    }

    const rawTitle = (form.get("title")?.toString() || "").trim();
    const ocrLanguage = (form.get("ocrLanguage")?.toString() || "").trim();

    const mime = file.type || "application/octet-stream";
    const size = file.size;
    const originalName = safeName(file.name || `document.${extFromType(mime)}`);

    // ✅ حدود منطقية (عدّلها حسب احتياجك)
    const MAX_MB = 20;
    if (size > MAX_MB * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: `الحد الأقصى ${MAX_MB}MB.` },
        { status: 413 }
      );
    }

    const kind = detectKind(mime);
    const ext = extFromType(mime);

    // ✅ عنوان افتراضي محترم
    const title =
      rawTitle ||
      (kind === "PDF" ? "مستند PDF" : "مستند مصوّر") + ` (${new Date().toISOString().slice(0, 10)})`;

    // ✅ مسار تخزين واضح + فريد
    const ts = Date.now();
    const rnd = Math.random().toString(16).slice(2, 10);
    const folder = kind === "PDF" ? "pdf" : "images";
    const storagePath = `legal-documents/${folder}/${ts}_${rnd}.${ext}`;

    // ✅ رفع إلى Supabase Storage
    const sb = supabaseAdmin();
    const bucket = process.env.SUPABASE_DOCS_BUCKET || "uploads";

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const up = await sb.storage.from(bucket).upload(storagePath, bytes, {
      contentType: mime,
      upsert: false,
    });

    if (up.error) {
      return NextResponse.json(
        { ok: false, error: `فشل رفع الملف: ${up.error.message}` },
        { status: 500 }
      );
    }

    const filePath = `${bucket}/${storagePath}`;

    // ✅ isScanned:
    // - الصور: تعتبر "مسح/تصوير" دائمًا (تحتاج OCR)
    // - PDF: نضع isScanned = false افتراضيًا، وسيقررها OCR لاحقًا
    const isScanned = kind === "IMAGE" ? true : false;

    // ✅ ocrStatus:
    // - الصور: PENDING مباشرة
    // - PDF: NONE افتراضيًا (إلا إذا أردت OCR تلقائيًا لكل PDF)
    const ocrStatus = kind === "IMAGE" ? "PENDING" : "NONE";

    // ✅ حفظ سجل LegalDocument
    const doc = await prisma.legalDocument.create({
      data: {
        title,
        filename: originalName,
        mimetype: mime,
        size,
        kind: kind as any,
        isScanned,
        filePath,

        // حقول OCR (إن كانت موجودة في سكيمتك)
        ocrStatus: ocrStatus as any,
        ocrLanguage: ocrLanguage || (kind === "IMAGE" ? "ar+en" : null),
        source,

        createdById: userId,
      } as any,
      select: {
        id: true,
        title: true,
        mimetype: true,
        size: true,
        kind: true,
        isScanned: true,
        ocrStatus: true,
        filePath: true,
        createdAt: true,
      } as any,
    });

    return NextResponse.json({
      ok: true,
      document: doc,
    });
  } catch (e: any) {
    console.error("UPLOAD_DOC_ERROR", e);
    return NextResponse.json(
      { ok: false, error: "خطأ غير متوقع أثناء رفع المستند." },
      { status: 500 }
    );
  }
}


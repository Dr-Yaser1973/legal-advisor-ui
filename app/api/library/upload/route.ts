 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LawCategory, OCRStatus } from "@prisma/client";
import crypto from "crypto";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";

// ===============================
// Supabase (Service Role)
// ===============================
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ===============================
// Helpers
// ===============================
function pickFolder(category: LawCategory) {
  if (category === "LAW") return "laws";
  if (category === "FIQH") return "fiqh";
  if (category === "ACADEMIC_STUDY") return "studies";
  return "misc";
}

function safeCategory(raw: string): LawCategory {
  const v = (raw || "LAW").trim().toUpperCase();
  if (v === "LAW" || v === "FIQH" || v === "ACADEMIC_STUDY") {
    return v as LawCategory;
  }
  return "LAW";
}

async function extractPdfText(buffer: Buffer) {
  try {
    const data = await pdfParse(buffer);
    return (data.text || "").trim();
  } catch (err) {
    console.error("PDF PARSE ERROR:", err);
    return "";
  }
}

// ===============================
// POST /api/library/upload
// ===============================
export async function POST(req: Request) {
  try {
    // ===============================
    // Auth (ADMIN فقط)
    // ===============================
    const session: any = await getServerSession(authOptions as any);
    const role = session?.user?.role?.toUpperCase?.() || "CLIENT";

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مخول. يتطلب ADMIN." },
        { status: 403 }
      );
    }

    const form = await req.formData();

    // ===============================
    // Inputs
    // ===============================
    const file = form.get("file") as File | null;
    const titleRaw = (form.get("title") as string | null) || "";
    const rawCategory = (form.get("category") as string | null) || "LAW";

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "الملف مفقود" },
        { status: 400 }
      );
    }

    const mime = file.type;
    const isImage = ["image/jpeg", "image/png", "image/tiff"].includes(mime);
    const isPdf = mime === "application/pdf";

    if (!isPdf && !isImage) {
      return NextResponse.json(
        { ok: false, error: "صيغة غير مدعومة" },
        { status: 400 }
      );
    }

    const title = (titleRaw || file.name.replace(/\.pdf$/i, "")).trim();
    if (!title) {
      return NextResponse.json(
        { ok: false, error: "العنوان مطلوب" },
        { status: 400 }
      );
    }

    const category = safeCategory(rawCategory);

    // ===============================
    // File → Buffer
    // ===============================
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const id = crypto.randomBytes(10).toString("hex");
    const folder = pickFolder(category);
    const filename = `${id}.pdf`;

    // هذا هو المسار الذي سيُحفظ في DB
    // مثال: laws/abc123.pdf
    const storagePath = `${folder}/${filename}`;

    // ===============================
    // Upload → Supabase
    // ===============================
    const { error: uploadError } = await supabase.storage
      .from("library")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("SUPABASE UPLOAD ERROR:", uploadError);
      return NextResponse.json(
        { ok: false, error: uploadError.message || "فشل رفع الملف" },
        { status: 500 }
      );
    }

    // ===============================
    // LegalDocument (Schema-safe)
    // ===============================
    const legalDoc = await prisma.legalDocument.create({
      data: {
        title,
        filename,                 // اسم الملف
        source: storagePath,     // 🔥 المسار الحقيقي في Supabase
        mimetype: "application/pdf",
        size: buffer.length,
        isScanned: true,
        ocrStatus: OCRStatus.PENDING,
      },
      select: { id: true },
    });

    // ===============================
    // LawUnit
    // ===============================
    const lawUnit = await prisma.lawUnit.create({
      data: {
        title,
        category,
        status: "PUBLISHED",
        content: "",
      },
      select: { id: true },
    });

    // ===============================
    // LawUnitDocument Link
    // ===============================
    await prisma.lawUnitDocument.create({
      data: {
        lawUnitId: lawUnit.id,
        documentId: legalDoc.id,
      },
    });

    // ===============================
    // Extract PDF Text (Pre-OCR)
    // ===============================
    const extractedText = await extractPdfText(buffer);

    if (extractedText) {
      await prisma.lawUnit.update({
        where: { id: lawUnit.id },
        data: {
          content: extractedText.slice(0, 500_000),
        },
      });
    }

    // ===============================
    // Audit
    // ===============================
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPLOAD_LAW_UNIT",
        meta: {
          lawUnitId: lawUnit.id,
          legalDocumentId: legalDoc.id,
          storagePath,
          extractedLength: extractedText.length,
        },
      },
    });

    // ===============================
    // Response
    // ===============================
    return NextResponse.json(
      {
        ok: true,
        lawUnitId: lawUnit.id,
        documentId: legalDoc.id,
        ocrQueued: true,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("LIBRARY UPLOAD ERROR:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "فشل رفع المستند" },
      { status: 500 }
    );
  }
}

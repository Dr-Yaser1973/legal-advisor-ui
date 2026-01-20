 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LawCategory } from "@prisma/client";
import crypto from "crypto";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";



// ===============================
// Supabase (Service Role) - SERVER ONLY
// ===============================
const supabase = createClient(
  process.env.SUPABASE_URL!,                 // server env
  process.env.SUPABASE_SERVICE_ROLE_KEY!    // server env
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
    // 🔐 ADMIN فقط
    const session: any = await getServerSession(authOptions as any);
    const role = session?.user?.role?.toUpperCase?.() || "CLIENT";

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مخول. يتطلب صلاحية ADMIN." },
        { status: 403 }
      );
    }

    const form = await req.formData();

    // ===============================
    // 1) قراءة الملف والحقول
    // ===============================
    const file = form.get("file") as File | null;
    const titleRaw = (form.get("title") as string | null) || "";
    const rawCategory = (form.get("category") as string | null) || "LAW";
    const createdByIdRaw = form.get("createdById");

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "الملف مفقود" },
        { status: 400 }
      );
    }

    const mime = file.type || "application/pdf";
    if (mime !== "application/pdf") {
      return NextResponse.json(
        { ok: false, error: "الملف يجب أن يكون PDF" },
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
    const createdById = createdByIdRaw
      ? Number(createdByIdRaw)
      : null;

    // ===============================
    // 2) رفع إلى Supabase Storage
    // ===============================
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const id = crypto.randomBytes(10).toString("hex");
    const folder = pickFolder(category);
    const filename = `${id}.pdf`;

    // نخزن المسار النسبي داخل الـ bucket فقط
    // مثال: laws/abc123.pdf
    const storagePath = `${folder}/${filename}`;

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
    // 3) إنشاء LegalDocument
    // ===============================
    const legalDoc = await prisma.legalDocument.create({
      data: {
        title,
        filename: storagePath, // ✅ مثال: laws/abc123.pdf
        mimetype: "application/pdf",
        size: buffer.length,
      },
      select: { id: true },
    });

    // ===============================
    // 4) إنشاء LawUnit
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
    // 5) الربط LawUnitDocument
    // ===============================
    await prisma.lawUnitDocument.create({
      data: {
        lawUnitId: lawUnit.id,
        documentId: legalDoc.id,
      },
    });

    // ===============================
    // 6) استخراج النص من PDF
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
    // 7) Audit Log
    // ===============================
    await prisma.auditLog.create({
      data: {
        userId: createdById || null,
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
    // 8) الرد
    // ===============================
    return NextResponse.json(
      {
        ok: true,
        lawUnitId: lawUnit.id,
        documentId: legalDoc.id,
        extracted: extractedText.length > 0,
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

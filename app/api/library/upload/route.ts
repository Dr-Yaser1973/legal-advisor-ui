 // app/api/library/upload/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

export const runtime = "nodejs";
export const maxDuration = 120;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type MainCategory = "LAW" | "FIQH" | "ACADEMIC" | "CONTRACT";
type ItemType =
  | "CONSTITUTION"
  | "STATUTE"
  | "REGULATION"
  | "PHD_THESIS"
  | "MASTER_THESIS"
  | "RESEARCH_PAPER"
  | "LOCAL_CONTRACT"
  | "INTERNATIONAL_CONTRACT"
  | "COURT_RULING";

function pickFolder(mainCategory: MainCategory): string {
  const folders: Record<MainCategory, string> = {
    LAW: "laws",
    FIQH: "fiqh",
    ACADEMIC: "studies",
    CONTRACT: "contracts"
  };
  return folders[mainCategory] || "misc";
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    const role = session?.user?.role?.toUpperCase?.() || "CLIENT";

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مخول. يتطلب صلاحيات ADMIN." },
        { status: 403 }
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const titleAr = (form.get("titleAr") as string) || "";
    const titleEn = (form.get("titleEn") as string) || "";
    const mainCategory = (form.get("mainCategory") as MainCategory) || "LAW";
    const itemType = (form.get("itemType") as ItemType) || "STATUTE";
    const year = form.get("year") ? parseInt(form.get("year") as string) : null;
    const author = (form.get("author") as string) || "";
    const jurisdiction = (form.get("jurisdiction") as string) || "";
    const university = (form.get("university") as string) || "";
    const keywords = (form.get("keywords") as string) || "";
    const basicExplanation = (form.get("basicExplanation") as string) || "";
    const professionalExplanation = (form.get("professionalExplanation") as string) || "";
    const commercialExplanation = (form.get("commercialExplanation") as string) || "";

    if (!file) {
      return NextResponse.json({ ok: false, error: "الملف مطلوب" }, { status: 400 });
    }

    if (!titleAr) {
      return NextResponse.json({ ok: false, error: "العنوان بالعربية مطلوب" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: "يدعم فقط ملفات PDF و Word (.doc, .docx)" },
        { status: 400 }
      );
    }

    // قراءة الملف
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // رفع الملف إلى Supabase
    const fileId = crypto.randomBytes(10).toString("hex");
    const folder = pickFolder(mainCategory);
    const extension = file.type === "application/pdf" ? ".pdf" : ".docx";
    const filename = `${fileId}${extension}`;
    const storagePath = `${folder}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("library")
      .upload(storagePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { ok: false, error: `فشل رفع الملف: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from("library").getPublicUrl(storagePath);
    const isPDF = file.type === "application/pdf";
    const isWord = !isPDF;
    const slug = generateSlug(titleAr);

    // إنشاء المادة في قاعدة البيانات
    const libraryItem = await prisma.libraryItem.create({
      data: {
        titleAr,
        titleEn: titleEn || null,
        slug,
        basicExplanation: basicExplanation || null,
        professionalExplanation: professionalExplanation || null,
        commercialExplanation: commercialExplanation || null,
        mainCategory,
        itemType,
        hasPDF: isPDF,
        pdfUrl: isPDF ? urlData?.publicUrl : null,
        hasWord: isWord,
        wordUrl: isWord ? urlData?.publicUrl : null,
        jurisdiction: jurisdiction || null,
        year,
        author: author || null,
        university: university || null,
        keywords: keywords ? keywords.split(",").map(k => k.trim()) : [],
        views: 0,
        downloads: 0,
        saves: 0,
        rating: 0,
        isPublished: true,
        publishedAt: new Date(),
        createdById: Number(session.user.id),
      },
    });

    // إنشاء LegalDocument
    const legalDoc = await prisma.legalDocument.create({
      data: {
        title: titleAr,
        filename,
        filePath: storagePath,
        mimetype: file.type,
        size: buffer.length,
        extractedText: null,
        kind: isPDF ? "PDF" : "IMAGE",
        createdById: Number(session.user.id),
      },
    });

    // ربط المستند بالمادة
    await prisma.libraryItemDocument.create({
      data: {
        libraryItemId: libraryItem.id,
        documentId: legalDoc.id,
      },
    });

    // تسجيل في AuditLog
    await prisma.auditLog.create({
      data: {
        userId: Number(session.user.id),
        action: "UPLOAD_LIBRARY_ITEM",
        meta: {
          libraryItemId: libraryItem.id,
          documentId: legalDoc.id,
          storagePath,
          fileSize: buffer.length,
          fileType: file.type,
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: "تم رفع المادة بنجاح",
      libraryItemId: libraryItem.id,
      documentId: legalDoc.id,
      url: urlData?.publicUrl,
      slug,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "فشل رفع المستند" },
      { status: 500 }
    );
  }
}
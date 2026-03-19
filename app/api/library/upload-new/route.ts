 // app/api/library/upload-new/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

export const runtime = "nodejs";

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
  switch (mainCategory) {
    case "LAW": return "laws";
    case "FIQH": return "fiqh";
    case "ACADEMIC": return "studies";
    case "CONTRACT": return "contracts";
    default: return "misc";
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const role = session?.user?.role?.toUpperCase?.() || "CLIENT";

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مخول. يتطلب ADMIN." },
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

    const basicExplanation = (form.get("basicExplanation") as string) || "";
    const professionalExplanation = (form.get("professionalExplanation") as string) || "";
    const commercialExplanation = (form.get("commercialExplanation") as string) || "";

    if (!file) {
      return NextResponse.json({ ok: false, error: "الملف مفقود" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: "يدعم PDF و Word فقط" },
        { status: 400 }
      );
    }

    if (!titleAr) {
      return NextResponse.json(
        { ok: false, error: "العنوان بالعربية مطلوب" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const id = crypto.randomBytes(10).toString("hex");
    const folder = pickFolder(mainCategory);

    // ✅ تحديد نوع الملف الحقيقي (الجراحة هنا)
    const isWord =
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const extension = isWord ? ".docx" : ".pdf";
    const filename = `${id}${extension}`;
    const storagePath = `${folder}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("library")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { ok: false, error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("library")
      .getPublicUrl(storagePath);

    // LegalDocument (يبقى كما هو)
    const legalDoc = await prisma.legalDocument.create({
      data: {
        title: titleAr,
        filename,
        source: storagePath,
        mimetype: file.type,
        size: buffer.length,
        isScanned: false,
        ocrStatus: "NONE",
      },
    });

    // ✅ LibraryItem (الإصلاح الحقيقي)
    const libraryItem = await prisma.libraryItem.create({
      data: {
        titleAr,
        titleEn: titleEn || null,

        basicExplanation: basicExplanation || null,
        professionalExplanation: professionalExplanation || null,
        commercialExplanation: commercialExplanation || null,

        mainCategory,
        itemType,

        hasPDF: !isWord,
        pdfUrl: !isWord ? urlData?.publicUrl : null,

        hasWord: isWord,
        wordUrl: isWord ? urlData?.publicUrl : null,

        jurisdiction: jurisdiction || null,
        year,
        author: author || null,

        views: 0,
        downloads: 0,
        saves: 0,
        rating: 0,

        isPublished: true,
        publishedAt: new Date(),

        createdById: session.user.id
          ? Number(session.user.id)
          : null,
      },
    });

    await prisma.libraryItemDocument.create({
      data: {
        libraryItemId: libraryItem.id,
        documentId: legalDoc.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: Number(session.user.id),
        action: "UPLOAD_LIBRARY_ITEM",
        meta: {
          libraryItemId: libraryItem.id,
          documentId: legalDoc.id,
          storagePath,
        },
      },
    });

    return NextResponse.json({
      ok: true,
      libraryItemId: libraryItem.id,
      documentId: legalDoc.id,
      url: urlData?.publicUrl,
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err?.message || "فشل رفع المستند" },
      { status: 500 }
    );
  }
}
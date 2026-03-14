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
  switch(mainCategory) {
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
      return NextResponse.json(
        { ok: false, error: "الملف مفقود" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { ok: false, error: "يدعم ملفات PDF فقط" },
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
    const filename = `${id}.pdf`;
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

    const { data: urlData } = supabase.storage
      .from("library")
      .getPublicUrl(storagePath);

    // إنشاء LegalDocument (للملف)
    const legalDoc = await prisma.legalDocument.create({
      data: {
        title: titleAr,
        filename,
        source: storagePath,
        mimetype: "application/pdf",
        size: buffer.length,  // ✅ هذا موجود في LegalDocument
        isScanned: false,
        ocrStatus: "NONE",
      },
    });

    // ✅ إنشاء LibraryItem بدون pdfSize
    const libraryItem = await prisma.libraryItem.create({
      data: {
        titleAr,
        titleEn: titleEn || null,
        
        // الشروحات الثلاثة
        basicExplanation: basicExplanation || null,
        professionalExplanation: professionalExplanation || null,
        commercialExplanation: commercialExplanation || null,
        
        // التصنيفات
        mainCategory: mainCategory as MainCategory,
        itemType: itemType as ItemType,
        
        // الملفات
        hasPDF: true,
        pdfUrl: urlData?.publicUrl || null,
        // ❌ لا يوجد pdfSize في LibraryItem - تمت إزالته
        
        hasWord: false,
        
        // بيانات قانونية
        jurisdiction: jurisdiction || null,
        year: year,
        author: author || null,
        
        // إحصائيات
        views: 0,
        downloads: 0,
        saves: 0,
        rating: 0,
        
        // حالة النشر
        isPublished: true,
        publishedAt: new Date(),
        
        // المستخدم الذي أضافها
        createdById: session.user.id ? Number(session.user.id) : null
      },
    });

    // ربط المادة بالملف
    await prisma.libraryItemDocument.create({
      data: {
        libraryItemId: libraryItem.id,
        documentId: legalDoc.id,
      },
    });

    // تسجيل العملية
    await prisma.auditLog.create({
      data: {
        userId: session.user.id ? Number(session.user.id) : null,
        action: "UPLOAD_LIBRARY_ITEM",
        meta: {
          libraryItemId: libraryItem.id,
          documentId: legalDoc.id,
          storagePath,
        },
      },
    });

    return NextResponse.json(
      {
        ok: true,
        libraryItemId: libraryItem.id,
        documentId: legalDoc.id,
        url: urlData?.publicUrl,
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
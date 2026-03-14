 // app/api/library/add-new/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

// تعريف الأنواع المسموحة
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

export async function POST(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json();
    const { 
      titleAr, 
      titleEn,
      mainCategory,
      itemType,
      // ✅ ملاحظة: content غير موجود في النموذج
      // سنستخدم basicExplanation بدلاً منه للنص الرئيسي
      mainText,  // ← هذا هو النص الرئيسي
      basicExplanation,
      professionalExplanation,
      commercialExplanation,
      jurisdiction,
      year,
      author,
      keywords 
    } = body;

    // التحقق من الحقول المطلوبة
    if (!titleAr || !mainCategory || !itemType || !mainText) {
      return NextResponse.json({
        ok: false,
        error: "العنوان بالعربية، التصنيف، النوع والنص الرئيسي مطلوبة."
      }, { status: 400 });
    }

    // إنشاء المادة في المكتبة الجديدة
    const libraryItem = await prisma.libraryItem.create({
      data: {
        titleAr,
        titleEn: titleEn || null,
        
        // ✅ استخدام basicExplanation للنص الرئيسي
        basicExplanation: mainText,  // النص الرئيسي يذهب هنا
        
        // الشروحات الإضافية
        professionalExplanation: professionalExplanation || null,
        commercialExplanation: commercialExplanation || null,
        
        // التصنيفات
        mainCategory: mainCategory as MainCategory,
        itemType: itemType as ItemType,
        
        // الملفات (لا يوجد PDF هنا)
        hasPDF: false,
        hasWord: false,
        
        // بيانات قانونية
        jurisdiction: jurisdiction || null,
        year: year ? parseInt(year) : null,
        author: author || null,
        keywords: keywords || [],
        
        // إحصائيات
        views: 0,
        downloads: 0,
        saves: 0,
        rating: 0,
        
        // حالة النشر
        isPublished: true,
        publishedAt: new Date()
      },
    });

    return NextResponse.json({ 
      ok: true, 
      id: libraryItem.id,
      message: "تم إضافة المادة بنجاح" 
    }, { status: 201 });

  } catch (e: any) {
    console.error("library/add error:", e);
    return NextResponse.json({ 
      ok: false, 
      error: e?.message ?? "فشل إضافة المادة" 
    }, { status: 500 });
  }
}
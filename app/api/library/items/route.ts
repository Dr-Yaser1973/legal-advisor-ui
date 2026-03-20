 // app/api/library/items/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // بناء where clause
    const where: any = {
      isPublished: true
    };

    if (category && category !== "ALL") {
      where.mainCategory = category;
     
  // تحويل category المرسل من الواجهة إلى القيمة الصحيحة في DB
  if (category.toLowerCase() === "law") where.mainCategory = "LAW";
  else if (category.toLowerCase() === "studies") where.mainCategory = "ACADEMIC";
    }

    // جلب البيانات من النموذج الجديد LibraryItem
    const items = await prisma.libraryItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        abstractAr: true,
        abstractEn: true,
        // ملاحظة: لا يوجد حقل 'content' في الـ Schema
        // basicExplanation: true, موجود
        basicExplanation: true,
        professionalExplanation: true,
        commercialExplanation: true,
        mainCategory: true,
        subCategory: true,
        itemType: true,
        hasPDF: true,
        pdfUrl: true,
        hasWord: true,
        wordUrl: true,
        jurisdiction: true,
        year: true,
        author: true,
        university: true,
        // ملاحظة: keywords هي String[] في الـ Schema
        keywords: true,
        views: true,
        downloads: true,
        saves: true,
        rating: true,
        // ملاحظة: لا يوجد حقل 'featured' في الـ Schema
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const total = await prisma.libraryItem.count({ where });

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    if (!["ADMIN", "LAWYER"].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // إنشاء مادة جديدة - بدون الحقول غير الموجودة
    const newItem = await prisma.libraryItem.create({
      data: {
        // الحقول المطلوبة من الـ Schema الأصلي
        titleAr: body.titleAr,
        titleEn: body.titleEn || null,
        
        // الشروحات الثلاثة (موجودة في الـ Schema)
        basicExplanation: body.basicExplanation || null,
        professionalExplanation: body.professionalExplanation || null,
        commercialExplanation: body.commercialExplanation || null,
        
        // التصنيفات
        mainCategory: body.mainCategory,
        subCategory: body.subCategory || null,
        itemType: body.itemType,
        
        // الملفات
        hasPDF: body.hasPDF || false,
        pdfUrl: body.pdfUrl || null,
        hasWord: body.hasWord || false,
        wordUrl: body.wordUrl || null,
        
        // بيانات قانونية (موجودة في الـ Schema)
        jurisdiction: body.jurisdiction || null,
        year: body.year ? parseInt(body.year) : null,
        author: body.author || null,
        university: body.university || null,
        
        // keywords مصفوفة
        keywords: body.keywords || [],
        
        // إحصائيات
        views: 0,
        downloads: 0,
        saves: 0,
        rating: 0,
        
        // حالة النشر
        isPublished: true,
        publishedAt: new Date(),
        
        // العلاقات
        createdById: (session.user as any).id
      }
    });

    return NextResponse.json({
      success: true,
      data: newItem
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
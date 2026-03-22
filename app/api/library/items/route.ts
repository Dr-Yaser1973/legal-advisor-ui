 // app/api/library/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // ✅ قراءة جميع معاملات الفلترة
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const year = searchParams.get("year");
    const explanation = searchParams.get("explanation");
    const hasPDF = searchParams.get("hasPDF");
    const hasWord = searchParams.get("hasWord");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // ✅ بناء where clause كامل
    const where: any = {
      isPublished: true
    };

    // ✅ فلتر حسب التصنيف الرئيسي
    if (category && category !== "ALL") {
      // تحويل category المرسل من الواجهة إلى القيمة الصحيحة في DB
      if (category === "LAW") where.mainCategory = "LAW";
      else if (category === "FIQH") where.mainCategory = "FIQH";
      else if (category === "ACADEMIC") where.mainCategory = "ACADEMIC";
      else if (category === "CONTRACT") where.mainCategory = "CONTRACT";
      else where.mainCategory = category;
    }

    // ✅ فلتر حسب نوع المحتوى (itemType)
    if (type && type !== "ALL") {
      where.itemType = type;
    }

    // ✅ فلتر حسب السنة
    if (year && year !== "ALL") {
      where.year = parseInt(year);
    }

    // ✅ فلتر حسب وجود PDF
    if (hasPDF === "true") {
      where.hasPDF = true;
    }

    // ✅ فلتر حسب وجود Word
    if (hasWord === "true") {
      where.hasWord = true;
    }

    // ✅ فلتر حسب وجود شروحات
    if (explanation && explanation !== "ALL") {
      if (explanation === "basic") {
        where.basicExplanation = { not: null };
      } else if (explanation === "professional") {
        where.professionalExplanation = { not: null };
      } else if (explanation === "commercial") {
        where.commercialExplanation = { not: null };
      }
    }

    // ✅ بناء شرط الترتيب (sort)
    let orderBy: any = {};
    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "popular":
        orderBy = { views: "desc" };
        break;
      case "rated":
        orderBy = { rating: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // ✅ حساب إجمالي النتائج
    const total = await prisma.libraryItem.count({ where });
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // ✅ جلب البيانات
    const items = await prisma.libraryItem.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        abstractAr: true,
        abstractEn: true,
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
        keywords: true,
        views: true,
        downloads: true,
        saves: true,
        rating: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages
        }
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في جلب البيانات" },
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
    
    const newItem = await prisma.libraryItem.create({
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn || null,
        basicExplanation: body.basicExplanation || null,
        professionalExplanation: body.professionalExplanation || null,
        commercialExplanation: body.commercialExplanation || null,
        mainCategory: body.mainCategory,
        subCategory: body.subCategory || null,
        itemType: body.itemType,
        hasPDF: body.hasPDF || false,
        pdfUrl: body.pdfUrl || null,
        hasWord: body.hasWord || false,
        wordUrl: body.wordUrl || null,
        jurisdiction: body.jurisdiction || null,
        year: body.year ? parseInt(body.year) : null,
        author: body.author || null,
        university: body.university || null,
        keywords: body.keywords || [],
        views: 0,
        downloads: 0,
        saves: 0,
        rating: 0,
        isPublished: true,
        publishedAt: new Date(),
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
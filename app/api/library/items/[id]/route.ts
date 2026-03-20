//app/api/library/items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LibraryRelationType } from "@prisma/client";

export const runtime = "nodejs";

 // في buildFileUrl
 function buildFileUrl(
  filename: string | null,
  type: "laws" | "studies" | "fiqh" | "misc" = "laws"
) {
  if (!filename) return null;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not defined");
    return null;
  }

  const cleanBase = base.replace(/\/$/, "");

  // التحقق من أن النوع صحيح
  const validTypes = ["laws", "studies", "fiqh", "misc"];
  const folder = validTypes.includes(type) ? type : "laws";

  // بناء الرابط النهائي
  const url = `${cleanBase}/storage/v1/object/public/library/${folder}/${filename}`;

  console.log("🔗 Generated File URL:", url);

  return url;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // انتظار params لأنه Promise
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "معرف العنصر مطلوب" },
        { status: 400 }
      );
    }

    // زيادة عدد المشاهدات (غير متزامن - لا ننتظر النتيجة)
    prisma.libraryItem
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch(console.error);

    // جلب المادة مع جميع العلاقات
    const item = await prisma.libraryItem.findUnique({
      where: { id, isPublished: true },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        itemDocuments: {
          include: {
            document: {
              select: {
                id: true,
                title: true,
                filename: true,
                mimetype: true,
                size: true,
                createdAt: true,
              },
            },
          },
        },
        itemTags: {
          include: {
            tag: {
              select: { id: true, name: true },
            },
          },
        },
        fromRelations: {
          include: {
            toItem: {
              select: {
                id: true,
                titleAr: true,
                titleEn: true,
                mainCategory: true,
                itemType: true,
              },
            },
          },
        },
        toRelations: {
          include: {
            fromItem: {
              select: {
                id: true,
                titleAr: true,
                titleEn: true,
                mainCategory: true,
                itemType: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { ok: false, error: "العنصر غير موجود" },
        { status: 404 }
      );
    }
     function categoryToFolder(category: string) {
  switch (category) {
    case "LAW":
      return "laws";
    case "ACADEMIC":
      return "studies";
    case "FIQH":
      return "fiqh";
    default:
      return "misc";
  }
}

    // تجهيز روابط جميع الملفات
    const documents = item.itemDocuments.map((doc) => ({
      id: doc.document.id,
      title: doc.document.title,
      filename: doc.document.filename,
      mimetype: doc.document.mimetype,
      size: doc.document.size,
       url: buildFileUrl(
  doc.document.filename,
  categoryToFolder(item.mainCategory)
),
      createdAt: doc.document.createdAt,
    }));

    // تجهيز التصنيفات
    const tags = item.itemTags.map((t) => t.tag.name);

    // تجهيز المواد المرتبطة
    const relatedItems = [
      ...item.fromRelations.map((rel) => ({
        id: rel.toItem.id,
        titleAr: rel.toItem.titleAr,
        titleEn: rel.toItem.titleEn,
        mainCategory: rel.toItem.mainCategory,
        itemType: rel.toItem.itemType,
        relationType: rel.relationType,
      })),
      ...item.toRelations.map((rel) => ({
        id: rel.fromItem.id,
        titleAr: rel.fromItem.titleAr,
        titleEn: rel.fromItem.titleEn,
        mainCategory: rel.fromItem.mainCategory,
        itemType: rel.fromItem.itemType,
        relationType: rel.relationType,
      })),
    ];

    // إذا كانت العلاقات قليلة، نضيف مواد من نفس التصنيف
    if (relatedItems.length < 4) {
      const sameCategory = await prisma.libraryItem.findMany({
        where: {
          mainCategory: item.mainCategory,
          id: { not: id },
          isPublished: true,
          NOT: {
            id: { in: relatedItems.map((r) => r.id) },
          },
        },
        take: 6 - relatedItems.length,
        select: {
          id: true,
          titleAr: true,
          titleEn: true,
          mainCategory: true,
          itemType: true,
        },
      });

      relatedItems.push(
        ...sameCategory.map((item) => ({
          ...item,
          relationType: "SAME_CATEGORY" as LibraryRelationType,
        }))
      );
    }

    // جلب إحصائيات التقييمات
    const ratingStats = await prisma.libraryRating.aggregate({
      where: { itemId: id },
      _avg: { rating: true },
      _count: true,
    });

    // التحقق من أن المستخدم أضاف العنصر للمفضلة
    let isFavorited = false;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        const userId = (session.user as any).id;
        if (userId) {
          const favorite = await prisma.libraryFavorite.findUnique({
            where: {
              itemId_userId: {
                itemId: id,
                userId: userId,
              },
            },
          });
          isFavorited = !!favorite;
        }
      }
    } catch (error) {
      console.error("Error checking favorite:", error);
    }

    return NextResponse.json({
      ok: true,
      doc: {
        ...item,
        documents,
        tags,
        pdfUrl:
          documents.find((d) => d.mimetype.includes("pdf"))?.url || null,
        wordUrl:
          documents.find(
            (d) => d.mimetype.includes("word") || d.mimetype.includes("document")
          )?.url || null,
        rating: ratingStats._avg.rating || 0,
        totalRatings: ratingStats._count,
      },
      related: relatedItems.slice(0, 8),
      stats: {
        views: item.views,
        downloads: item.downloads,
        saves: item.saves,
      },
      isFavorited,
    });
  } catch (error) {
    console.error("Error fetching library item:", error);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // انتظار params لأنه Promise
    const { id } = await params;

    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "معرف المستخدم غير موجود" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "favorite": {
        const favorite = await prisma.libraryFavorite.findUnique({
          where: {
            itemId_userId: {
              itemId: id,
              userId: userId,
            },
          },
        });

        if (favorite) {
          await prisma.libraryFavorite.delete({
            where: { id: favorite.id },
          });
          await prisma.libraryItem.update({
            where: { id },
            data: { saves: { decrement: 1 } },
          });
        } else {
          await prisma.libraryFavorite.create({
            data: {
              itemId: id,
              userId: userId,
            },
          });
          await prisma.libraryItem.update({
            where: { id },
            data: { saves: { increment: 1 } },
          });
        }
        break;
      }

      case "rating": {
        const { rating, review } = body;
        if (!rating || rating < 1 || rating > 5) {
          return NextResponse.json(
            { ok: false, error: "التقييم يجب أن يكون بين 1 و 5" },
            { status: 400 }
          );
        }

        await prisma.libraryRating.upsert({
          where: {
            itemId_userId: {
              itemId: id,
              userId: userId,
            },
          },
          update: { rating, review },
          create: {
            itemId: id,
            userId: userId,
            rating,
            review,
          },
        });

        const avg = await prisma.libraryRating.aggregate({
          where: { itemId: id },
          _avg: { rating: true },
        });

        await prisma.libraryItem.update({
          where: { id },
          data: { rating: avg._avg.rating || 0 },
        });
        break;
      }

      case "download":
        await prisma.libraryItem.update({
          where: { id },
          data: { downloads: { increment: 1 } },
        });
        break;

      case "note": {
        const { content, page } = body;
        if (!content) {
          return NextResponse.json(
            { ok: false, error: "محتوى الملاحظة مطلوب" },
            { status: 400 }
          );
        }

        await prisma.libraryNote.create({
          data: {
            itemId: id,
            userId: userId,
            content,
            page: page || null,
          },
        });
        break;
      }

      default:
        return NextResponse.json(
          { ok: false, error: "إجراء غير معروف" },
          { status: 400 }
        );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}
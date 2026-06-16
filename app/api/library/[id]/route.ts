 // app/api/library/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

function buildFileUrl(filename: string | null) {
  if (!filename) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  return `${base?.replace(/\/$/, "")}/storage/v1/object/public/library/${filename}`;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ ok: false, error: "Missing ID" }, { status: 400 });

  try {
    // زيادة عدد المشاهدات (غير متزامن)
    prisma.libraryItem.update({
      where: { id },
      data: { views: { increment: 1 } }
    }).catch(console.error);

    // جلب المادة مع جميع العلاقات
    const item = await prisma.libraryItem.findUnique({
      where: { id, isPublished: true },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
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
                createdAt: true
              }
            }
          }
        },
        itemTags: {
          include: {
            tag: {
              select: { id: true, name: true }
            }
          }
        },
        // العلاقات الصادرة
        fromRelations: {
          include: {
            toItem: {
              select: {
                id: true,
                titleAr: true,
                titleEn: true,
                mainCategory: true,
                itemType: true
              }
            }
          }
        },
        // العلاقات الواردة
        toRelations: {
          include: {
            fromItem: {
              select: {
                id: true,
                titleAr: true,
                titleEn: true,
                mainCategory: true,
                itemType: true
              }
            }
          }
        },
        ratings: {
          take: 5,
          orderBy: { id: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          }
        }
      }
    });

    if (!item) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    // حل موضعي: الاستعلام يتضمن include صحيحاً، لكن الاستنتاج يفقد العلاقات هنا.
    // التحويل يعكس الواقع وقت التشغيل (Prisma يُرجع هذه العلاقات فعلاً).
    const it = item as typeof item & {
      itemDocuments: any[];
      itemTags: any[];
      fromRelations: any[];
      toRelations: any[];
    };

    // تجهيز روابط جميع الملفات
    const documents = it.itemDocuments.map((doc: any) => ({
      id: doc.document.id,
      title: doc.document.title,
      filename: doc.document.filename,
      mimetype: doc.document.mimetype,
      size: doc.document.size,
      url: buildFileUrl(doc.document.filename),
      createdAt: doc.document.createdAt
    }));

    // تجهيز التصنيفات
    const tags = it.itemTags.map((t: any) => t.tag.name);

    // تجهيز المواد المرتبطة (دمج العلاقات)
    const relatedItems = [
      ...it.fromRelations.map((rel: any) => ({
        id: rel.toItem.id,
        titleAr: rel.toItem.titleAr,
        titleEn: rel.toItem.titleEn,
        mainCategory: rel.toItem.mainCategory,
        itemType: rel.toItem.itemType,
        relationType: rel.relationType
      })),
      ...it.toRelations.map((rel: any) => ({
        id: rel.fromItem.id,
        titleAr: rel.fromItem.titleAr,
        titleEn: rel.fromItem.titleEn,
        mainCategory: rel.fromItem.mainCategory,
        itemType: rel.fromItem.itemType,
        relationType: rel.relationType
      }))
    ];

    // إذا كانت العلاقات قليلة، نضيف مواد من نفس التصنيف
    if (relatedItems.length < 4) {
      const sameCategory = await prisma.libraryItem.findMany({
        where: {
          mainCategory: item.mainCategory,
          id: { not: id },
          isPublished: true,
          NOT: {
            id: { in: relatedItems.map((r: any) => r.id) }
          }
        },
        take: 6 - relatedItems.length,
        select: {
          id: true,
          titleAr: true,
          titleEn: true,
          mainCategory: true,
          itemType: true
        }
      });

      relatedItems.push(...sameCategory.map((item) => ({
        ...item,
        relationType: 'SAME_CATEGORY'
      })));
    }

    // جلب إحصائيات التقييمات
    const ratingStats = await prisma.libraryRating.aggregate({
      where: { itemId: id },
      _avg: { rating: true },
      _count: true
    });

    return NextResponse.json({
      ok: true,
      doc: {
        ...item,
        documents,
        tags,
        pdfUrl: documents.find((d: any) => d.mimetype.includes('pdf'))?.url || null,
        wordUrl: documents.find((d: any) => d.mimetype.includes('word') || d.mimetype.includes('document'))?.url || null,
        rating: ratingStats._avg.rating || 0,
        totalRatings: ratingStats._count
      },
      related: relatedItems.slice(0, 8),
      stats: {
        views: item.views,
        downloads: item.downloads,
        saves: item.saves
      }
    });

  } catch (error) {
    console.error("Error fetching library item:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST للإجراءات التفاعلية
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const session = (await getServerSession(authOptions as any)) as {
    user?: { id: number };
  } | null;

  if (!session?.user) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = Number(session.user.id);

  const body = await req.json();
  const { action } = body;

  try {
    switch (action) {
      case 'favorite':
        const favorite = await prisma.libraryFavorite.findUnique({
          where: {
            itemId_userId: {
              itemId: id,
              userId
            }
          }
        });

        if (favorite) {
          await prisma.libraryFavorite.delete({
            where: { id: favorite.id }
          });
        } else {
          await prisma.libraryFavorite.create({
            data: {
              itemId: id,
              userId
            }
          });

          // زيادة عدد الحفظ
          await prisma.libraryItem.update({
            where: { id },
            data: { saves: { increment: 1 } }
          });
        }
        break;

      case 'rating':
        const { rating, review } = body;
        await prisma.libraryRating.upsert({
          where: {
            itemId_userId: {
              itemId: id,
              userId
            }
          },
          update: { rating, review },
          create: {
            itemId: id,
            userId,
            rating,
            review
          }
        });
        break;

      case 'download':
        await prisma.libraryItem.update({
          where: { id },
          data: { downloads: { increment: 1 } }
        });
        break;

      case 'note':
        const { content, page } = body;
        await prisma.libraryNote.create({
          data: {
            itemId: id,
            userId,
            content,
            page
          }
        });
        break;

      default:
        return NextResponse.json(
          { ok: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
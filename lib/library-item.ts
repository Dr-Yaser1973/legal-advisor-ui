// lib/library-item.ts
// دالة خادم مشتركة لجلب مادة المكتبة للعرض — يستدعيها كلٌّ من
// صفحة العرض (SSR مباشرة) و API ‏items/[id]، لتفادي self-fetch وتكرار المنطق.
import { prisma } from "@/lib/prisma";
import { LibraryRelationType } from "@prisma/client";

export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function categoryToFolder(category: string): string {
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

function buildFileUrl(
  filename: string | null,
  type: "laws" | "studies" | "fiqh" | "misc" = "laws"
): string | null {
  if (!filename) return null;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not defined");
    return null;
  }

  const cleanBase = base.replace(/\/$/, "");
  const validTypes = ["laws", "studies", "fiqh", "misc"];
  const folder = validTypes.includes(type) ? type : "laws";

  return `${cleanBase}/storage/v1/object/public/library/${folder}/${filename}`;
}

/**
 * يجلب المادة (بالـ id أو slug) مع الملفات والتصنيفات والعلاقات والتقييم،
 * ويزيد عدّاد المشاهدات. يُعيد null إن لم توجد.
 * @param userId إن مُرّر، يُحسب isFavorited لهذا المستخدم.
 */
export async function getLibraryItemView(
  rawIdentifier: string,
  userId?: number | null
) {
  const identifier = safeDecode(rawIdentifier);

  const item = await prisma.libraryItem.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
      isPublished: true,
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
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
      itemTags: { include: { tag: { select: { id: true, name: true } } } },
      fromRelations: {
        include: {
          toItem: {
            select: { id: true, titleAr: true, titleEn: true, mainCategory: true, itemType: true },
          },
        },
      },
      toRelations: {
        include: {
          fromItem: {
            select: { id: true, titleAr: true, titleEn: true, mainCategory: true, itemType: true },
          },
        },
      },
    },
  });

  if (!item) return null;

  const itemId = item.id;

  // زيادة عدد المشاهدات (غير متزامن)
  prisma.libraryItem
    .update({ where: { id: itemId }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const folder = categoryToFolder(item.mainCategory);

  const documents = item.itemDocuments.map((doc) => ({
    id: doc.document.id,
    title: doc.document.title,
    filename: doc.document.filename,
    mimetype: doc.document.mimetype,
    size: doc.document.size,
    url: buildFileUrl(doc.document.filename, folder as any),
    createdAt: doc.document.createdAt,
  }));

  const tags = item.itemTags.map((t) => t.tag.name);

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

  if (relatedItems.length < 4) {
    const sameCategory = await prisma.libraryItem.findMany({
      where: {
        mainCategory: item.mainCategory,
        id: { not: itemId },
        isPublished: true,
        NOT: { id: { in: relatedItems.map((r) => r.id) } },
      },
      take: 6 - relatedItems.length,
      select: { id: true, titleAr: true, titleEn: true, mainCategory: true, itemType: true },
    });

    relatedItems.push(
      ...sameCategory.map((si) => ({
        ...si,
        relationType: "SAME_CATEGORY" as LibraryRelationType,
      }))
    );
  }

  const ratingStats = await prisma.libraryRating.aggregate({
    where: { itemId },
    _avg: { rating: true },
    _count: true,
  });

  let isFavorited = false;
  if (userId) {
    try {
      const favorite = await prisma.libraryFavorite.findUnique({
        where: { itemId_userId: { itemId, userId } },
      });
      isFavorited = !!favorite;
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  }

  return {
    doc: {
      ...item,
      documents,
      tags,
      pdfUrl: documents.find((d) => d.mimetype.includes("pdf"))?.url || null,
      wordUrl:
        documents.find(
          (d) => d.mimetype.includes("word") || d.mimetype.includes("document")
        )?.url || null,
      rating: ratingStats._avg.rating || 0,
      totalRatings: ratingStats._count,
    },
    related: relatedItems.slice(0, 8),
    stats: { views: item.views, downloads: item.downloads, saves: item.saves },
    isFavorited,
  };
}

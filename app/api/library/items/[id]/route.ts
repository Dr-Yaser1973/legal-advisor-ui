 //app/api/library/items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getLibraryItemView, safeDecode } from "@/lib/library-item";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;

    if (!rawId) {
      return NextResponse.json(
        { ok: false, error: "معرف العنصر مطلوب" },
        { status: 400 }
      );
    }

    // معرّف المستخدم (لحساب المفضلة) إن وُجدت جلسة
    let userId: number | null = null;
    try {
      const session = await getServerSession(authOptions);
      const sid = (session?.user as any)?.id;
      if (sid) userId = Number(sid);
    } catch {
      /* زائر مجهول — لا مفضلة */
    }

    const data = await getLibraryItemView(rawId, userId);

    if (!data) {
      return NextResponse.json(
        { ok: false, error: "العنصر غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, ...data });
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
    const { id: rawId } = await params;
    const identifier = safeDecode(rawId);

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

    // حلّ المعرّف الحقيقي (يقبل id أو slug)
    const target = await prisma.libraryItem.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
      select: { id: true },
    });

    if (!target) {
      return NextResponse.json(
        { ok: false, error: "العنصر غير موجود" },
        { status: 404 }
      );
    }

    const id = target.id;

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

// ✅ PATCH - تعديل المادة (لصفحة الادمن)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const identifier = safeDecode(rawId);

    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role?.toUpperCase?.() || "CLIENT";

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مخول. يتطلب صلاحيات ADMIN." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      titleAr,
      titleEn,
      basicExplanation,
      professionalExplanation,
      commercialExplanation,
      year,
      author,
      jurisdiction,
      university,
      keywords,
      mainCategory,
      itemType,
    } = body;

    const existingItem = await prisma.libraryItem.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
    });

    if (!existingItem) {
      return NextResponse.json(
        { ok: false, error: "المادة غير موجودة" },
        { status: 404 }
      );
    }

    const id = existingItem.id;

    // دالة توليد slug
    function generateSlug(title: string): string {
      return title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const updateData: any = {};

    if (titleAr !== undefined) {
      updateData.titleAr = titleAr;
      updateData.slug = generateSlug(titleAr);
    }
    if (titleEn !== undefined) updateData.titleEn = titleEn;
    if (basicExplanation !== undefined) updateData.basicExplanation = basicExplanation;
    if (professionalExplanation !== undefined) updateData.professionalExplanation = professionalExplanation;
    if (commercialExplanation !== undefined) updateData.commercialExplanation = commercialExplanation;
    if (year !== undefined) updateData.year = year;
    if (author !== undefined) updateData.author = author;
    if (jurisdiction !== undefined) updateData.jurisdiction = jurisdiction;
    if (university !== undefined) updateData.university = university;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (mainCategory !== undefined) updateData.mainCategory = mainCategory;
    if (itemType !== undefined) updateData.itemType = itemType;

    const updatedItem = await prisma.libraryItem.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: Number(session.user.id),
        action: "UPDATE_LIBRARY_ITEM",
        meta: {
          libraryItemId: id,
          changes: Object.keys(updateData),
        },
      },
    });

    return NextResponse.json({
      ok: true,
      data: updatedItem,
      message: "تم تحديث المادة بنجاح",
    });

  } catch (error: any) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "فشل تحديث المادة" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - حذف المادة
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const identifier = safeDecode(rawId);

    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role?.toUpperCase?.() || "CLIENT";

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مخول. يتطلب صلاحيات ADMIN." },
        { status: 403 }
      );
    }

    const existingItem = await prisma.libraryItem.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
      include: { itemDocuments: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { ok: false, error: "المادة غير موجودة" },
        { status: 404 }
      );
    }

    const id = existingItem.id;

    await prisma.libraryItemDocument.deleteMany({
      where: { libraryItemId: id },
    });

    await prisma.libraryItem.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: Number(session.user.id),
        action: "DELETE_LIBRARY_ITEM",
        meta: {
          libraryItemId: id,
          title: existingItem.titleAr,
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: "تم حذف المادة بنجاح",
    });

  } catch (error: any) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "فشل حذف المادة" },
      { status: 500 }
    );
  }
}
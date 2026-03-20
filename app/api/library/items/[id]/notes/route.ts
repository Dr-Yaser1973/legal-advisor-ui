 // app/api/library/items/[id]/notes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params في بعض نسخ Next.js تكون Promise
) {
  try {
    // فك الـ Promise للحصول على المعرف
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "معرف العنصر مطلوب" },
        { status: 400 }
      );
    }

    // جلب الملاحظات وترتيبها حسب id تنازلي (يمكن تغييره لاحقًا إلى createdAt إذا أضفته في السكيمة)
    const notes = await prisma.libraryNote.findMany({
      where: { itemId: id },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ ok: true, notes });
  } catch (error) {
    console.error("Notes GET error:", error);
    return NextResponse.json(
      { ok: false, error: "فشل جلب الملاحظات" },
      { status: 500 }
    );
  }
}
 // app/api/library/update-title/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // ✅ تحقق من صلاحية المستخدم
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json();

    // ✅ تحقق من وجود docId و newTitle
    const { docId, newTitle } = body;
    if (!docId || !newTitle) {
      return NextResponse.json(
        { error: "الرجاء إرسال معرف القانون والعنوان الجديد" },
        { status: 400 }
      );
    }

    // ✅ تأكد أن docId رقم
    const numericDocId = Number(docId);
    if (isNaN(numericDocId)) {
      return NextResponse.json(
        { error: "معرف القانون غير صالح" },
        { status: 400 }
      );
    }

    // ✅ ابحث عن القانون
    const lawDoc = await prisma.lawDoc.findUnique({
      where: { id: numericDocId },
    });

    if (!lawDoc) {
      return NextResponse.json({ error: "القانون غير موجود" }, { status: 404 });
    }

    // ✅ حدث العنوان
    const updatedLawDoc = await prisma.lawDoc.update({
      where: { id: numericDocId },
      data: { title: newTitle },
    });

    return NextResponse.json({ message: "تم تعديل عنوان القانون بنجاح", data: updatedLawDoc });
  } catch (error) {
    console.error("Error updating law title:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تعديل القانون" },
      { status: 500 }
    );
  }
}
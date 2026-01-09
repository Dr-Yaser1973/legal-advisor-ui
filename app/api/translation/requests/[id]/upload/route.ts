import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = Number(id);

    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user || user.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const note = formData.get("note") as string | null;

    if (!file) {
      return NextResponse.json({ error: "الملف مطلوب" }, { status: 400 });
    }

    // ✅ السماح بـ PDF فقط
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "يسمح برفع ملفات PDF فقط" },
        { status: 400 }
      );
    }
     const officeId = Number(user.id);

    // تأكد أن الطلب يخص هذا المكتب
     const request = await prisma.translationRequest.findFirst({
  where: {
    id: requestId,
    officeId: officeId, // ✅ رقم
    status: { in: ["IN_PROGRESS", "ACCEPTED"] },
  },
});


    if (!request) {
      return NextResponse.json(
        { error: "الطلب غير موجود أو غير مسموح" },
        { status: 404 }
      );
    }

    // اسم ملف احترافي
    const filePath = `translation-${requestId}-${Date.now()}.pdf`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // ⬆️ رفع إلى Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("translations")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 🔗 الحصول على رابط موقّت (Signed URL)
    const { data: signed } = await supabaseAdmin.storage
      .from("translations")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 أيام

    // 💾 تحديث الطلب
     await prisma.translationRequest.update({
  where: { id: requestId },
  data: {
    translatedFilePath: filePath,
    translatedFileUrl: signed?.signedUrl, // اختياري
    deliveredAt: new Date(),
    completedAt: new Date(),
    note: note ?? undefined,
    status: "COMPLETED",
  },
});


    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Upload translation error:", err);
    return NextResponse.json(
      { error: "فشل رفع ملف الترجمة" },
      { status: 500 }
    );
  }
}


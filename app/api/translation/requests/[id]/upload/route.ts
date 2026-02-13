 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const RESULT_BUCKET = "translations";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ===============================
    // 1️⃣ requestId
    // ===============================
    const { id } = await params;
    const requestId = Number(id);

    if (!Number.isFinite(requestId)) {
      return NextResponse.json(
        { error: "معرّف الطلب غير صالح" },
        { status: 400 }
      );
    }

    // ===============================
    // 2️⃣ الجلسة
    // ===============================
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user || !user.email || user.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    // ===============================
    // 3️⃣ officeId الحقيقي من DB  🔥 الإصلاح
    // ===============================
    const dbOffice = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (!dbOffice) {
      return NextResponse.json(
        { error: "مكتب الترجمة غير موجود" },
        { status: 403 }
      );
    }

    const officeId = dbOffice.id;

    // ===============================
    // 4️⃣ Supabase
    // ===============================
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase غير متاح" },
        { status: 500 }
      );
    }

    // ===============================
    // 5️⃣ formData
    // ===============================
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const note = formData.get("note") as string | null;

    if (!file) {
      return NextResponse.json({ error: "الملف مطلوب" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "يسمح فقط بملفات PDF" },
        { status: 400 }
      );
    }

    // ===============================
    // 6️⃣ التحقق من الطلب
    // ===============================
    const request = await prisma.translationRequest.findFirst({
      where: {
        id: requestId,
        officeId,
        status: "IN_PROGRESS",
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "الطلب غير موجود أو غير مسموح" },
        { status: 404 }
      );
    }

    // ===============================
    // 7️⃣ رفع الملف
    // ===============================
    const filePath = `translation-${requestId}-${Date.now()}.pdf`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(RESULT_BUCKET)
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "فشل رفع الملف" },
        { status: 500 }
      );
    }

    // ===============================
    // 8️⃣ تحديث الطلب
    // ===============================
    await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        translatedFilePath: filePath,
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
      { error: "خطأ داخلي أثناء رفع الترجمة" },
      { status: 500 }
    );
  }
}

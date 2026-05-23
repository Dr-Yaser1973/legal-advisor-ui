// app/api/lawyers/[id]/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type Params = { params: { id: string } };

// POST: المحامي يرسل نبذة أو صورة جديدة (تحفظ كـ pending)
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const lawyerId = Number(params.id);

    // تأكد أن المحامي يعدّل ملفه هو فقط
    if (user.id !== lawyerId && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const contentType = req.headers.get("content-type") || "";

    // ── حالة رفع صورة ──
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "لم يتم إرسال ملف" }, { status: 400 });
      }

      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json({ error: "خطأ في التخزين" }, { status: 500 });
      }

      const ext = file.name.split(".").pop();
      const path = `pending/${lawyerId}-${Date.now()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("lawyer-avatars")
        .upload(path, buffer, { contentType: file.type, upsert: true });

      if (uploadError) {
        return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
      }

      await prisma.lawyerProfile.update({
        where: { userId: lawyerId },
        data: { pendingAvatarPath: path },
      });

      return NextResponse.json({ ok: true, message: "تم إرسال الصورة وستظهر بعد مراجعة الإدارة" });
    }

    // ── حالة تحديث النبذة ──
    const body = await req.json();
    const { bio } = body;

    if (!bio || bio.trim().length < 20) {
      return NextResponse.json(
        { error: "النبذة يجب أن تكون 20 حرفاً على الأقل" },
        { status: 400 }
      );
    }

    if (bio.trim().length > 1000) {
      return NextResponse.json(
        { error: "النبذة يجب أن لا تتجاوز 1000 حرف" },
        { status: 400 }
      );
    }

    await prisma.lawyerProfile.update({
      where: { userId: lawyerId },
      data: { pendingBio: bio.trim() },
    });

    return NextResponse.json({
      ok: true,
      message: "تم إرسال النبذة وستظهر بعد مراجعة الإدارة",
    });
  } catch (e) {
    console.error("POST /api/lawyers/[id]/profile error:", e);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

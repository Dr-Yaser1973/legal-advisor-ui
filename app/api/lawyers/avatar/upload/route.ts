 // app/api/lawyers/avatar/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "lawyer-avatars";
const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    // 🔐 ADMIN فقط
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase غير متاح" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const lawyerId = Number(formData.get("lawyerId"));

    if (!file || !Number.isFinite(lawyerId)) {
      return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "صيغة غير مدعومة" }, { status: 415 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "الصورة كبيرة (2MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.split("/")[1];
    const path = `lawyers/${lawyerId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 💾 تحديث أو إنشاء LawyerProfile
    await prisma.lawyerProfile.upsert({
      where: { userId: lawyerId },
      update: { avatarPath: path },
      create: { userId: lawyerId, avatarPath: path },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Avatar upload error:", err);
    return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
  }
}

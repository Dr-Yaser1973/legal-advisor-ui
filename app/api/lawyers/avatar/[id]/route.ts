import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "lawyer-avatars";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lawyerId = Number(id);

    const profile = await prisma.lawyerProfile.findFirst({
      where: { userId: lawyerId },
      select: { avatarPath: true },
    });

    if (!profile?.avatarPath) {
      return NextResponse.json({ error: "لا توجد صورة" }, { status: 404 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase غير متاح" },
        { status: 500 }
      );
    }

    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(profile.avatarPath, 60 * 10); // 10 دقائق

    return NextResponse.json({ url: data?.signedUrl });
  } catch (err) {
    return NextResponse.json(
      { error: "فشل جلب الصورة" },
      { status: 500 }
    );
  }
}


// app/api/admin/lawyers/[id]/approve-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const lawyerId = Number(params.id);
    const { action, field } = await req.json();
    // action: "approve" | "reject"
    // field: "bio" | "avatar" | "both"

    const profile = await prisma.lawyerProfile.findUnique({
      where: { userId: lawyerId },
    });

    if (!profile) {
      return NextResponse.json({ error: "المحامي غير موجود" }, { status: 404 });
    }

    if (action === "approve") {
      const updateData: any = {};

      if ((field === "bio" || field === "both") && profile.pendingBio) {
        updateData.bio = profile.pendingBio;
        updateData.pendingBio = null;
      }

      if ((field === "avatar" || field === "both") && profile.pendingAvatarPath) {
        // احذف الصورة القديمة من Supabase إن وجدت
        if (profile.avatarPath) {
          const supabase = getSupabaseAdmin();
          await supabase?.storage
            .from("lawyer-avatars")
            .remove([profile.avatarPath]);
        }
        updateData.avatarPath = profile.pendingAvatarPath;
        updateData.pendingAvatarPath = null;
      }

      await prisma.lawyerProfile.update({
        where: { userId: lawyerId },
        data: updateData,
      });

      return NextResponse.json({ ok: true, message: "تمت الموافقة ونشر التحديث" });
    }

    if (action === "reject") {
      const updateData: any = {};

      if (field === "bio" || field === "both") {
        updateData.pendingBio = null;
      }

      if ((field === "avatar" || field === "both") && profile.pendingAvatarPath) {
        // احذف الصورة المرفوضة من Supabase
        const supabase = getSupabaseAdmin();
        await supabase?.storage
          .from("lawyer-avatars")
          .remove([profile.pendingAvatarPath]);
        updateData.pendingAvatarPath = null;
      }

      await prisma.lawyerProfile.update({
        where: { userId: lawyerId },
        data: updateData,
      });

      return NextResponse.json({ ok: true, message: "تم رفض التحديث وحذفه" });
    }

    return NextResponse.json({ error: "action غير صالح" }, { status: 400 });
  } catch (e) {
    console.error("approve-profile error:", e);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

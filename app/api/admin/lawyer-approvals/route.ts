// app/api/admin/lawyer-approvals/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرّح. هذه الواجهة لمدير النظام فقط." },
        { status: 403 }
      );
    }

    // المحامون الذين لديهم نبذة أو صورة معلّقة
    const profiles = await prisma.lawyerProfile.findMany({
      where: {
        OR: [
          { pendingBio: { not: null } },
          { pendingAvatarPath: { not: null } },
        ],
      },
      select: {
        userId: true,
        bio: true,
        pendingBio: true,
        avatarPath: true,
        pendingAvatarPath: true,
        specialties: true,
        city: true,
        user: { select: { name: true, email: true } },
      },
    });

    const supabase = getSupabaseAdmin();

    // توليد روابط موقّعة للصور (الحالية والمعلّقة)
    async function signedUrl(path: string | null): Promise<string | null> {
      if (!path || !supabase) return null;
      try {
        const { data, error } = await supabase.storage
          .from("lawyer-avatars")
          .createSignedUrl(path, 60 * 60); // ساعة
        if (error) return null;
        return data?.signedUrl ?? null;
      } catch {
        return null;
      }
    }

    const items = await Promise.all(
      profiles.map(async (p) => ({
        userId: p.userId,
        name: p.user?.name || "بدون اسم",
        email: p.user?.email || "—",
        specialties: p.specialties,
        city: p.city,
        bio: p.bio,
        pendingBio: p.pendingBio,
        currentAvatarUrl: await signedUrl(p.avatarPath),
        pendingAvatarUrl: await signedUrl(p.pendingAvatarPath),
        hasPendingBio: !!p.pendingBio,
        hasPendingAvatar: !!p.pendingAvatarPath,
      }))
    );

    const stats = {
      total: items.length,
      bios: items.filter((i) => i.hasPendingBio).length,
      avatars: items.filter((i) => i.hasPendingAvatar).length,
    };

    return NextResponse.json({ items, stats });
  } catch (e) {
    console.error("GET /api/admin/lawyer-approvals error:", e);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب التعديلات المعلّقة." },
      { status: 500 }
    );
  }
}

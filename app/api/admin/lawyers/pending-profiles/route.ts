// app/api/admin/lawyers/pending-profiles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const profiles = await prisma.lawyerProfile.findMany({
      where: {
        OR: [
          { pendingBio: { not: null } },
          { pendingAvatarPath: { not: null } },
        ],
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    const supabase = getSupabaseAdmin();

    const items = await Promise.all(
      profiles.map(async (p) => {
        let pendingAvatarUrl = "";
        if (p.pendingAvatarPath && supabase) {
          const { data } = await supabase.storage
            .from("lawyer-avatars")
            .createSignedUrl(p.pendingAvatarPath, 60 * 60);
          pendingAvatarUrl = data?.signedUrl || "";
        }
        return {
          id: p.user.id,
          name: p.user.name,
          email: p.user.email,
          pendingBio: p.pendingBio,
          pendingAvatarUrl,
        };
      })
    );

    return NextResponse.json({ items });
  } catch (e) {
    console.error("pending-profiles error:", e);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

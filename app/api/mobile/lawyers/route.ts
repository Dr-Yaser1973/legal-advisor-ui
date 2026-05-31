//app/api/mobile/lawyers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    await verifyUserToken(authHeader.split(" ")[1]);

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const specialization = (searchParams.get("specialization") || "").trim();
    const location = (searchParams.get("location") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(6, Number(searchParams.get("pageSize") || "20")));

    const where: any = {
      role: UserRole.LAWYER,
      isApproved: true,
      branchId: null,
    };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { lawyerProfile: { specialties: { contains: q, mode: "insensitive" } } },
        { lawyerProfile: { city: { contains: q, mode: "insensitive" } } },
      ];
    }
    if (specialization) {
      where.lawyerProfile = {
        ...(where.lawyerProfile || {}),
        specialties: { contains: specialization, mode: "insensitive" },
      };
    }
    if (location) {
      where.lawyerProfile = {
        ...(where.lawyerProfile || {}),
        city: { contains: location, mode: "insensitive" },
      };
    }

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      include: { lawyerProfile: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const supabase = getSupabaseAdmin();

    const items = await Promise.all(
      users.map(async (u) => {
        let avatarUrl = "";
        const avatarPath = u.lawyerProfile?.avatarPath;
        if (avatarPath && supabase) {
          const { data } = await supabase.storage
            .from("lawyer-avatars")
            .createSignedUrl(avatarPath, 60 * 60);
          avatarUrl = data?.signedUrl || "";
        }
        return {
          id: u.id,
          fullName: u.name || "",
          specialization: u.lawyerProfile?.specialties || "",
          bio: u.lawyerProfile?.bio || "",
          location: u.lawyerProfile?.city || "",
          phone: u.lawyerProfile?.phone || "",
          rating: u.lawyerProfile?.rating ?? 0,
          avatarUrl,
          available: true,
        };
      })
    );

    return NextResponse.json({ ok: true, items, total, page, pageSize });
  } catch (e: any) {
    console.error("mobile lawyers error:", e);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب المحامين." }, { status: 500 });
  }
}

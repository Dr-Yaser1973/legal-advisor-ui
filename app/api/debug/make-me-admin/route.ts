 // app/api/debug/make-me-admin/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blockIfProduction, requireUser } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

export async function GET() {
  // ممنوع في الإنتاج
  const env = blockIfProduction();
  if (!env.ok) return env.res;

  // يتطلب تسجيل دخول
  const auth = await requireUser();
  if (!auth.ok) return auth.res;

  try {
    const user = await prisma.user.update({
      where: { id: auth.user.id },
      data: {
        role: UserRole.ADMIN,
        isApproved: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isApproved: true,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "تم ترقيتك إلى ADMIN (وضع التطوير فقط).",
      user,
    });
  } catch (err: any) {
    console.error("make-me-admin error:", err);
    return NextResponse.json(
      { ok: false, message: "فشل ترقية المستخدم." },
      { status: 500 },
    );
  }
}

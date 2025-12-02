 // app/api/admin/users/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 👈 أيضاً هنا نستخدم any لتفادي مشكلة نوع session
  const session: any = await getServerSession(authOptions as any);
  const currentUser: any = session?.user ?? null;

  // 🔐 فقط الأدمن يمكنه الاعتماد
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const userId = Number(params.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json(
      { error: "معرّف مستخدم غير صالح" },
      { status: 400 }
    );
  }

  try {
    // نقرأ الحالة الحالية أولاً
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // لو كان PENDING نفعّله إلى ACTIVE
    const nextStatus =
      existing.status === "PENDING" ? "ACTIVE" : existing.status;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        isApproved: true,
        status: nextStatus,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isApproved: true,
      },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    console.error("[ADMIN_APPROVE_USER]", err);
    return NextResponse.json(
      { error: "تعذر اعتماد المستخدم (تحقق من أنّه موجود)" },
      { status: 500 }
    );
  }
}

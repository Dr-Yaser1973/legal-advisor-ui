 // app/api/admin/users/[id]/points/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addPoints } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

 export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ===============================
    // التحقق من صلاحية الأدمن
    // ===============================
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "هذه العملية للأدمن فقط." }, { status: 403 });
    }

    // ===============================
    // التحقق من المعرف والكمية
    // ===============================
      const { id } = await params;
    const userId = Number(id);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ ok: false, error: "معرف المستخدم غير صالح." }, { status: 400 });
    }

    const body = await req.json();
    const amount = Number(body.amount);
    const reason = String(body.reason || "manual_admin");

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "الكمية يجب أن تكون رقماً أكبر من صفر." },
        { status: 400 }
      );
    }

    // ===============================
    // التحقق من وجود المستخدم
    // ===============================
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ ok: false, error: "المستخدم غير موجود." }, { status: 404 });
    }

    // ===============================
    // إضافة النقاط
    // ===============================
    const { newBalance } = await addPoints(userId, amount, reason);

    return NextResponse.json({ ok: true, newBalance });
  } catch (e: any) {
    console.error("ADMIN_ADD_POINTS_ERROR", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "فشل إضافة النقاط." },
      { status: 500 }
    );
  }
}
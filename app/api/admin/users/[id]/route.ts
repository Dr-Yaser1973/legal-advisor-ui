// app/api/admin/users/[id]/route.ts
// حذف نهائي لحساب مستخدم (ADMIN فقط). يمنع حذف حسابات الأدمن وحذف الذات.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "هذه العملية للأدمن فقط." }, { status: 403 });
    }

    const { id } = await params;
    const userId = Number(id);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ ok: false, error: "معرّف غير صالح." }, { status: 400 });
    }

    // منع حذف الذات
    if (Number(session.user.id) === userId) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك حذف حسابك الخاص." },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!target) {
      return NextResponse.json({ ok: false, error: "المستخدم غير موجود." }, { status: 404 });
    }

    // منع حذف حسابات الأدمن (حماية)
    if (target.role === "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "لا يمكن حذف حساب أدمن من هنا." },
        { status: 400 }
      );
    }

    // حذف نهائي — العلاقات المرتبطة تُحذف بالـ cascade أو تُفرَّغ (SetNull)
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("ADMIN_DELETE_USER_ERROR", e);
    // قد يفشل الحذف إذا وُجدت علاقة تمنعه (FK Restrict)
    return NextResponse.json(
      {
        ok: false,
        error:
          "تعذّر حذف الحساب — قد يكون مرتبطاً بسجلّات لا تسمح بالحذف. جرّب التعطيل بدلاً منه.",
      },
      { status: 500 }
    );
  }
}

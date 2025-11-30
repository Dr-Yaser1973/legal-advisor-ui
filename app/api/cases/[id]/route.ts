 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// دالة مساعدة بسيطة لجلب المستخدم من الجلسة مع فحص الدور
async function getAuthorizedUser() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) {
    return { error: NextResponse.json({ error: "غير مصرح. يرجى تسجيل الدخول." }, { status: 401 }) };
  }

  // نسمح فقط للشركة + المحامي + الأدمن
  if (
    user.role !== "COMPANY" &&
    user.role !== "LAWYER" &&
    user.role !== "ADMIN"
  ) {
    return { error: NextResponse.json({ error: "ليست لديك صلاحية الوصول إلى القضايا." }, { status: 403 }) };
  }

  return { user };
}

// GET /api/cases/[id] → عرض تفاصيل قضية واحدة
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return auth.error;
  const user = auth.user;

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "معرّف غير صالح." }, { status: 400 });
  }

  // حماية على مستوى السجل
  const where: any = { id };

  // الشركة أو المحامي لا يرون إلا قضاياهم
  if (user.role === "COMPANY" || user.role === "LAWYER") {
    where.userId = Number(user.id);
  }
  // الأدمن لا نضيف له userId → يرى أي قضية

  const item = await prisma.case.findFirst({
    where,
    include: {
      events: { orderBy: { date: "desc" } },
      documents: { include: { document: true } },
    },
  });

  if (!item) {
    return NextResponse.json({ error: "غير موجود." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

// PATCH /api/cases/[id] → تعديل بيانات القضية
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthorizedUser();
    if ("error" in auth) return auth.error;
    const user = auth.user;

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "معرّف غير صالح." }, { status: 400 });
    }

    const data = await req.json();

    if (data.filingDate) data.filingDate = new Date(data.filingDate);
    if (data.closingDate) data.closingDate = new Date(data.closingDate);

    // نبني شرط where حسب الدور
    const where: any = { id };

    // الشركة أو المحامي لا يستطيعان تعديل إلا قضاياهما
    if (user.role === "COMPANY" || user.role === "LAWYER") {
      where.userId = Number(user.id);
    }
    // الأدمن يستطيع تعديل أي قضية

    const updated = await prisma.case.update({
      where,
      data,
    });

    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "خطأ في الخادم." }, { status: 500 });
  }
}

// DELETE /api/cases/[id] → حذف قضية
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthorizedUser();
    if ("error" in auth) return auth.error;
    const user = auth.user;

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "معرّف غير صالح." }, { status: 400 });
    }

    // نحاول الحذف مع احترام قيود الدور
    const where: any = { id };

    if (user.role === "COMPANY" || user.role === "LAWYER") {
      where.userId = Number(user.id);
    }
    // الأدمن يستطيع الحذف لأي قضية

    await prisma.case.delete({ where });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);

    // إذا كانت المشكلة أن القضية غير موجودة أو لا تخص هذا المستخدم
    return NextResponse.json(
      { error: e.message || "تعذر حذف القضية." },
      { status: 500 }
    );
  }
}

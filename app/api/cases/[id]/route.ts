 // app/api/cases/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCaseAccess, canDeleteCase } from "@/lib/caseAccess";

export const runtime = "nodejs";

async function getAuthorizedUser() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) {
    return { error: NextResponse.json({ error: "غير مصرح. يرجى تسجيل الدخول." }, { status: 401 }) };
  }

  if (
    user.role !== "COMPANY" &&
    user.role !== "LAWYER" &&
    user.role !== "LAW_FIRM" &&
    user.role !== "ADMIN"
  ) {
    return { error: NextResponse.json({ error: "ليست لديك صلاحية الوصول إلى القضايا." }, { status: 403 }) };
  }

  return { user };
}

// GET /api/cases/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return auth.error;
  const user = auth.user;

  const { id: idStr } = await params;
  const id = Number(idStr);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "معرّف غير صالح." }, { status: 400 });
  }

  const item = await prisma.case.findUnique({
    where: { id },
    include: {
      events: { orderBy: { date: "desc" } },
      documents: { include: { document: true } },
    },
  });

  if (!item) {
    return NextResponse.json({ error: "غير موجود." }, { status: 404 });
  }

  const access = await getCaseAccess(
    Number(user.id),
    user.role === "ADMIN",
    item
  );
  if (access === "NONE") {
    return NextResponse.json({ error: "لا تملك صلاحية الوصول لهذه القضية." }, { status: 403 });
  }

  return NextResponse.json({ item, access });
}

// PATCH /api/cases/[id]
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthorizedUser();
    if ("error" in auth) return auth.error;
    const user = auth.user;

    const { id: idStr } = await params;
    const id = Number(idStr);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "معرّف غير صالح." }, { status: 400 });
    }

    const existing = await prisma.case.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "غير موجود." }, { status: 404 });
    }

    const access = await getCaseAccess(Number(user.id), user.role === "ADMIN", existing);
    if (access !== "WRITE") {
      return NextResponse.json({ error: "لا تملك صلاحية تعديل هذه القضية." }, { status: 403 });
    }

    const data = await req.json();
    if (data.filingDate) data.filingDate = new Date(data.filingDate);
    if (data.closingDate) data.closingDate = new Date(data.closingDate);

    delete data.userId;
    delete data.orgId;
    delete data.branchId;

    const updated = await prisma.case.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "خطأ في الخادم." }, { status: 500 });
  }
}

// DELETE /api/cases/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthorizedUser();
    if ("error" in auth) return auth.error;
    const user = auth.user;

    const { id: idStr } = await params;
    const id = Number(idStr);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "معرّف غير صالح." }, { status: 400 });
    }

    const existing = await prisma.case.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "غير موجود." }, { status: 404 });
    }

    const allowed = await canDeleteCase(Number(user.id), user.role === "ADMIN", existing);
    if (!allowed) {
      return NextResponse.json({ error: "صلاحية الحذف مقصورة على مالك المنظمة أو الإدارة." }, { status: 403 });
    }

    await prisma.case.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "تعذر حذف القضية." }, { status: 500 });
  }
}
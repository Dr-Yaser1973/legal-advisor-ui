 // app/api/cases/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildCaseListFilter } from "@/lib/caseAccess";

export const runtime = "nodejs";

async function getAuthorizedUser() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) {
    return { error: NextResponse.json({ error: "غير مصرح. يرجى تسجيل الدخول." }, { status: 401 }) };
  }
  if (user.role !== "COMPANY" && user.role !== "LAWYER" && user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "ليست لديك صلاحية الوصول إلى القضايا." }, { status: 403 }) };
  }
  return { user };
}

// GET /api/cases → قائمة القضايا (مالك + مكلّف)
export async function GET(req: Request) {
  try {
    const auth = await getAuthorizedUser();
    if ("error" in auth) return auth.error;
    const user = auth.user;

    const userId = Number(user.id);
    const isPlatformAdmin = user.role === "ADMIN";

    const { searchParams } = new URL(req.url);
    const q        = (searchParams.get("q") || "").trim();
    const status   = (searchParams.get("status") || "").trim();
    const type     = (searchParams.get("type") || "").trim();
    const page     = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(6, Number(searchParams.get("pageSize") || "12")));

    // فلتر الصلاحيات — استدعاء واحد (قضاياه كمالك + المكلّف بها)
    const accessFilter = await buildCaseListFilter(userId, isPlatformAdmin);

    const where: any = { ...accessFilter };
    if (status) where.status = status;
    if (type)   where.type = type;
    if (q) {
      // ندمج البحث مع فلتر الصلاحيات عبر AND حتى لا يتجاوزه
      where.AND = [
        {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { court: { contains: q, mode: "insensitive" } },
          ],
        },
      ];
    }

    const total = await prisma.case.count({ where });

    const items = await prisma.case.findMany({
      where,
      include: {
        assigned: { select: { id: true, name: true, image: true } },
        _count:   { select: { events: true, documents: true, assignments: true } },
      },
      orderBy: { filingDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ items, total, page, pageSize });
  } catch (e: any) {
    console.error("GET /api/cases error:", e);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب القضايا." }, { status: 500 });
  }
}

// POST /api/cases → إنشاء قضية
export async function POST(req: Request) {
  try {
    const auth = await getAuthorizedUser();
    if ("error" in auth) return auth.error;
    const user = auth.user;

    const userId = Number(user.id);

    const body = await req.json();
    const {
      title, description, type, court, status,
      filingDate, closingDate, parties, notes,
    } = body || {};

    if (!title || !type || !court || !status || !filingDate) {
      return NextResponse.json(
        { error: "العنوان والنوع والمحكمة والحالة وتاريخ القيد مطلوبة." },
        { status: 400 }
      );
    }

    const created = await prisma.case.create({
      data: {
        title,
        description: description || "",
        type,
        court,
        status,
        filingDate: new Date(filingDate),
        closingDate: closingDate ? new Date(closingDate) : null,
        parties: parties ?? {},
        notes: notes || null,
        userId, // المنشئ = مالك القضية
      },
    });

    return NextResponse.json({ ok: true, case: created });
  } catch (e: any) {
    console.error("POST /api/cases error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ أثناء إنشاء القضية." }, { status: 500 });
  }
}
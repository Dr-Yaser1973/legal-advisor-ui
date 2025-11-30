
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET: ?q=&specialization=&location=&available=true&page=1&pageSize=12
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const specialization = (searchParams.get("specialization") || "").trim();
  const location = (searchParams.get("location") || "").trim();
  const available = searchParams.get("available");
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageSize = Math.min(50, Math.max(6, Number(searchParams.get("pageSize") || "12")));

  const where: any = {};
  if (q) {
    where.OR = [
      { fullName: { contains: q } },
      { bio: { contains: q } },
      { specialization: { contains: q } },
      { location: { contains: q } },
    ];
  }
  if (specialization) where.specialization = { contains: specialization };
  if (location) where.location = { contains: location };
  if (available === "true") where.available = true;
  if (available === "false") where.available = false;

  const [items, total] = await Promise.all([
    prisma.lawyer.findMany({
      where,
      orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lawyer.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST: إنشاء محامٍ
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, specialization, phone, bio, experience, location, avatarUrl, available } = body || {};
    if (!fullName || !email || !specialization) {
      return NextResponse.json({ error: "الاسم والبريد والاختصاص مطلوبة." }, { status: 400 });
    }
    const created = await prisma.lawyer.create({
      data: { fullName, email, specialization, phone, bio, experience, location, avatarUrl, available },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

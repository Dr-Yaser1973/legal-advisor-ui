// app/api/admin/stats/contracts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const now = new Date();
  const start7 = new Date(now);
  start7.setDate(start7.getDate() - 7);

  const start30 = new Date(now);
  start30.setDate(start30.getDate() - 30);

  // إجماليات سريعة
  const [total, last7, last30] = await Promise.all([
    prisma.generatedContract.count(),
    prisma.generatedContract.count({ where: { createdAt: { gte: start7 } } }),
    prisma.generatedContract.count({ where: { createdAt: { gte: start30 } } }),
  ]);

  // Top templates (آخر 30 يوم) - groupBy على templateId
    const topByTemplate = await prisma.generatedContract.groupBy({
  by: ["templateId"],
  where: { createdAt: { gte: start30 } },  // آخر 30 يوم مثلاً
  _count: { id: true },                   // ✅ بدل _all
  orderBy: { _count: { id: "desc" } },    // ✅ بدل _all
  take: 10,
});



  const templateIds = topByTemplate
    .map((x) => x.templateId)
    .filter((x): x is number => typeof x === "number");

  const templates = templateIds.length
    ? await prisma.contractTemplate.findMany({
        where: { id: { in: templateIds } },
        select: { id: true, slug: true, title: true, language: true },
      })
    : [];

  const templatesMap = new Map(templates.map((t) => [t.id, t]));

  const topTemplates = topByTemplate.map((x) => {
    const tpl = x.templateId ? templatesMap.get(x.templateId) : null;
    return {
      templateId: x.templateId,
      count: x._count.id,
      template: tpl
        ? { slug: tpl.slug, title: tpl.title, language: tpl.language }
        : null,
    };
  });

  // سلسلة زمنية يومية (Postgres) آخر 30 يوم
  // ملاحظة: هذا يعتمد على اسم الجدول في Postgres (عادة "GeneratedContract")
  const daily = await prisma.$queryRaw<
    { day: string; count: number }[]
  >`
    SELECT
      to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as day,
      COUNT(*)::int as count
    FROM "GeneratedContract"
    WHERE "createdAt" >= ${start30}
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  return NextResponse.json({
    ok: true,
    totals: { total, last7, last30 },
    topTemplates,
    daily,
  });
}


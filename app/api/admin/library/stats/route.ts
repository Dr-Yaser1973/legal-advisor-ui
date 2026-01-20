 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json(
      { ok: false, error: "غير مصرح" },
      { status: 403 }
    );
  }

  try {
    // ===============================
    // الاستعلامات الأساسية (متوازية)
    // ===============================
    const [
      totalUnits,
      totalDocs,
      totalUsers,
      topViewed,
      reindexCount,
    ] = await Promise.all([
      prisma.lawUnit.count(),
      prisma.legalDocument.count(),
      prisma.user.count(),

      // أكثر مادة تم فتحها
       prisma.auditLog.groupBy({
  by: ["meta"],
  where: { action: "LIBRARY_VIEW" },
  _count: { meta: true },          // ✅ عدّ حسب meta
  orderBy: { _count: { meta: "desc" } }, // ✅ ترتيب صحيح
  take: 1,
}),


      prisma.auditLog.count({
        where: { action: "REINDEX_LAW_UNIT" },
      }),
    ]);

    // ===============================
    // مستخدمون مسجّلون استخدموا المكتبة
    // ===============================
    const registeredUsers = await prisma.auditLog.findMany({
      where: {
        action: "LIBRARY_VIEW",
        NOT: { userId: null },
      },
      distinct: ["userId"],
      select: { userId: true },
    });

    // ===============================
    // زوار مجهولون (حسب anonId في meta)
    // ===============================
    const anonUsers = await prisma.auditLog.findMany({
      where: {
        action: "LIBRARY_VIEW",
      },
      select: { meta: true },
    });

    const anonCount = new Set(
      anonUsers
        .map((r) => (r.meta as any)?.anonId)
        .filter(Boolean)
    ).size;

    return NextResponse.json({
      ok: true,
      stats: {
        totalUnits,
        totalDocs,
        totalUsers,

        libraryUsers: registeredUsers.length, // مستخدمون مسجّلون
        anonUsers: anonCount,                 // زوار مجهولون
        totalLibraryUsers:
          registeredUsers.length + anonCount,

        topViewed: topViewed[0] || null,
        reindexCount,
      },
    });
  } catch (err) {
    console.error("ADMIN LIBRARY STATS ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "فشل تحميل الإحصائيات" },
      { status: 500 }
    );
  }
}

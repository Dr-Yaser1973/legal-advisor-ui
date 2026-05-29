import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyUserToken(token);
    const userId = Number(payload.sub);

    // جلب الإحصائيات الثلاثة معاً
 const [consultations, contracts, translations] = await Promise.all([
  prisma.consultation.count({ where: { userId } }),
  prisma.generatedContract.count({ where: { createdById: userId } }),
  prisma.translationRequest.count({ where: { clientId: userId } }),
]);

    return NextResponse.json({
      consultations,
      contracts,
      translations,
    });

  } catch (error) {
    console.error("Mobile stats error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

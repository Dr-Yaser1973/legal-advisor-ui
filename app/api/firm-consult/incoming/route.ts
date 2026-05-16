// app/api/firm-consult/incoming/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const runtime = "nodejs";

// GET: الطلبات الواردة للمكتب (للمحامين داخل الفرع)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const userId = Number(session.user.id);

    // جلب بيانات المستخدم مع الفرع والمؤسسة
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        branch: {
          include: { org: { select: { id: true, name: true } } },
        },
      },
    });

    if (!user?.branch) {
      return NextResponse.json({ error: "أنت لست مرتبطاً بأي فرع مؤسسة." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(6, Number(searchParams.get("pageSize") || "10")));

    const where: any = {
      orgId: user.branch.orgId,
      branchId: user.branchId,
    };
    if (status) where.status = status;

    const total = await prisma.firmConsultRequest.count({ where });

    const requests = await prisma.firmConsultRequest.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true, phone: true } },
        branch: { select: { id: true, name: true, city: true } },
        offer: true,
        documents: {
          include: {
            document: { select: { id: true, title: true, filePath: true, mimetype: true } },
          },
        },
        chatRoom: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ requests, total, page, pageSize });
  } catch (e: any) {
    console.error("GET /api/firm-consult/incoming error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}


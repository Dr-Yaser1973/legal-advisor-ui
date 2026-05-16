// app/api/firm-consult/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const runtime = "nodejs";

// GET: طلبات العميل للمكاتب
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const userId = Number(session.user.id);

    const requests = await prisma.firmConsultRequest.findMany({
      where: { clientId: userId },
      include: {
        org: { select: { id: true, name: true, logo: true, type: true } },
        branch: { select: { id: true, name: true, city: true } },
        offer: true,
        documents: {
          include: {
            document: { select: { id: true, title: true, filePath: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (e: any) {
    console.error("GET /api/firm-consult error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}

// POST: إنشاء طلب استشارة لمكتب معتمد
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const userId = Number(session.user.id);
    const body = await req.json();
    const { orgId, branchId, subject, details, documentIds } = body || {};

    if (!orgId || !subject || !details) {
      return NextResponse.json(
        { error: "المؤسسة وموضوع الاستشارة والتفاصيل مطلوبة." },
        { status: 400 }
      );
    }

    // تحقق من وجود المؤسسة
    const org = await prisma.organization.findUnique({
      where: { id: Number(orgId), isApproved: true, isActive: true },
    });
    if (!org) return NextResponse.json({ error: "المؤسسة غير موجودة." }, { status: 404 });

    // إنشاء الطلب
    const request = await prisma.firmConsultRequest.create({
      data: {
        clientId: userId,
        orgId: Number(orgId),
        branchId: branchId ? Number(branchId) : null,
        subject,
        details,
        documents: documentIds?.length
          ? {
              create: documentIds.map((docId: number) => ({
                documentId: docId,
              })),
            }
          : undefined,
      },
      include: {
        org: { select: { id: true, name: true, logo: true } },
        branch: { select: { id: true, name: true, city: true } },
        documents: true,
      },
    });

    // إشعار للمسؤولين في المؤسسة
    const orgUsers = await prisma.user.findMany({
      where: { branchId: branchId ? Number(branchId) : undefined, role: "LAWYER" },
      select: { id: true },
    });

    if (orgUsers.length > 0) {
      await prisma.notification.createMany({
        data: orgUsers.map((u) => ({
          userId: u.id,
          title: "طلب استشارة جديد",
          body: `طلب استشارة جديد بعنوان: ${subject}`,
        })),
      });
    }

    return NextResponse.json({ ok: true, request });
  } catch (e: any) {
    console.error("POST /api/firm-consult error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}


// app/api/my-assignments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // ── القضايا المكلّف بها ──
    const caseAssignments = await prisma.caseAssignment.findMany({
      where: { userId },
      include: {
        case: {
          select: {
            id: true,
            title: true,
            type: true,
            court: true,
            status: true,
            filingDate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const cases = caseAssignments
      .filter((a) => a.case)
      .map((a) => ({
        assignmentRole: a.role, // LEAD | ASSISTANT
        id: a.case!.id,
        title: a.case!.title,
        type: a.case!.type,
        court: a.case!.court,
        status: a.case!.status,
        filingDate: a.case!.filingDate,
      }));

    // ── الاستشارات المكلّف بها ──
    const consultRequests = await prisma.firmConsultRequest.findMany({
      where: { assignedTo: userId },
      select: {
        id: true,
        subject: true,
        status: true,
        createdAt: true,
        client: { select: { name: true, email: true } },
        offer: { select: { fee: true, currency: true } },
        chatRoom: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const consults = consultRequests.map((c) => ({
      id: c.id,
      subject: c.subject,
      status: c.status,
      createdAt: c.createdAt,
      clientName: c.client?.name || c.client?.email || "عميل",
      chatRoomId: c.chatRoom?.id ?? null,
    }));

    return NextResponse.json({
      cases,
      consults,
      counts: {
        total: cases.length + consults.length,
        lead: cases.filter((c) => c.assignmentRole === "LEAD").length,
        assistant: cases.filter((c) => c.assignmentRole === "ASSISTANT").length,
        consults: consults.length,
      },
    });
  } catch (e: any) {
    console.error("GET /api/my-assignments error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}

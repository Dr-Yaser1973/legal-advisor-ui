import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// ===============================
// GET: جلب الأسئلة
// ===============================
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const docId = Number(id);

    if (!Number.isInteger(docId)) {
      return NextResponse.json(
        { ok: false, error: "Bad id" },
        { status: 400 }
      );
    }

    const faqs = await prisma.lawDocFaq.findMany({
      where: { docId },
      orderBy: { id: "desc" },
      select: {
        id: true,
        question: true,
        answer: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      faqs,
    });
  } catch (err) {
    console.error("FAQ GET ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load FAQ" },
      { status: 500 }
    );
  }
}

// ===============================
// POST: إضافة سؤال (ADMIN فقط)
// ===============================
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const role = session?.user?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مخول" },
        { status: 403 }
      );
    }

    const { id } = await ctx.params;
    const docId = Number(id);

    if (!Number.isInteger(docId)) {
      return NextResponse.json(
        { ok: false, error: "Bad id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const question = String(body?.question || "").trim();
    const answer = String(body?.answer || "").trim();

    if (!question || !answer) {
      return NextResponse.json(
        { ok: false, error: "السؤال والإجابة مطلوبان" },
        { status: 400 }
      );
    }

    const faq = await prisma.lawDocFaq.create({
      data: {
        docId,
        question,
        answer,
      },
    });

    return NextResponse.json({
      ok: true,
      faq,
    });
  } catch (err) {
    console.error("FAQ POST ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}


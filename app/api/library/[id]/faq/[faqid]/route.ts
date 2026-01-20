import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// ===============================
// PUT: تعديل
// ===============================
export async function PUT(
  req: Request,
  ctx: { params: Promise<{ faqId: string }> }
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

    const { faqId } = await ctx.params;
    const id = Number(faqId);

    if (!Number.isInteger(id)) {
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

    const faq = await prisma.lawDocFaq.update({
      where: { id },
      data: { question, answer },
    });

    return NextResponse.json({
      ok: true,
      faq,
    });
  } catch (err) {
    console.error("FAQ PUT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// ===============================
// DELETE: حذف
// ===============================
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ faqId: string }> }
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

    const { faqId } = await ctx.params;
    const id = Number(faqId);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { ok: false, error: "Bad id" },
        { status: 400 }
      );
    }

    await prisma.lawDocFaq.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (err) {
    console.error("FAQ DELETE ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}


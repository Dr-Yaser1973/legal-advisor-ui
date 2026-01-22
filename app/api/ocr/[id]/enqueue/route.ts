import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { OCRStatus, UserRole } from "@prisma/client";

export const runtime = "nodejs";

function isAdmin(session: any) {
  return session?.user?.role === UserRole.ADMIN;
}

// POST /api/ocr/:id/enqueue  body?: { language?: "ar"|"en"|"ar+en", force?: boolean }
export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!isAdmin(session)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(ctx.params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const language = (body?.language as string | undefined) || undefined;
    const force = Boolean(body?.force);

    const doc = await prisma.legalDocument.findUnique({ where: { id } });
    if (!doc) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    // لو ليس force: لا تعيد enqueue إذا PROCESSING
    if (!force && doc.ocrStatus === OCRStatus.PROCESSING) {
      return NextResponse.json({ ok: false, error: "Already processing" }, { status: 409 });
    }

    const updated = await prisma.legalDocument.update({
      where: { id },
      data: {
        ocrStatus: OCRStatus.PENDING,
        ocrLanguage: language ?? doc.ocrLanguage ?? "ar",
        // خيار: مسح النص السابق عند إعادة المحاولة
        // extractedText: null,
        // textPath: null,
      },
      select: {
        id: true,
        ocrStatus: true,
        ocrLanguage: true,
        updatedAt: true,
      },
    });

    // هنا لاحقًا: ندفع Job فعلي للـ Worker/Queue
    // مثلا: await enqueueOcrJob({ documentId: id })

    return NextResponse.json({ ok: true, doc: updated });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}


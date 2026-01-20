 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDocRelations } from "@/lib/library/relations";
import { cookies, headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

export const runtime = "nodejs";

/* ===============================
   Helper: بناء رابط PDF من Supabase
================================ */
function buildPdfUrl(filename: string | null) {
  const base =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  if (!base || !filename) return null;

  // إزالة أي / في نهاية الرابط الأساسي
  const cleanBase = base.replace(/\/$/, "");

  // filename يجب أن يكون مثل: laws/abc123.pdf
  return `${cleanBase}/storage/v1/object/public/library/${filename}`;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    // ===============================
    // 0) الجلسة (قد تكون null لأن المكتبة عامة)
    // ===============================
    const session = (await getServerSession(
      authOptions as any
    )) as any;

    // ===============================
    // فك الـ params (Next 16 يعيد Promise)
    // ===============================
    const { id: idParam } = await ctx.params;
    const id = Number(idParam);

    // ===============================
    // تحقق صارم
    // ===============================
    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { ok: false, error: "Bad id" },
        { status: 400 }
      );
    }

    // ===============================
    // 1) جلب LawUnit + الوثائق المرتبطة
    // ===============================
    const unit = await prisma.lawUnit.findUnique({
      where: { id },
      include: {
        documents: {
          include: {
            document: {
              select: {
                id: true,
                filename: true, // مثال: laws/abc123.pdf
              },
            },
          },
        },
      },
    });

    if (!unit) {
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    }

    // ===============================
    // 2) بناء رابط PDF من Supabase
    // ===============================
    const firstDoc = unit.documents[0]?.document || null;
    const pdfUrl = buildPdfUrl(firstDoc?.filename || null);

    // ===============================
    // 3) العلاقات القانونية
    // ===============================
    const relations = await getDocRelations(unit.id);

    // ===============================
    // 4) الأسئلة الشائعة
    // ===============================
    const faqs = await prisma.lawDocFaq.findMany({
      where: { docId: unit.id },
      orderBy: { id: "desc" },
      select: {
        id: true,
        question: true,
        answer: true,
        createdAt: true,
      },
    });

    // ===============================
    // 5) تسجيل استخدام المكتبة
    // (مستخدم مسجّل أو زائر مجهول)
    // ===============================
    try {
      const cookieStore = await cookies();
      const headerStore = await headers();

      let anonId = cookieStore.get("anon_id")?.value;

      if (!anonId) {
        anonId = crypto.randomUUID();
        cookieStore.set("anon_id", anonId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // سنة
        });
      }

      const ip =
        headerStore.get("x-forwarded-for")?.split(",")[0] ||
        headerStore.get("x-real-ip") ||
        null;

      const ua = headerStore.get("user-agent") || null;

      await prisma.auditLog.create({
        data: {
          userId: session?.user?.id
            ? Number(session.user.id)
            : null,
          action: "LIBRARY_VIEW",
          meta: {
            lawUnitId: unit.id,
            anonId,
            ip,
            ua,
          },
        },
      });
    } catch (e) {
      console.warn("LIBRARY VIEW LOG WARNING:", e);
    }

    // ===============================
    // 6) الرد النهائي
    // ===============================
    return NextResponse.json({
      ok: true,
      doc: {
        id: unit.id,
        title: unit.title,
        category: unit.category,
        content: unit.content,
        simplified: unit.simplified,
        practicalUse: unit.practicalUse,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt,
        pdfUrl, // 🔗 رابط PDF المبني من Supabase
      },
      relations,
      faqs,
    });
  } catch (err) {
    console.error("LIBRARY VIEW ERROR:", err);

    return NextResponse.json(
      { ok: false, error: "Failed to load law unit" },
      { status: 500 }
    );
  }
}

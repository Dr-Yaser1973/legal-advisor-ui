 // app/api/cases/[id]/memo-text/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chatCompletion } from "@/lib/ai";
import { requireCaseAccess } from "@/lib/auth/guards";
 import { canPerformAction, consumePoints, logAiUsage } from "@/lib/plans";


export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = Number(idStr);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { error: "معرّف القضية غير صالح." },
        { status: 400 }
      );
    }

    // ===============================
    // التحقق من الصلاحية
    // ===============================
    const auth = await requireCaseAccess(id);
    if (!auth.ok) return auth.res;

    const userId = Number(auth.user.id);

    // ===============================
    // التحقق من الباقة والنقاط
    // ===============================
    const { allowed, reason } = await canPerformAction(userId, "AI_CONSULT");
    if (!allowed) {
      return NextResponse.json(
        { error: reason, upgradeRequired: true },
        { status: 403 }
      );
    }

    // ===============================
    // جلب القضية
    // ===============================
    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) {
      return NextResponse.json(
        { error: "القضية غير موجودة" },
        { status: 404 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as { tone?: string };
    const tone = (body.tone || "professional").toString();

    // ===============================
    // توليد المذكرة عبر chatCompletion
    // ===============================
    const completion = await chatCompletion([
      {
        role: "system",
        content: `أنت محامٍ عراقي متخصص تجيد الصياغة القانونية بالعربية الفصحى.
دقيق، مهني، مباشر. لا تضف حشواً أو مقدمات غير ضرورية.
نبرة الكتابة المطلوبة: ${tone}.`,
      },
      {
        role: "user",
        content: `اكتب مذكرة قانونية نصية للقضية التالية مع توصيات عملية.

العنوان: ${c.title ?? ""}
الوصف: ${c.description ?? ""}
الأطراف: ${JSON.stringify(c.parties ?? {}, null, 2)}

المطلوب: مذكرة منظمة تشمل: الوقائع، الأساس القانوني، التحليل، الطلبات.`,
      },
    ]);

    const memo = completion?.choices?.[0]?.message?.content?.trim() || "";

    if (!memo) {
      return NextResponse.json(
        { error: "تعذر توليد النص." },
        { status: 500 }
      );
    }

    // ===============================
    // استهلاك النقاط بعد النجاح
    // ===============================
      try {
      await logAiUsage(userId, "AI_CONSULT");
      await consumePoints(userId, "AI_CONSULT");
    } catch (err) {
      console.error("Points consumption error:", err);
    }

    // ===============================
    // حفظ المذكرة كحدث في القضية
    // ===============================
    await prisma.caseEvent.create({
      data: {
        caseId: id,
        title: "مذكرة AI (نص)",
        note: memo,
        date: new Date(),
      },
    });

    return NextResponse.json({ ok: true, memo });
  } catch (e: any) {
    console.error("memo-text error:", e);
    return NextResponse.json(
      { error: e?.message || "فشل توليد النص." },
      { status: 500 }
    );
  }
}

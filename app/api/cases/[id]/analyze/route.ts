 // app/api/cases/[id]/analyze/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAnswer } from "@/lib/ai";
import { requireCaseAccess } from "@/lib/auth/guards";
import { consumePoints, getUserPlanData } from "@/lib/plans";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = Number(idStr);

    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "معرّف القضية غير صالح." }, { status: 400 });
    }

    const auth = await requireCaseAccess(id);
    if (!auth.ok) return auth.res;

    const userId = Number(auth.user.id);

    // ===============================
    // فحص صلاحية إدارة القضايا (محجوبة عن FREE)
    // ===============================
    const planData = await getUserPlanData(userId);
    if (!planData?.permissions.caseManagement) {
      return NextResponse.json(
        {
          error: "إدارة القضايا غير متاحة في باقتك. يرجى الترقية.",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // ===============================
    // جلب القضية أولاً (نتأكد من وجودها قبل أي استهلاك)
    // ===============================
    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) {
      return NextResponse.json({ error: "القضية غير موجودة." }, { status: 404 });
    }

    // ===============================
    // الاستهلاك أولاً: يفحص الحد ويخصم ويسجّل ذرّياً.
    // إن فشل، لا يصل المستخدم إلى الـ AI إطلاقاً.
    // ===============================
    try {
      await consumePoints(userId, "AI_CONSULT");
    } catch (err) {
      const reason =
        err instanceof Error ? err.message : "غير مسموح بهذه العملية.";
      return NextResponse.json(
        { error: reason, upgradeRequired: true },
        { status: 403 }
      );
    }

    // ===============================
    // تحليل القضية بـ GPT (بعد تأكيد الاستهلاك)
    // ===============================
    const contextText = [
      `عنوان القضية: ${c.title ?? ""}`,
      `الأطراف: ${JSON.stringify(c.parties ?? {}, null, 2)}`,
      `الوصف: ${c.description ?? ""}`,
    ].join("\n");

    const answer = await generateAnswer(
      "حلّل هذه القضية قانونيًا وقدّم توصيات عملية مختصرة.",
      contextText
    );

    // ===============================
    // حفظ نتيجة التحليل في حقل القضية المخصّص (لا كحدث — كي لا يلوّث الخط الزمني)
    // ===============================
    await prisma.case.update({
      where: { id },
      data: {
        aiAnalysis: { text: answer, generatedAt: new Date().toISOString() },
      },
    });

    return NextResponse.json({ ok: true, answer });
  } catch (e: any) {
    console.error("case analyze error:", e);
    return NextResponse.json(
      { error: e?.message || "فشل تحليل القضية." },
      { status: 500 }
    );
  }
}
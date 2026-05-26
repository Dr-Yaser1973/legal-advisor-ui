 // app/api/translation/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { chatCompletion } from "@/lib/ai";
 import { canPerformAction, consumePoints, hasPermission, getUserPlanData, logAiUsage } from "@/lib/plans";

export const runtime = "nodejs";

// ===============================
// Supported Languages
// ===============================
type Lang = "AR" | "EN" | "FR" | "TR" | "FA";

const LANG_LABEL: Record<Lang, string> = {
  AR: "العربية",
  EN: "الإنجليزية",
  FR: "الفرنسية",
  TR: "التركية",
  FA: "الفارسية",
};

export async function POST(req: NextRequest) {
  try {
    // ===============================
    // التحقق من تسجيل الدخول
    // ===============================
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول لاستخدام خدمة الترجمة." },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    // ===============================
    // التحقق من الباقة والنقاط
    // ===============================
    const planData = await getUserPlanData(userId);
    if (!planData) {
      return NextResponse.json(
        { ok: false, error: "تعذر التحقق من بيانات الاشتراك." },
        { status: 500 }
      );
    }

    if (!hasPermission(planData.effectivePlan, "aiTranslation")) {
      return NextResponse.json(
        {
          ok: false,
          error: "الترجمة الذكية غير متاحة في باقتك الحالية. يرجى الترقية إلى باقة الأفراد أو أعلى.",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    const { allowed, reason } = await canPerformAction(userId, "AI_TRANSLATION");
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: reason, upgradeRequired: true },
        { status: 403 }
      );
    }

    // ===============================
    // قراءة البيانات
    // ===============================
    const body = await req.json();

    const text: string = body.text;
    const fromLang: Lang = ["AR", "EN", "FR", "TR", "FA"].includes(body.fromLang)
      ? body.fromLang
      : "AR";
    const toLang: Lang = ["AR", "EN", "FR", "TR", "FA"].includes(body.toLang)
      ? body.toLang
      : "EN";
    const mode: string = body.mode || "formal";

    if (!text || !text.trim()) {
      return NextResponse.json(
        { ok: false, error: "لا يوجد نص للترجمة" },
        { status: 400 }
      );
    }

    // ===============================
    // أسلوب الترجمة
    // ===============================
    const style =
      mode === "simple"
        ? "بأسلوب مبسط وواضح لغير المختصين"
        : mode === "free"
        ? "مع إمكانية إعادة الصياغة لتحسين الأسلوب"
        : mode === "review"
        ? "بدقة عالية جدًا مع تدقيق قانوني شديد دون فقدان أي معنى"
        : "بدقة عالية بأسلوب قانوني رسمي دون شرح أو تعليقات إضافية";

    const systemPrompt =
      fromLang === "AR"
        ? `أنت مترجم قانوني محترف. ترجم النص التالي من ${LANG_LABEL[fromLang]} إلى ${LANG_LABEL[toLang]} ${style}.`
        : `You are a professional legal translator. Translate the following text from ${LANG_LABEL[fromLang]} to ${LANG_LABEL[toLang]} ${style}.`;

    // ===============================
    // استدعاء GPT-5.5
    // ===============================
    const completion = await chatCompletion([
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ]);

    const translated = completion.choices[0]?.message?.content?.toString() || "";

    // ===============================
    // استهلاك النقاط بعد النجاح
    // ===============================
    try {
  await logAiUsage(userId, "AI_TRANSLATION");  // ← أضف هذا السطر
  await consumePoints(userId, "AI_TRANSLATION");
} catch (err) {
  console.error("Points consumption error:", err);
}

    return NextResponse.json({ ok: true, translated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "فشل تنفيذ الترجمة الذكية" },
      { status: 500 }
    );
  }
}
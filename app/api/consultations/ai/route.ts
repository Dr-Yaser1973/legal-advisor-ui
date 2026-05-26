 // app/api/consultations/ai/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { chatCompletion } from "@/lib/ai";
 import { canPerformAction, consumePoints, logAiUsage } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول لاستخدام خدمة الاستشارة." },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

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
    // قراءة السؤال
    // ===============================
    const body = await req.json().catch(() => null);

    let rawQuestion: unknown =
      (body && (body as any).question) ??
      (body && (body as any).description) ??
      (body && (body as any).title) ??
      "";

    if (rawQuestion == null) rawQuestion = "";

    const question = String(rawQuestion).trim();

    if (!question) {
      return NextResponse.json(
        { error: "يرجى إدخال نص واضح للاستشارة." },
        { status: 400 }
      );
    }

    // ===============================
    // إنشاء الاستشارة في قاعدة البيانات
    // ===============================
    const title = question.split(/\s+/).slice(0, 10).join(" ");

    const created = await prisma.consultation.create({
      data: {
        userId,
        title,
        description: question,
      },
    });

    // ===============================
    // استدعاء GPT-5.5
    // ===============================
    let answerText =
      "عذراً، تعذر الحصول على إجابة في الوقت الحالي. يرجى المحاولة لاحقًا.";

    try {
      const completion = await chatCompletion([
        {
          role: "system",
          content: `# الدور
أنت مستشار قانوني عراقي متخصص. مهمتك الإجابة على الأسئلة القانونية بأسلوب عربي واضح ومبسط.

# الشخصية
كن مباشراً ومهنياً. استخدم اللغة العربية القانونية المبسطة. لا تضف مقدمات غير ضرورية.

# معايير النجاح
- إجابة واضحة ومباشرة على السؤال
- استناد للقانون العراقي حيثما أمكن
- توصيات عملية قابلة للتنفيذ
- لا تتجاوز 300 كلمة

# تنبيه مهم
أوضح دائماً في نهاية إجابتك أن هذه الاستشارة لا تغني عن استشارة محامٍ بشري متخصص.

# قواعد التوقف
إذا كان السؤال خارج نطاق القانون، وضّح ذلك بدلاً من التخمين.`,
        },
        {
          role: "user",
          content: `# السؤال القانوني\n${question}\n\n# المطلوب\nأجب بشكل مباشر ومنظم:\n1. الإجابة القانونية\n2. الأساس القانوني (إن وجد)\n3. التوصية العملية`,
        },
      ]);

      const content = completion?.choices?.[0]?.message?.content;
      if (content && typeof content === "string") {
        answerText = content.trim();
      }
    } catch (err) {
      console.error("OpenAI error:", err);
    }

    // ===============================
    // استهلاك النقاط بعد نجاح الاستشارة
    // ===============================
     try {
  await logAiUsage(userId, "AI_CONSULT");  // ← أضف هذا السطر
  await consumePoints(userId, "AI_CONSULT");
} catch (err) {
  console.error("Points consumption error:", err);
}

    // ===============================
    // حفظ الإجابة
    // ===============================
    await prisma.consultation.update({
      where: { id: created.id },
      data: { answer: answerText },
    });

    return NextResponse.json({
      id: created.id,
      answer: answerText,
    });
  } catch (error) {
    console.error("Error in /api/consultations/ai:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع أثناء معالجة الاستشارة." },
      { status: 500 }
    );
  }
}
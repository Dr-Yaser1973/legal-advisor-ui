 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";
import { chatCompletion } from "@/lib/ai";
import { canPerformAction, consumePoints, logAiUsage } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // التحقق من الـ token
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyUserToken(token);
    const userId = Number(payload.sub);

    // التحقق من الباقة
    const { allowed, reason } = await canPerformAction(userId, "AI_CONSULT");
    if (!allowed) {
      return NextResponse.json(
        { error: reason, upgradeRequired: true },
        { status: 403 }
      );
    }

    // قراءة السؤال
    const body = await req.json().catch(() => null);
    const question = String(body?.question || "").trim();

    if (!question) {
      return NextResponse.json(
        { error: "يرجى إدخال نص واضح للاستشارة." },
        { status: 400 }
      );
    }

    // إنشاء الاستشارة
    const title = question.split(/\s+/).slice(0, 10).join(" ");
    const created = await prisma.consultation.create({
      data: { userId, title, description: question },
    });

    // استدعاء GPT
    let answerText = "عذراً، تعذر الحصول على إجابة. يرجى المحاولة لاحقًا.";
    let aiSucceeded = false;

    try {
      const completion = await chatCompletion(
        [
          {
            role: "system",
            content: `أنت مستشار قانوني عراقي متخصص. أجب على الأسئلة القانونية بأسلوب عربي واضح ومبسط. استند للقانون العراقي. لا تتجاوز 300 كلمة. أوضح دائماً أن هذه الاستشارة لا تغني عن محامٍ متخصص.`,
          },
          {
            role: "user",
            content: `${question}\n\nأجب بشكل مباشر:\n1. الإجابة القانونية\n2. الأساس القانوني\n3. التوصية العملية`,
          },
        ],
        { dialect: "auto" }
      );

      const content = completion?.choices?.[0]?.message?.content;
      if (content && typeof content === "string") {
        answerText = content.trim();
        aiSucceeded = true;
      }
    } catch (err) {
      console.error("AI error:", err);
    }

    // استهلاك النقاط — فقط عند نجاح فعلي للإجابة
    if (aiSucceeded) {
      try {
        await logAiUsage(userId, "AI_CONSULT");
        await consumePoints(userId, "AI_CONSULT");
      } catch (err) {
        console.error("Points error:", err);
      }
    }

    // حفظ الإجابة
    await prisma.consultation.update({
      where: { id: created.id },
      data: { answer: answerText },
    });

    return NextResponse.json({ id: created.id, answer: answerText });

  } catch (error) {
    console.error("Mobile consultation error:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع." },
      { status: 500 }
    );
  }
}
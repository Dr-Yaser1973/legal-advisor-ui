 // app/api/consultations/ai/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const body = await req.json().catch(() => null);

    // 🔥 نحاول أخذ النص من أكثر من حقل محتمل
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

    // عنوان تلقائي من أول 10 كلمات
    const title = question.split(/\s+/).slice(0, 10).join(" ");
    const description = question;

    // إنشاء الاستشارة في قاعدة البيانات
    const created = await prisma.consultation.create({
      data: {
        userId,
        title,
        description,
      },
    });

    let answerText =
      "عذراً، تعذر الحصول على إجابة في الوقت الحالي. يرجى المحاولة لاحقًا.";

    // استدعاء OpenAI
    try {
      const completion: any = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "أنت مستشار قانوني عراقي تجيب باللغة العربية الفصحى المبسطة، وتوضح أن الإجابة لا تغني عن استشارة محامٍ بشري.",
          },
          { role: "user", content: question },
        ],
        temperature: 0.3,
      });

      const content = completion?.choices?.[0]?.message?.content;
      if (content && typeof content === "string") {
        answerText = content.trim();
      }
    } catch (err) {
      console.error("OpenAI error:", err);
      // نُبقي answerText على النص الافتراضي
    }

    // حفظ الإجابة
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

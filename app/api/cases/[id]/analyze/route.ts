 // app/api/cases/[id]/analyze/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

// لا تستخدم edge runtime مع Prisma
// export const runtime = "nodejs"; // اختياري، الافتراضي node

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, context: RouteContext) {
  try {
    // ✅ هنا نفكّ الـ Promise
    const { id: idStr } = await context.params;
    const id = Number(idStr);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "معرّف القضية غير صالح." },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY مفقود من ملف .env");
      return NextResponse.json(
        { error: "OpenAI API key is not configured on the server." },
        { status: 500 },
      );
    }

    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) {
      return NextResponse.json(
        { error: "القضية غير موجودة." },
        { status: 404 },
      );
    }

    const prompt = `
أنت مستشار قانوني عراقي. إليك معلومات عن قضية:

العنوان: ${c.title}
نوع القضية: ${c.type}
المحكمة: ${c.court}
حالة القضية الحالية: ${c.status}

وصف القضية:
${c.description}

المطلوب منك:
- تلخيص موجز للوقائع.
- تحديد أهم النصوص القانونية المحتملة ذات الصلة (دون ذكر أرقام مواد إن لم تكن متأكدًا).
- تقديم تقييم قانوني مختصر لموقف المدعي والمدعى عليه.
- تقديم توصيات عملية للمحامي حول الاستراتيجية الإجرائية القادمة.

اكتب الإجابة بلغة عربية قانونية رسمية ومنسقة بفقرات ونقاط.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis =
      completion.choices[0]?.message?.content?.trim() ??
      "لم يتمكن النظام من توليد تحليل مناسب.";

    // نخزنها كنص عادي في حقل Json
    await prisma.case.update({
      where: { id },
      data: { aiAnalysis: analysis },
    });

    return NextResponse.json({ analysis });
  } catch (err: any) {
    console.error("❌ Error analyzing case:", err);
    return NextResponse.json(
      {
        error: "Failed to analyze case.",
        details: err?.message ?? String(err),
      },
      { status: 500 },
    );
  }
}

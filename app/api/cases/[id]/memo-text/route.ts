// app/api/cases/[id]/memo-text/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = Number(idStr);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "معرّف القضية غير صالح." },
        { status: 400 }
      );
    }

    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) {
      return NextResponse.json(
        { error: "القضية غير موجودة." },
        { status: 404 }
      );
    }

    const prompt = `
أنت محامٍ تجيد الصياغة القانونية بالعربية الفصحى.
أمامك بيانات قضية:
- العنوان: ${c.title}
- المحكمة: ${c.court}
- النوع: ${c.type}
- الحالة: ${c.status}
- ملخص الوقائع: ${c.description}

أعد لي مسوّدة مذكرة دفاع/رأي قانوني تشمل:
1) الوقائع (صياغة دقيقة مختصرة)
2) الأساس القانوني (مواد ذات صلة مع أرقامها إن أمكن)
3) التحليل القانوني (منطقي وواضح)
4) الطلبات (محددة ومباشرة)

اكتب بدون حشو، وبنقاط مرتبة وترويسات واضحة.
    `.trim();

    const chat = await openai.chat.completions.create({
      model: process.env.CHAT_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });

    const memoText =
      chat.choices[0]?.message?.content?.trim() ??
      "لم يتمكن النظام من توليد مذكرة مناسبة.";

    // إذا حبيت لاحقًا نخزن المذكرة في قاعدة البيانات، نضيف ذلك هنا.
    // حاليًا نرجعها فقط للواجهة.
    return NextResponse.json({ memo: memoText });
  } catch (e: any) {
    console.error("Error generating memo text:", e);
    return NextResponse.json(
      { error: e?.message ?? "فشل في توليد المذكرة." },
      { status: 500 }
    );
  }
}



// app/api/library/analyze/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// لو عندك عميل OpenAI جاهز في lib/ai فاستورده بدل هذا
// هنا نستخدم SDK الرسمي باختصار:
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { id } = await req.json().catch(() => ({}));
    const docId = Number(id);
    if (!Number.isFinite(docId)) {
      return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 });
    }

    const doc = await prisma.lawDoc.findUnique({
      where: { id: docId },
      select: { title: true, jurisdiction: true, category: true, year: true, text: true },
    });

    if (!doc) return NextResponse.json({ error: "المستند غير موجود" }, { status: 404 });
    if (!doc.text || doc.text.trim().length < 20) {
      return NextResponse.json({ error: "لا يوجد نص محفوظ لهذا القانون لتحليله" }, { status: 400 });
    }

    // قلّل النص كي لا يتجاوز حدود الطول
    const MAX_CHARS = 14000;
    const snippet = doc.text.length > MAX_CHARS ? doc.text.slice(0, MAX_CHARS) : doc.text;

    const prompt = `
حلّل النص القانوني التالي وقدّم:
1) ملخصًا دقيقًا من 6-10 أسطر.
2) أهم النقاط/الالتزامات والجزاءات (قائمة نقطية).
3) الملاحظات العملية لتطبيق القانون في العراق (إن وُجد).
4) مخاطر قانونية أو ثغرات محتملة.
5) اقتراحات للتعديلات أو اللوائح المكمّلة.

المعلومات الوصفية:
- العنوان: ${doc.title}
- الاختصاص: ${doc.jurisdiction}
- التصنيف: ${doc.category}
- السنة: ${doc.year ?? "-"}

النص:
"""${snippet}"""
`.trim();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // عائد افتراضي مفيد عند غياب المفتاح
      const fallback =
        `ملخص: لم يتم ضبط مفتاح OpenAI في الخادوم، لذا أُعيد تحليلًا افتراضيًا.\n\n` +
        `- العنوان: ${doc.title}\n- الاختصاص: ${doc.jurisdiction} - ${doc.year ?? ""}\n\n` +
        `النقاط الرئيسية:\n• يحدد واجبات الأطراف وآليات التنفيذ.\n• يذكر جزاءات عند المخالفة.\n\n` +
        `ملاحظات عملية:\n• تأكد من القرارات الوزارية والتعليمات المكملة.\n• راجع التعديلات اللاحقة والقرارات القضائية ذات الصلة.\n\n` +
        `مخاطر وثغرات:\n• عمومية بعض الصياغات قد تتطلب لوائح تفسيرية.\n\n` +
        `اقتراحات:\n• إصدار دليل تطبيقي ونماذج موحّدة.\n• تحديث النص بما ينسجم مع الاتفاقيات الدولية ذات الصلة.`;
      return NextResponse.json({ analysis: fallback }, { status: 200 });
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "أنت خبير قانوني عربي تقدّم تحليلاً عمليًا مختصرًا ودقيقًا للنصوص القانونية بصياغة عربية فصيحة ومنظمة بعناوين فرعية ونقاط.",
        },
        { role: "user", content: prompt },
      ],
    });

    const analysis =
      completion.choices[0]?.message?.content?.trim() ||
      "تعذر إنشاء التحليل حاليًا.";

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (e: any) {
    console.error("Analyze API error:", e);
    return NextResponse.json({ error: e?.message ?? "خطأ غير متوقع" }, { status: 500 });
  }
}

 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { buildMemoPDF } from "@/lib/pdf/memoPdf";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, context: RouteContext) {
  try {
    // ✅ نفكّ الـ Promise القادم من Next.js 16
    const { id: idStr } = await context.params;
    const id = Number(idStr);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "معرّف القضية غير صالح." },
        { status: 400 },
      );
    }

    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) {
      return NextResponse.json(
        { error: "القضية غير موجودة" },
        { status: 404 },
      );
    }

    // نحضّر Prompt مختصر يعتمد بيانات القضية
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

    const content = chat.choices[0]?.message?.content || "";

    // نفصل الأقسام الأربعة ببساطة (fallback إن لم يلتزم النموذج)
    const pick = (label: string) => {
      const rx = new RegExp(
        `${label}\\s*[:：]?([\\s\\S]*?)(?=\\n\\s*\\S+\\s*[:：]|$)`,
        "i",
      );
      const m = content.match(rx);
      return (m?.[1] || "").trim();
    };

    const facts = pick("الوقائع") || c.description;
    const legalBasis = pick("الأساس القانوني");
    const analysis = pick("التحليل") || pick("التحليل القانوني");
    const requests = pick("الطلبات");

    // الأطراف كنص مبسط من JSON
    let partiesText = "";
    try {
      const parties = (c.parties as any[]) || [];
      partiesText = parties
        .map((p) => `${p.role || "طرف"}: ${p.name || ""}`)
        .join("، ");
    } catch {
      // تجاهل أي خطأ في تحويل الأطراف
    }

    // بناء PDF
    const pdfBytes = await buildMemoPDF({
      title: "مذكرة قانونية",
      caseTitle: c.title,
      court: c.court,
      partiesText: partiesText || "—",
      facts: facts || "—",
      legalBasis: legalBasis || "—",
      analysis: analysis || "—",
      requests: requests || "—",
      footerNote:
        "تم إنشاء هذه المذكرة إلكترونيًا عبر منصة المستشار القانوني.",
    });

    // حفظ المستند وربطه بالقضية
    const doc = await prisma.legalDocument.create({
      data: {
        title: `مذكرة - ${c.title}`,
        filename: `memo_case_${c.id}.pdf`,
        mimetype: "application/pdf",
        size: pdfBytes.byteLength,
      },
      select: { id: true },
    });

    await prisma.caseDocument.create({
      data: { caseId: c.id, documentId: doc.id },
    });

    // إرجاع الملف نفسه (للتنزيل) + الميتاداتا
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="memo_case_${c.id}.pdf"`,
        "X-Document-Id": String(doc.id),
      },
    });
  } catch (e: any) {
    console.error("Error generating memo:", e);
    return NextResponse.json(
      { error: e?.message ?? "Unexpected error while generating memo." },
      { status: 500 },
    );
  }
}

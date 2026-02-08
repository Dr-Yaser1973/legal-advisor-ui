 // app/api/smart-lawyer/report/route.ts
import { NextResponse } from "next/server";
import { generateLegalOpinion } from "@/lib/pdf/pdfOpinion";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { title, rawText, analysis } = await req.json();

    // تحقق من وجود بيانات كافية
    if (!analysis || (!rawText && !title)) {
      return NextResponse.json(
        { error: "بيانات غير كافية للتقرير." },
        { status: 400 }
      );
    }

    // نص جسم التقرير النهائي
    const parts: string[] = [];

    if (rawText) {
      parts.push("النص موضوع الدراسة:\n" + rawText);
    }

    parts.push("\nالتحليل القانوني:\n" + analysis);

    const bodyText = parts.join("\n\n");

    // إنشاء PDF باستخدام الدالة الموجودة في lib/pdf/pdfOpinion.ts
    const pdfBuffer = await generateLegalOpinion({
      title: title || "رأي قانوني",
      body: bodyText,
    });

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="legal_opinion.pdf"',
      },
    });
  } catch (error: any) {
    console.error("smart-lawyer report error:", error);
    return NextResponse.json(
      { error: error?.message || "فشل إنشاء التقرير" },
      { status: 500 }
    );
  }
}

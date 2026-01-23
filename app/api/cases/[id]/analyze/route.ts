 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAnswer } from "@/lib/ai";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, context: RouteContext) {
  try {
    // ✅ فكّ الـ Promise الخاص بالمسار
    const { id: idStr } = await context.params;
    const id = Number(idStr);

    if (!Number.isFinite(id)) {
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

    // بناء السياق القانوني
    const contextText = `
العنوان: ${c.title ?? ""}
نوع القضية: ${c.type ?? ""}
المحكمة: ${c.court ?? ""}
حالة القضية: ${c.status ?? ""}

وصف القضية:
${c.description ?? ""}
`.trim();

    // 🔥 الذكاء يعمل هنا فقط (Runtime)
    const analysis = await generateAnswer(
      "حلّل هذه القضية وقدّم ملخصًا قانونيًا وتوصيات إجرائية عملية.",
      contextText
    );

    // تخزين التحليل
    await prisma.case.update({
      where: { id },
      data: { aiAnalysis: analysis },
    });

    return NextResponse.json({ ok: true, analysis });
  } catch (err: any) {
    console.error("❌ Error analyzing case:", err);
    return NextResponse.json(
      {
        error: "Failed to analyze case.",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}

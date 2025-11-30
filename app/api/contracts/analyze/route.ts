
import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    const file = fd.get("file") as File | null;
    if (!file) return NextResponse.json({ report: "لم يتم استلام ملف." }, { status: 400 });
    if (!file.type?.includes("pdf"))
      return NextResponse.json({ report: "صيغـة غير مدعومة (PDF فقط)." }, { status: 400 });

    const ab = await file.arrayBuffer();
    const text = await extractPdfText(new Uint8Array(ab));

    // تحليل مبسّط: طول النص + مخاطر عامة (يمكن لاحقًا ربطه بـ RAG والمكتبة)
    const words = text.split(/\s+/).filter(Boolean).length;
    const hints = [
      "تأكد من وجود بند إنهاء واضح يحدد الإشعار المسبق.",
      "راجع بند تسوية المنازعات (تحكيم/قضاء) بما يلائم مصلحتك.",
      "تحقق من الغرامات أو التعويضات عند الإخلال.",
      "تأكد من عدم وجود التزامات مفتوحة المدة.",
    ];

    const report =
      `عدد الكلمات التقريبي: ${words}\n\n` +
      `ملاحظات عامة:\n- ${hints.join("\n- ")}\n\n` +
      `مقتطفات البداية:\n${text.slice(0, 800)}...`;

    return NextResponse.json({ report });
  } catch (e: any) {
    console.error("contracts/analyze error:", e);
    return NextResponse.json({ report: e?.message || "فشل التحليل" }, { status: 500 });
  }
}

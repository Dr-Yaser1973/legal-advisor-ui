 // app/api/contracts/pdf/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  html: string;        // HTML كامل أو body
  filename?: string;   // اسم ملف اختياري
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body?.html || typeof body.html !== "string") {
      return NextResponse.json({ error: "html مطلوب" }, { status: 400 });
    }

    const serviceUrl = process.env.PDF_SERVICE_URL; // https://legal-advisor-pdf-service.onrender.com
    if (!serviceUrl) {
      return NextResponse.json({ error: "PDF_SERVICE_URL غير مضبوط" }, { status: 500 });
    }

    const res = await fetch(`${serviceUrl}/render/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: body.html,
        filename: body.filename ?? "document.pdf",
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `فشل توليد PDF من الخدمة: ${res.status}`, details: txt.slice(0, 400) },
        { status: 502 }
      );
    }

    const pdfArrayBuffer = await res.arrayBuffer();

    return new Response(pdfArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(body.filename ?? "document.pdf")}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    console.error("contracts/pdf proxy error:", e);
    return NextResponse.json({ error: e?.message ?? "خطأ" }, { status: 500 });
  }
}

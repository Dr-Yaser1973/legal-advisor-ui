 import { generateLegalOpinion } from "@/lib/pdf/pdfOpinion";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = (body?.title as string) || "رأي قانوني";
    const opinionBody = (body?.body as string) || "";

    if (!opinionBody.trim()) {
      return new Response(
        JSON.stringify({ error: "لا توجد إجابة لتوليد تقرير PDF منها." }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    // 🧠 توليد ملف PDF من الإجابة (Buffer أو Uint8Array)
    const raw = await generateLegalOpinion({
      title,
      body: opinionBody,
    });

    // 🌟 نحوله دائمًا إلى Uint8Array ثم ArrayBuffer
    const uint8 =
      raw instanceof Uint8Array ? raw : new Uint8Array(raw as any);
    const arrayBuffer: ArrayBuffer = uint8.buffer.slice(
      uint8.byteOffset,
      uint8.byteOffset + uint8.byteLength
    );

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="legal-opinion.pdf"',
      },
    });
  } catch (err) {
    console.error("pdf/opinion error:", err);
    return new Response(
      JSON.stringify({ error: "فشل توليد ملف PDF" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        }, 
      }
    );
  }
}

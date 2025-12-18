 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderContractPdfBuffer } from "@/lib/contractPdf";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "معرف العقد غير صالح" }, { status: 400 });
    }

    const gc = await prisma.generatedContract.findUnique({
      where: { id: numericId },
      select: { id: true, title: true, data: true },
    });

    if (!gc) {
      return NextResponse.json({ error: "العقد غير موجود" }, { status: 404 });
    }

    const data = (gc.data || {}) as any;
    const htmlBody = data.htmlBody as string | undefined;

    if (!htmlBody) {
      return NextResponse.json(
        { error: "لا يوجد محتوى (HTML) محفوظ لهذا العقد" },
        { status: 400 }
      );
    }

    const pdfBuffer = await renderContractPdfBuffer(htmlBody);

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="contract-${gc.id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("contracts/generated/[id]/pdf error:", error);
    return NextResponse.json(
      { error: error?.message ?? "حدث خطأ أثناء تحميل العقد." },
      { status: 500 }
    );
  }
}

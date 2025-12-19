 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  const gc = await prisma.generatedContract.findUnique({
    where: { id },
    select: { data: true },
  });

  if (!gc) {
    return NextResponse.json({ error: "العقد غير موجود" }, { status: 404 });
  }

  const htmlBody = (gc.data as any)?.htmlBody;
  if (!htmlBody) {
    return NextResponse.json(
      { error: "لا يوجد HTML محفوظ للعقد" },
      { status: 400 }
    );
  }

  const res = await fetch(
    "https://legal-advisor-pdf-service.onrender.com/render/pdf",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: htmlBody,
        filename: `contract-${id}.pdf`,
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "فشل توليد PDF" },
      { status: 500 }
    );
  }

  const buffer = await res.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="contract-${id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ❗ الآن params عبارة عن Promise، لذلك نعمل await
    const { id } = await context.params;

    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
      return NextResponse.json(
        { error: "معرف العقد غير صالح" },
        { status: 400 }
      );
    }

    const gc = await prisma.generatedContract.findUnique({
      where: { id: numericId },
    });

    if (!gc || !gc.pdfPath) {
      return NextResponse.json(
        { error: "العقد غير موجود أو لم يتم توليد PDF" },
        { status: 404 }
      );
    }

    const filepath = path.join(process.cwd(), "public", gc.pdfPath);

    if (!fs.existsSync(filepath)) {
      return NextResponse.json(
        { error: "ملف PDF غير موجود على الخادم" },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filepath);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=contract-${numericId}.pdf`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحميل العقد." },
      { status: 500 }
    );
  }
}

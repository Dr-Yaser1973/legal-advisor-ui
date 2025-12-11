 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import pdfParse from "pdf-parse";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "لم يتم استلام أي ملف" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";
    if (file.type === "application/pdf") {
      const result = await pdfParse(buffer);
      text = result.text || "";
    } else {
      // ملفات نصية بسيطة
      text = buffer.toString("utf-8");
    }

    const uploadsDir = path.join(process.cwd(), "uploads", "translation");
    await fs.mkdir(uploadsDir, { recursive: true });

    const storedName =
      Date.now().toString() + "-" + file.name.replace(/\s+/g, "_");
    const diskPath = path.join(uploadsDir, storedName);
    await fs.writeFile(diskPath, buffer);

    const doc = await prisma.legalDocument.create({
      data: {
        title: file.name,
        filename: storedName,
        mimetype: file.type || "application/octet-stream",
        size: buffer.length,
      },
    });

    return NextResponse.json({
      ok: true,
      text,
      documentId: doc.id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "فشل استخراج النص من الملف" },
      { status: 500 }
    );
  }
}

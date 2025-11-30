 import { PDFDocument, rgb } from "pdf-lib";
import { shapeArabic } from "@/lib/arabic";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

export interface MemoData {
  title: string;
  caseTitle: string;
  court: string;
  partiesText: string;
  facts: string;
  legalBasis: string;
  analysis: string;
  requests: string;
  footerNote: string;
}

export async function buildMemoPDF(data: MemoData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Noto_Naskh_Arabic",
    "NotoNaskhArabic-VariableFont_wght.ttf"
  );

  const fontBytes = fs.readFileSync(fontPath);
  const arabicFont = await pdf.embedFont(fontBytes, { subset: true });

  const page = pdf.addPage([595.28, 841.89]); // A4
  const { width } = page.getSize();
  const fontSize = 14;
  const margin = 40;

 const writeText = (text: string, yStart: number) => {
  const lines = (text || "").split("\n");

  // نتأكد أن yStart رقم صالح، وإلا نرجعه لقيمة افتراضية
  let y = Number.isFinite(yStart) ? yStart : 800;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      y -= 20;
      continue;
    }

    // نهيّئ النص العربي
    const shaped = shapeArabic(trimmed);

    try {
      page.drawText(shaped, {
        x: 40,         // margin
        y,
        font: arabicFont,
        size: 14,
        color: rgb(0, 0, 0),
      });
    } catch (err) {
      console.error("drawText error, skipping line:", err);
      // لا نرمي الخطأ حتى لا يتوقف التوليد بالكامل
    }

    y -= 20;
  }

  return y;
};
 

  let cursor = 800;

  cursor = writeText(data.title, cursor - 10);
  cursor = writeText(`عنوان القضية: ${data.caseTitle}`, cursor - 20);
  cursor = writeText(`المحكمة: ${data.court}`, cursor - 20);
  cursor = writeText(`الأطراف: ${data.partiesText}`, cursor - 20);

  cursor = writeText("\nالوقائع:\n" + data.facts, cursor - 30);
  cursor = writeText("\nالأساس القانوني:\n" + data.legalBasis, cursor - 30);
  cursor = writeText("\nالتحليل القانوني:\n" + data.analysis, cursor - 30);
  cursor = writeText("\nالطلبات:\n" + data.requests, cursor - 30);

  cursor = writeText("\n\n" + data.footerNote, cursor - 50);

  return await pdf.save();
}

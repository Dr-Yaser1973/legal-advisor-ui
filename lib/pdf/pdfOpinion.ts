 // lib/pdf/pdfOpinion.ts
import fs from "fs";
import path from "path";
import { PDFDocument, rgb, PDFFont } from "pdf-lib";
import { shapeArabic } from "../arabic";

export type OpinionPdfInput = {
  title: string;         // عنوان التقرير أو الرأي القانوني
  inputTitle?: string;   // العنوان الأصلي إن وجد
  rawText: string;       // النص/الوقائع أو الاستشارة الأولية
  analysis: string;      // التحليل القانوني
  footer?: string;       // تذييل اختياري
};

// تحميل خط Noto Naskh من مجلد public/fonts
async function loadNotoNaskh(pdf: PDFDocument): Promise<PDFFont> {
  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Noto_Naskh_Arabic",
    "NotoNaskhArabic-VariableFont_wght.ttf"
  );
  const fontBytes = fs.readFileSync(fontPath);
  return pdf.embedFont(fontBytes, { subset: true });
}

export async function buildOpinionPDF(data: OpinionPdfInput): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const font = await loadNotoNaskh(pdf);
  let page = pdf.addPage();
  let { width, height } = page.getSize();

  const margin = 50;
  const titleSize = 18;
  const sectionTitleSize = 14;
  const bodySize = 12;
  const lineHeight = 18;

  let cursorY = height - margin;
  const maxTextWidth = width - margin * 2;

  const ensureSpace = (needed: number) => {
    if (cursorY <= margin + needed) {
      page = pdf.addPage();
      ({ width, height } = page.getSize());
      cursorY = height - margin;
    }
  };

  const wrapText = (text: string, size: number): string[] => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      const shapedCandidate = shapeArabic(candidate);
      const w = font.widthOfTextAtSize(shapedCandidate, size);
      if (w <= maxTextWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }

    if (current) lines.push(current);
    return lines;
  };

  const drawRTLLine = (text: string, size = bodySize) => {
    const shaped = shapeArabic(text);
    const textWidth = font.widthOfTextAtSize(shaped, size);
    const x = width - margin - textWidth;

    page.drawText(shaped, {
      x,
      y: cursorY,
      size,
      font,
      color: rgb(0, 0, 0),
    });

    cursorY -= lineHeight;
  };

  const drawRTLParagraph = (text: string, size = bodySize) => {
    const paragraphs = text.split(/\r?\n/).filter((p) => p.trim().length > 0);
    for (const p of paragraphs) {
      const lines = wrapText(p, size);
      for (const line of lines) {
        ensureSpace(lineHeight);
        drawRTLLine(line, size);
      }
      cursorY -= lineHeight / 2;
    }
  };

  const drawSectionTitle = (title: string) => {
    ensureSpace(lineHeight * 2);
    const shaped = shapeArabic(title);
    const textWidth = font.widthOfTextAtSize(shaped, sectionTitleSize);
    const x = width - margin - textWidth;

    page.drawText(shaped, {
      x,
      y: cursorY,
      size: sectionTitleSize,
      font,
      color: rgb(0, 0, 0.4),
    });

    cursorY -= lineHeight * 1.5;
  };

  // --------- العنوان الرئيسي ---------
  {
    const shapedTitle = shapeArabic(data.title);
    const w = font.widthOfTextAtSize(shapedTitle, titleSize);
    const x = width - margin - w;

    page.drawText(shapedTitle, {
      x,
      y: cursorY,
      size: titleSize,
      font,
      color: rgb(0, 0, 0),
    });

    cursorY -= lineHeight * 2;
  }

  // --------- قسم: موضوع الرأي/العنوان الأصلي ---------
  if (data.inputTitle) {
    drawSectionTitle("أولاً: موضوع الرأي القانوني");
    drawRTLParagraph(data.inputTitle, bodySize);
    cursorY -= lineHeight / 2;
  }

  // --------- قسم: عرض الوقائع / النص ---------
  if (data.rawText) {
    const label = data.inputTitle
      ? "ثانيًا: عرض الوقائع"
      : "أولاً: عرض الوقائع";
    drawSectionTitle(label);
    drawRTLParagraph(data.rawText, bodySize);
    cursorY -= lineHeight / 2;
  }

  // --------- قسم: التحليل القانوني ---------
  if (data.analysis) {
    const label = data.inputTitle
      ? "ثالثًا: التحليل القانوني"
      : "ثانيًا: التحليل القانوني";
    drawSectionTitle(label);
    drawRTLParagraph(data.analysis, bodySize);
    cursorY -= lineHeight / 2;
  }

  // --------- التذييل ---------
  if (data.footer) {
    ensureSpace(lineHeight * 3);
    drawRTLParagraph(data.footer, bodySize);
  }

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}

// للإبقاء على التوافق مع التوقيع القديم (title + body فقط)
export async function generateLegalOpinion(data: { title: string; body: string }) {
  return buildOpinionPDF({
    title: data.title,
    rawText: data.body,
    analysis: "",
  });
}

 // lib/pdf.ts
// ======================================================
// 1) استخراج نصوص PDF: pdf-parse
// 2) توليد PDF بسيط: pdf-lib (قيود العربية)
// ======================================================

import pdfParse from "pdf-parse";
import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";

// ---------------------- أنواع مساعدة ----------------------
export type PdfPage = { index: number; text: string };

export type ContractPdfOptions = {
  title?: string;     // عنوان أعلى الصفحة (اختياري)
  content: string;    // نص العقد الكامل (إلزامي)
  footer?: string;    // تذييل (توقيعات/ملاحظات) اختياري
};

// ---------------------- أدوات نصية ----------------------
export function normalize(text: string): string {
  return (text || "").replace(/\s+/g, " ").replace(/\u0000/g, "").trim();
}

/** تقسيم نص طويل إلى مقاطع متداخلة قليلاً (ملائم لـ RAG) */
export function chunkText(text: string, chunkSize = 1000, overlap = 100): string[] {
  const clean = normalize(text);
  if (!clean) return [];
  const parts: string[] = [];
  let i = 0;
  while (i < clean.length) {
    const end = Math.min(clean.length, i + chunkSize);
    parts.push(clean.slice(i, end));
    if (end === clean.length) break;
    i = Math.max(0, end - overlap);
  }
  return parts;
}

// ---------------------- تحويل مدخلات إلى Buffer ----------------------
function toBuffer(data: ArrayBuffer | Uint8Array | Buffer): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  return Buffer.from(new Uint8Array(data));
}

// ---------------------- استخراج نص PDF ----------------------
export async function extractPages(data: ArrayBuffer | Uint8Array | Buffer): Promise<PdfPage[]> {
  const buf = toBuffer(data);
  const res = await pdfParse(buf);
  return [{ index: 0, text: res.text || "" }];
}

export async function extractPdfText(data: ArrayBuffer | Uint8Array | Buffer): Promise<string> {
  const pages = await extractPages(data);
  return pages.map((p) => p.text).join("\n");
}

// ======================================================
// (أ) توليد عقد PDF بسيط بـ pdf-lib (قيود العربية)
// ======================================================

export async function contractToPDF(opts: ContractPdfOptions): Promise<Uint8Array> {
  const { title = "عقد", content, footer } = opts;

  const doc = await PDFDocument.create();
  const pageWidth = 595.28;   // A4
  const pageHeight = 841.89;  // A4
  const margin = 48;

  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);

  const titleSize = 18;
  const bodySize = 12;
  const lineGap = 6;

  let currentPage = doc.addPage([pageWidth, pageHeight]);
  let cursorY = pageHeight - margin;

  const drawTitle = (p = currentPage) => {
    const tw = fontBold.widthOfTextAtSize(title, titleSize);
    p.drawText(title, {
      x: (pageWidth - tw) / 2,
      y: pageHeight - margin - titleSize,
      size: titleSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    cursorY = pageHeight - margin - titleSize - 18;
  };

  const ensureSpace = (needed: number) => {
    if (cursorY <= margin + needed) {
      currentPage = doc.addPage([pageWidth, pageHeight]);
      drawTitle(currentPage);
    }
  };

  drawTitle(currentPage);

  const wrapAndDraw = (text: string, size: number, f: PDFFont) => {
    const maxWidth = pageWidth - margin * 2;
    const words = text.split(/\s+/);
    let line = "";

    const drawLine = (ln: string) => {
      if (!ln) return;
      ensureSpace(size + lineGap);
      currentPage.drawText(ln, {
        x: margin,
        y: cursorY,
        size,
        font: f,
        color: rgb(0, 0, 0),
      });
      cursorY -= size + lineGap;
    };

    for (const w of words) {
      const candidate = line ? `${line} ${w}` : w;
      const width = f.widthOfTextAtSize(candidate, size);
      if (width <= maxWidth) line = candidate;
      else {
        drawLine(line);
        line = w;
      }
    }
    drawLine(line);
  };

  const paragraphs = (content || "").split(/\r?\n\r?\n/);
  for (const p of paragraphs) {
    const t = p.trim();
    if (!t) continue;
    wrapAndDraw(t, bodySize, font);
  }

  if (footer && footer.trim()) {
    cursorY -= 10;
    wrapAndDraw("—", bodySize, font);
    cursorY -= 4;
    wrapAndDraw(footer.trim(), bodySize, font);
  }

  return await doc.save();
}

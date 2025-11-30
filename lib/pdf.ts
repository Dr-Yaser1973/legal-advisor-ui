 // lib/pdf.ts
// ======================================================
// 1) استخراج نصوص PDF: pdf-parse
// 2) توليد PDF بسيط: pdf-lib (قيود على العربية)
// 3) توليد PDF عربي RTL احترافي: Puppeteer + HTML + خط Noto Naskh
// ======================================================

import pdfParse from "pdf-parse";
import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";

// ✅ سنستورد Puppeteer وملفات النظام فقط عندما نستخدم التوليد الاحترافي
// حتى لا يؤثر على الواجهة أو بيئات لا تدعم Chromium
import path from "path";
import fs from "fs";

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
export function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 100
): string[] {
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
  // ArrayBuffer
  return Buffer.from(new Uint8Array(data));
}

// ---------------------- استخراج نص PDF ----------------------
/**
 * يستقبل ArrayBuffer/Uint8Array/Buffer ويعيد صفحة وهمية واحدة بالنص الكامل.
 * ملاحظة: pdf-parse غالبًا يدمج الصفحات؛ لذا نعيد صفحة واحدة.
 */
export async function extractPages(
  data: ArrayBuffer | Uint8Array | Buffer
): Promise<PdfPage[]> {
  const buf = toBuffer(data);
  const res = await pdfParse(buf);
  return [{ index: 0, text: res.text || "" }];
}

export async function extractPdfText(
  data: ArrayBuffer | Uint8Array | Buffer
): Promise<string> {
  const pages = await extractPages(data);
  return pages.map((p) => p.text).join("\n");
}

// ======================================================
// (أ) توليد عقد PDF بسيط بـ pdf-lib (قيود العربية)
// ======================================================
/**
 * توليد PDF بسيط باستخدام خطوط PDF القياسية (Times).
 * ملاحظة: العربي سيظهر بحروف منفصلة (قيود pdf-lib).
 * لإخراج عربي احترافي استخدم HTML+Puppeteer (الدالة بالأسفل).
 */
export async function contractToPDF(opts: ContractPdfOptions): Promise<Uint8Array> {
  const { title = "عقد", content, footer } = opts;

  const doc = await PDFDocument.create();
  const pageWidth = 595.28;   // A4
  const pageHeight = 841.89;  // A4
  const margin = 48;

  // الخطوط القياسية
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);

  const titleSize = 18;
  const bodySize = 12;
  const lineGap = 6;

  // حالة الصفحة الحالية
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

  // التفاف الأسطر
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
      if (width <= maxWidth) {
        line = candidate;
      } else {
        drawLine(line);
        line = w;
      }
    }
    drawLine(line);
  };

  // فقرات المحتوى (سطر فارغ فاصِل)
  const paragraphs = (content || "").split(/\r?\n\r?\n/);
  for (const p of paragraphs) {
    const t = p.trim();
    if (!t) continue;
    wrapAndDraw(t, bodySize, font);
  }

  // تذييل اختياري
  if (footer && footer.trim()) {
    cursorY -= 10;
    wrapAndDraw("—", bodySize, font);
    cursorY -= 4;
    wrapAndDraw(footer.trim(), bodySize, font);
  }

  return await doc.save();
}

// ======================================================
// (ب) توليد PDF عربي احترافي بـ Puppeteer + HTML RTL
// ======================================================

/** تحميل الخط Noto Naskh كـ Base64 من public/fonts */
function loadNotoNaskhBase64(): string {
  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Noto_Naskh_Arabic",
    "NotoNaskhArabic-VariableFont_wght.ttf"
  );
  const buf = fs.readFileSync(fontPath);
  return buf.toString("base64");
}

/** قالب HTML RTL نظيف للعقود */
export function contractHTML(content: string, title = "عقد") {
  const fontBase64 = loadNotoNaskhBase64();
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <style>
    @font-face {
      font-family: "NotoNaskhArabic";
      src: url("data:font/ttf;base64,${fontBase64}") format("truetype");
      font-weight: 100 900;
      font-style: normal;
    }
    html, body { direction: rtl; unicode-bidi: plaintext; }
    body { margin: 24px; font-family: "NotoNaskhArabic", serif; line-height: 1.9; color: #111; }
    h1 { margin: 0 0 12px; font-weight: 700; font-size: 22px; text-align: center; }
    hr { border: 0; border-top: 1px solid #999; margin: 18px 0; }
    .footer { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .box { border: 1px solid #555; padding: 10px; min-height: 64px; }
    .meta { margin-top: 12px; color: #444; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div>${content}</div>
  <div class="meta">القانون الواجب التطبيق: جمهورية العراق</div>
  <hr/>
  <div class="footer">
    <div class="box">توقيع الطرف الأول</div>
    <div class="box">توقيع الطرف الثاني</div>
  </div>
</body>
</html>`;
}

/**
 * توليد PDF عربي احترافي عبر Puppeteer (Chromium).
 * ملاحظة: تُستدعى من Route سيرفر فقط (بيئة Node).
 */
export async function renderContractPDF(text: string, title?: string) {
  // استيراد puppeteer ديناميكيًا لتجنب مشاكل bundling على العميل
  const puppeteer = (await import("puppeteer")).default;
  const browser = await puppeteer.launch({ headless: "new" /*, args: ["--no-sandbox"]*/ });
  const page = await browser.newPage();
  await page.setContent(contractHTML(text, title ?? "عقد"), { waitUntil: "load" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", right: "12mm", bottom: "16mm", left: "12mm" },
  });
  await browser.close();
  return pdf; // Buffer
}

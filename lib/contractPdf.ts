 // lib/contractPdf.ts
import path from "path";
import fs from "fs";
import puppeteer from "puppeteer";

/**
 * ✅ يولّد PDF في الذاكرة ويرجعه Buffer (مناسب لـ Vercel)
 */
export async function renderContractPdfBuffer(htmlBody: string): Promise<Buffer> {
  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Noto_Naskh_Arabic",
    "NotoNaskhArabic-VariableFont_wght.ttf"
  );

  const fontData = fs.readFileSync(fontPath).toString("base64");

  const fullHtml = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <style>
    @font-face {
      font-family: "NotoNaskhArabic";
      src: url("data:font/ttf;base64,${fontData}") format("truetype");
      font-weight: 400;
      font-style: normal;
    }
    body {
      font-family: "NotoNaskhArabic", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      direction: rtl;
      text-align: right;
      font-size: 13px;
      line-height: 1.8;
      margin: 2cm;
    }
    h1, h2, h3 { text-align: center; margin-bottom: 0.5rem; }
    h1 { font-size: 18px; }
    h2 { font-size: 16px; }
    p { margin: 0.2rem 0; }
    .clause { margin-top: 0.5rem; }
    .parties { margin-top: 1rem; border-top: 1px solid #000; padding-top: 0.5rem; }
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: true,

    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

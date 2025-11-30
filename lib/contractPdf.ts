// lib/contractPdf.ts
import path from "path";
import fs from "fs";
import puppeteer from "puppeteer";

/**
 * توليد ملف PDF لعقد قانوني بالعربية من HTML
 * يعيد المسار النسبي داخل public/ وحجم الملف بالبايت.
 */
export async function renderContractPdf(htmlBody: string) {
  // مسار الخط العربي (تأكد أن الملف موجود فعلاً عندك)
  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Noto_Naskh_Arabic",
    "NotoNaskhArabic-VariableFont_wght.ttf",
  );

  const fontData = fs.readFileSync(fontPath).toString("base64");

  // تغليف HTML بالكامل: اتجاه RTL + خط عربي
  const fullHtml = `
<!doctype html>
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

    h1, h2, h3 {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    h1 {
      font-size: 18px;
    }

    h2 {
      font-size: 16px;
    }

    p {
      margin: 0.2rem 0;
    }

    .clause {
      margin-top: 0.5rem;
    }

    .parties {
      margin-top: 1rem;
      border-top: 1px solid #000;
      padding-top: 0.5rem;
    }
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>
`;

  // إنشاء اسم ملف مميز
  const fileName = `contract-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.pdf`;
  const relPath = path.join("contracts", fileName); // داخل public/contracts
  const fullPath = path.join(process.cwd(), "public", relPath);

  // التأكد من وجود المجلد
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });

    fs.writeFileSync(fullPath, buffer);

    return {
      relPath: relPath.replace(/\\/g, "/"), // مثال: contracts/contract-123.pdf
      size: buffer.length,
    };
  } finally {
    await browser.close();
  }
}


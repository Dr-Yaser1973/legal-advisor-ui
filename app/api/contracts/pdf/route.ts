import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";
export const revalidate = 0;            // لا كاش
export const dynamic = "force-dynamic"; // اختياري: يضمن السيرفر كل مرة

type Body = {
  title?: string;
  content: string;
  footer?: string;
};

function assert(cond: any, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function splitParagraphs(text: string): string[] {
  return (text || "")
    .split(/\r?\n\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeHtml(s: string) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function htmlTemplate(
  { title, content, footer }: Required<Pick<Body, "content">> & Partial<Body>,
  fontDataBase64?: string
) {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:;">
  <style>
    ${fontDataBase64 ? `
    @font-face {
      font-family: "NotoNaskhArabic";
      src: url("data:font/ttf;base64,${fontDataBase64}") format("truetype");
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }` : ``}
    @page { size: A4; margin: 16mm 16mm 18mm 16mm; }
    html, body {
      padding: 0; margin: 0; background: #fff; color: #000;
      font-family: ${fontDataBase64 ? '"NotoNaskhArabic",' : ""} system-ui, sans-serif;
    }
    .title { text-align: center; font-weight: 700; font-size: 20px; margin: 0 0 14px; }
    .paragraph { white-space: pre-wrap; line-height: 1.8; font-size: 14px; text-align: justify; margin: 0 0 8px; word-break: break-word; }
    .divider { text-align: center; margin: 10px 0 4px; color: #444; }
    .footer { margin-top: 14px; white-space: pre-wrap; line-height: 1.8; font-size: 14px; }
  </style>
</head>
<body>
  <main>
    ${title ? `<h1 class="title">${escapeHtml(title)}</h1>` : ""}

    ${splitParagraphs(content).map((p) => `<p class="paragraph">${escapeHtml(p)}</p>`).join("")}

    ${footer && footer.trim()
      ? `<div class="divider">—</div><div class="footer">${escapeHtml(footer)}</div>`
      : ""}
  </main>
</body>
</html>`;
}

// ---- Puppeteer browser singleton ----
let _browser: import("puppeteer").Browser | null = null;
async function getBrowser() {
  if (_browser) return _browser;
  const { default: puppeteer } = await import("puppeteer");
  _browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--font-render-hinting=medium"],
  });
  return _browser;
}

async function loadFontBase64(): Promise<string | undefined> {
  try {
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Noto_Naskh_Arabic",
      "NotoNaskhArabic-VariableFont_wght.ttf"
    );
    const fontBin = await fs.readFile(fontPath);
    return fontBin.toString("base64");
  } catch {
    // لو الملف غير موجود نكمل بخط النظام
    return undefined;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    assert(body && typeof body.content === "string" && body.content.trim(), "نص العقد (content) مطلوب.");
    const title = (body.title || "عقد").trim();
    const footer = body.footer || "";

    // حماية بسيطة من أحجام ضخمة
    const MAX_CHARS = 200_000; // ~200KB نص
    const content = body.content.length > MAX_CHARS ? body.content.slice(0, MAX_CHARS) + "\n..." : body.content;

    const fontBase64 = await loadFontBase64();
    const html = htmlTemplate({ title, content, footer }, fontBase64);

    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", right: "16mm", bottom: "18mm", left: "16mm" },
    });

    await page.close();

    // دعم ?download=1 لتفعيل attachment
    const url = new URL(req.url);
    const isDownload = url.searchParams.get("download") === "1";
    const disposition = isDownload ? "attachment" : "inline";

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${encodeURIComponent(`${title}.pdf`)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    console.error("contracts/pdf error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "تعذّر إنشاء PDF" },
      { status: 500 }
    );
  }
}

// (اختياري) إغلاق المتصفح عند انتهاء العملية في التطوير فقط
// addEventListener("beforeunload", async () => { try { await _browser?.close(); } catch {} });
 
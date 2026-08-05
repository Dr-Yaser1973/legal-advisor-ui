// app/api/blog/og/route.tsx
// صورة OG افتراضية مولّدة بهوية المنصّة — تُستخدم للمقالات التي بلا صورة غلاف.
// تحت /api/blog/* ليكون عاماً (مستثنى في middleware.ts) فتصله زواحف التواصل.
// تُستدعى برابط: /api/blog/og?title=...&category=...
//
// نستخدم Chrome حقيقي (Puppeteer) لرسم HTML ثم نلتقط لقطة — فيُرسَم النص العربي
// بشكل صحيح تماماً (الاتجاه/المسافات/الترقيم)، بخلاف Satori الذي يعجز عن ذلك.
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const maxDuration = 30;

// نحمّل الخط مرة ونخزّنه Base64 لإدماجه في CSS (يعمل محلياً وعلى Vercel).
let fontCache: { regular: string; bold: string } | null = null;
async function getFonts() {
  if (fontCache) return fontCache;
  const dir = join(process.cwd(), "public/fonts/Almarai");
  const [reg, bold] = await Promise.all([
    readFile(join(dir, "Almarai-Regular.ttf")),
    readFile(join(dir, "Almarai-Bold.ttf")),
  ]);
  fontCache = {
    regular: reg.toString("base64"),
    bold: bold.toString("base64"),
  };
  return fontCache;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(title: string, category: string, fonts: { regular: string; bold: string }) {
  const scale = `
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#c9a84c"
      stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3v18"/><path d="M7 21h10"/><path d="M5 7h14"/>
      <path d="M5 7l-2.5 6a3 3 0 0 0 5 0z"/><path d="M19 7l-2.5 6a3 3 0 0 0 5 0z"/>
      <circle cx="12" cy="4" r="1.3"/>
    </svg>`;

  return `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"/>
<style>
  @font-face { font-family:"Almarai"; font-weight:400; font-style:normal;
    src:url(data:font/ttf;base64,${fonts.regular}) format("truetype"); }
  @font-face { font-family:"Almarai"; font-weight:700; font-style:normal;
    src:url(data:font/ttf;base64,${fonts.bold}) format("truetype"); }
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1200px; height:630px; }
  .card {
    width:1200px; height:630px; display:flex; flex-direction:column;
    justify-content:space-between; direction:rtl; padding:70px 80px;
    background:radial-gradient(circle at 78% 15%, #1b2935 0%, #0f1923 62%);
    font-family:"Almarai", sans-serif; color:#e8eaed;
  }
  .head { display:flex; align-items:center; justify-content:space-between; }
  .brand { font-size:30px; font-weight:700; color:#c9a84c; }
  .mid { display:flex; flex-direction:column; gap:22px; align-items:flex-start; }
  .chip { font-size:26px; color:#c9a84c; background:rgba(201,168,76,.12);
    padding:8px 24px; border-radius:999px; }
  .title { font-size:60px; font-weight:700; line-height:1.35; color:#ffffff;
    max-width:1040px; }
  .foot { display:flex; align-items:center; gap:16px; }
  .bar { width:120px; height:6px; border-radius:4px;
    background:linear-gradient(to left, #c9a84c, #4caf82); }
  .tag { font-size:24px; color:#8a94a0; }
</style></head>
<body>
  <div class="card">
    <div class="head">
      <div class="brand">المستشار القانوني الذكي</div>
      ${scale}
    </div>
    <div class="mid">
      ${category ? `<div class="chip">${escapeHtml(category)}</div>` : ""}
      <div class="title">${escapeHtml(title)}</div>
    </div>
    <div class="foot">
      <div class="bar"></div>
      <div class="tag">مقالات وتحليلات قانونية</div>
    </div>
  </div>
</body></html>`;
}

async function launchBrowser() {
  const onServerless =
    !!process.env.VERCEL ||
    !!process.env.AWS_REGION ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  const puppeteer = await import("puppeteer-core");

  if (onServerless) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1200, height: 630 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  // محليّاً: نستخدم متصفّحاً مثبّتاً على الجهاز
  const localCandidates = [
    process.env.CHROME_EXECUTABLE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ].filter(Boolean) as string[];

  let executablePath = localCandidates[0];
  for (const p of localCandidates) {
    try {
      await readFile(p);
      executablePath = p;
      break;
    } catch {
      /* جرّب التالي */
    }
  }

  return puppeteer.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1200, height: 630 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "المدوّنة القانونية").slice(0, 140);
  const category = (searchParams.get("category") || "").slice(0, 40);

  const fonts = await getFonts();
  const html = buildHtml(title, category, fonts);

  let browser: Awaited<ReturnType<typeof launchBrowser>> | null = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    const buffer = await page.screenshot({ type: "png" });

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("OG image generation failed:", err);
    // تشخيص مؤقت: نكشف الرسالة لمعرفة سبب فشل Chromium على Vercel
    const msg = err instanceof Error ? `${err.message}\n\n${err.stack}` : String(err);
    return new Response(`OG image error:\n${msg}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } finally {
    if (browser) await browser.close();
  }
}

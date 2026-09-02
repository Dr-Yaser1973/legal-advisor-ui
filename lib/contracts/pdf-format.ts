// lib/contracts/pdf-format.ts
// طبقة تنسيق موحّدة لمظهر عقود الـ PDF (تُستخدم من مسار الويب ومسار الموبايل معًا).
// الهدف: مظهر رسمي أنيق — إطار يحيط بكامل الصفحة، عنوان في الوسط،
// وإزالة حدود البوكسات الداخلية مع الحفاظ على وضوح المحتوى.

// إطار الصفحة: عنصر ثابت (position:fixed) يتكرّر تلقائيًا على كل صفحة عند الطباعة.
const PAGE_FRAME_HTML = `<div class="pdf-frame" aria-hidden="true"></div>`;

const OFFICIAL_CSS = `<style id="pdf-official-style">
  :root{
    --ink:#1b1b1b;
    --navy:#16324f;
    --navy-soft:#33506e;
    --muted:#5b6673;
    --hair:#d7dee6;
    --soft:#f5f7f9;
  }

  /* نترك أمر الهوامش الخارجية لخدمة الطباعة (page.pdf) ونلغي أي @page متعارض */
  @page { margin: 0; }

  html, body{
    direction: rtl;
    text-align: right;
    color: var(--ink);
    font-family: "Noto Naskh Arabic","Amiri","Cairo",Arial,serif;
    font-size: 14px;
    line-height: 1.95;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }
  /* هامش داخلي بسيط للنص (الفراغ الأساسي عن الإطار تصنعه هوامش page.pdf) */
  body{ margin: 2mm 3mm !important; padding: 0 !important; }

  /* ===== إطار الصفحة المزدوج (يتكرّر على كل صفحة) =====
     إزاحة سالبة تُخرج الإطار داخل هامش الطباعة، فيبقى فراغ ثابت بينه وبين
     النص على كل صفحة (بما فيها أعلى الصفحات التالية) ولا يتلامسان. */
  .pdf-frame{
    position: fixed;
    top: -10mm; right: -7mm; bottom: -10mm; left: -7mm;
    border: 1.5px solid var(--navy);
    pointer-events: none;
    z-index: 0;
  }
  .pdf-frame::before{
    content: "";
    position: absolute;
    top: 4px; right: 4px; bottom: 4px; left: 4px;
    border: 0.8px solid var(--navy-soft);
  }
  /* المحتوى فوق الإطار */
  .rtl{ position: relative; z-index: 1; }
  .rtl{ direction: rtl; unicode-bidi: plaintext; text-align: right; }

  /* ===== إزالة حدود البوكسات الداخلية كلها ===== */
  .box, .header, .hdr, .sig, .sbox, .w, .card, .section-box, .clause{
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
  }
  .box, .header, .hdr, .sec{
    padding: 0 !important;
    margin: 14px 0 !important;
  }

  /* ===== العنوان في وسط الصفحة ===== */
  h1, .title{
    text-align: center !important;
    color: var(--navy);
    font-weight: 800;
    font-size: 25px;
    letter-spacing: .3px;
    margin: 4px 0 6px !important;
    line-height: 1.4;
  }
  /* خط زخرفي أسفل العنوان */
  h1::after, .title::after{
    content: "";
    display: block;
    width: 120px;
    height: 2px;
    background: var(--navy);
    margin: 10px auto 0;
  }
  .subtitle, .header .muted, .hdr .muted, .header .subtitle{
    text-align: center !important;
    color: var(--muted) !important;
    font-size: 12.5px !important;
    margin: 0 0 8px !important;
  }
  /* رأس الوثيقة: نجعله عموديًا متمركزًا (يشمل قوالب flex الإنجليزية) */
  .header, .hdr{
    display: block !important;
    text-align: center !important;
  }
  .meta{
    display: flex !important;
    flex-wrap: wrap;
    justify-content: center !important;
    gap: 6px 18px !important;
    color: var(--muted) !important;
    font-size: 12px !important;
    margin-top: 6px !important;
  }
  .header, .hdr{ padding-bottom: 6px !important; }

  /* ===== عناوين الأقسام بلمسة كحلية ===== */
  h2, .h, .sec h3{
    color: var(--navy);
    font-weight: 800;
    font-size: 15.5px;
    margin: 18px 0 10px !important;
    padding: 0 10px 0 0 !important;
    border-right: 3px solid var(--navy) !important;
    border-bottom: none !important;
    line-height: 1.5;
  }

  p, .p{ margin: 7px 0; }
  b, strong{ color: #111; }
  .muted{ color: var(--muted); font-size: 12px; }

  /* القوائم */
  ol{ padding-right: 22px; margin: 6px 0; }
  ol.ol{ padding-right: 20px; }
  li{ margin: 7px 0; }

  /* ===== الجداول: بلا حدود إطلاقاً — تنظيم بالمسافات فقط ===== */
  table, .tbl{ width: 100%; border-collapse: collapse; margin: 6px 0; }
  table td, table th, .tbl td{
    border: none !important;
    background: transparent !important;
    padding: 6px 8px 6px 0 !important;
    vertical-align: top;
  }
  .th{
    background: transparent !important;
    font-weight: 800;
    color: var(--navy);
    white-space: nowrap;
    width: 90px;
  }

  /* ===== الشرط/الفقرة المميّزة: بلا صندوق أو خلفية — نص عادي ===== */
  .clause{
    background: transparent !important;
    border: none !important;
    padding: 2px 0 !important;
    margin: 8px 0 !important;
  }

  /* ===== التواقيع: أسطر أنيقة بلا صناديق ===== */
  .signs, .sig-row{ display: flex; gap: 26px; margin-top: 26px; }
  .sig, .sbox{ flex: 1; padding: 6px 0 0 !important; text-align: center; }
  .sig-h, .sbox b{ font-weight: 800; color: var(--navy); margin-bottom: 30px; display: block; }
  .sig-line, .w-line{ height: 0; border-bottom: 1px solid #111; margin: 0 6px; }
  .sig-name, .w-name{ margin-top: 8px; font-size: 12px; color: #333; }
  .witnesses{ display: flex; gap: 26px; margin-top: 14px; }
  .w{ flex: 1; text-align: center; }
  .w-h{ font-weight: 800; color: var(--navy); margin-bottom: 26px; display: block; }

  /* منع قطع العناصر الحسّاسة بين صفحتين */
  .box, .sec, .signs, .witnesses, .sig, .w, table tr{
    page-break-inside: avoid;
  }
  h1, h2, .h, .title{ page-break-after: avoid; }
</style>`;

// إزالة شارة "نموذج احترافي (PRO)" من العقود القديمة المحفوظة
// (القوالب الجديدة لم تعد تحتويها، لكن الـ htmlBody المحفوظ سابقًا يحملها).
function stripLegacyBadges(html: string): string {
  return html.replace(
    /<div[^>]*class=["'][^"']*\bsubtitle\b[^"']*["'][^>]*>\s*نموذج\s+احترافي[^<]*<\/div>/gi,
    ""
  );
}

export function normalizeContractHtml(inputHtml: string): string {
  const html = stripLegacyBadges((inputHtml ?? "").trim());
  if (!html) return "";

  const hasHtmlTag = /<html\b/i.test(html);
  const hasHeadTag = /<head\b/i.test(html);
  const hasBodyTag = /<body\b/i.test(html);

  if (hasHtmlTag && hasHeadTag && hasBodyTag) {
    // 1) ضمان dir=rtl و lang=ar على <html>
    let out = html.replace(/<html\b([^>]*)>/i, (_m, attrs: string) => {
      const hasDir = /\bdir\s*=\s*["']rtl["']/i.test(attrs);
      const hasLang = /\blang\s*=\s*["'][^"']+["']/i.test(attrs);
      const nextAttrs = [
        attrs?.trim() || "",
        hasLang ? "" : `lang="ar"`,
        hasDir ? "" : `dir="rtl"`,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();
      return `<html${nextAttrs ? " " + nextAttrs : ""}>`;
    });

    // 2) حقن تنسيق المظهر الرسمي قبل </head> (يأتي أخيرًا فيغلب بفضل !important)
    out = out.replace(/<\/head>/i, `${OFFICIAL_CSS}\n</head>`);

    // 3) حقن إطار الصفحة + لفّ المحتوى داخل .rtl
    out = out.replace(/<body\b([^>]*)>/i, `<body$1>${PAGE_FRAME_HTML}<div class="rtl">`);
    out = out.replace(/<\/body>/i, `</div></body>`);
    return out;
  }

  // Fragment: نلفّه داخل وثيقة كاملة رسمية RTL
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${OFFICIAL_CSS}
</head>
<body>
${PAGE_FRAME_HTML}
<div class="rtl">
${html}
</div>
</body>
</html>`;
}

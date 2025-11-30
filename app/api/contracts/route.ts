 
 import { NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

function assert(v: any, m: string): asserts v {
  if (!v) throw new Error(m);
}

export async function POST(req: Request) {
  try {
    const { title, content, footer } = await req.json();

    assert(title && typeof title === "string", "العنوان مطلوب");
    assert(content && typeof content === "string", "المحتوى مطلوب");

    // تحميل الخط
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Noto_Naskh_Arabic",
      "NotoNaskhArabic-VariableFont_wght.ttf"
    );
    const fontBytes = await fs.readFile(fontPath).catch(() => null);
    assert(fontBytes, `تعذر العثور على الخط في ${fontPath}`);

    // إنشاء PDF
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);
    const arabicFont = await pdf.embedFont(fontBytes, { subset: true });

    const page = pdf.addPage([595.28, 841.89]); // A4
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const margin = 50;

    // عنوان
    const titleSize = 20;
    const titleWidth = arabicFont.widthOfTextAtSize(title, titleSize);
    page.drawText(title, {
      x: (pageWidth - titleWidth) / 2,
      y: pageHeight - margin - titleSize,
      size: titleSize,
      font: arabicFont,
      color: rgb(0, 0, 0),
    });

    // نص المحتوى (تغليف أسطر يدوي بسيط)
    const bodyFontSize = 12;
    const lineHeight = 1.6 * bodyFontSize;
    const maxWidth = pageWidth - margin * 2;

    const wrapText = (txt: string) => {
      // تقسيم على السطور مع احترام عرض السطر
      const words = txt.replace(/\r/g, "").split(/\n|\s+/);
      const lines: string[] = [];
      let cur = "";
      for (const w of words) {
        const test = cur ? `${cur} ${w}` : w;
        const wpx = arabicFont.widthOfTextAtSize(test, bodyFontSize);
        if (wpx <= maxWidth) cur = test;
        else {
          if (cur) lines.push(cur);
          cur = w;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    };

    let cursorY = pageHeight - margin - titleSize - 24;
    const paragraphs = content.split(/\n{2,}/);
    for (const p of paragraphs) {
      const lines = wrapText(p);
      for (const ln of lines) {
        if (cursorY < margin + 40) {
          // صفحة جديدة
          cursorY = pageHeight - margin;
          const np = pdf.addPage([595.28, 841.89]);
          (np as any)._arabicReady = true; // no-op, فقط نستبدل المرجع
          (np as any).drawText = page.drawText.bind(np);
          (np as any).getWidth = () => pageWidth;
          (np as any).getHeight = () => pageHeight;
          (np as any).arabicFont = arabicFont;
        }
        page.drawText(ln, {
          x: margin,
          y: cursorY,
          size: bodyFontSize,
          font: arabicFont,
          color: rgb(0, 0, 0),
        });
        cursorY -= lineHeight;
      }
      cursorY -= lineHeight * 0.6;
    }

    // تذييل
    if (footer) {
      const footerSize = 10;
      const fw = arabicFont.widthOfTextAtSize(footer, footerSize);
      page.drawText(footer, {
        x: (pageWidth - fw) / 2,
        y: margin - footerSize,
        size: footerSize,
        font: arabicFont,
        color: rgb(0, 0, 0),
      });
    }

    const bytes = await pdf.save();
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          `${title}.pdf`
        )}"`,
      },
    });
  } catch (e: any) {
    console.error("contracts/pdf error:", e);
    return NextResponse.json({ ok: false, error: e?.message || "PDF error" }, { status: 500 });
  }
}

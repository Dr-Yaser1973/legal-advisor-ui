 // app/api/contracts/generated/[id]/pdf/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteParams = Promise<{ id: string }>;

function getPdfServiceBaseUrl() {
  const base = process.env.PDF_SERVICE_URL?.trim();
  if (!base) throw new Error("PDF_SERVICE_URL غير مضبوط في متغيرات البيئة.");
  return base.replace(/\/$/, "");
}

function normalizeContractHtml(inputHtml: string) {
  const html = (inputHtml ?? "").trim();
  if (!html) return "";

  // إذا كان محفوظ كوثيقة HTML كاملة، نحقن/نضمن RTL داخلها
  const hasHtmlTag = /<html\b/i.test(html);
  const hasHeadTag = /<head\b/i.test(html);
  const hasBodyTag = /<body\b/i.test(html);

  const rtlCss = `
    <style>
      html, body{
        direction: rtl;
        unicode-bidi: isolate;
        text-align: right;
        margin: 40px 50px;
        line-height: 1.9;
        font-family: "Cairo","Noto Naskh Arabic",Arial,sans-serif;
      }
      .rtl{
        direction: rtl;
        unicode-bidi: plaintext;
        text-align: right;
      }
      h1{ text-align:center; font-size:28px; margin:0 0 22px; }
      h2{ font-size:20px; margin:26px 0 10px; }
      p{ margin:10px 0; }
      ol{ padding-right:22px; }
      li{ margin:8px 0; }
    </style>
  `.trim();

  if (hasHtmlTag && hasHeadTag && hasBodyTag) {
    // 1) تأكد من dir=rtl و lang=ar على html
    let out = html
      .replace(/<html\b([^>]*)>/i, (m, attrs) => {
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

    // 2) حقن CSS قبل </head> إذا لم يكن موجودًا
    if (!/unicode-bidi:\s*plaintext/i.test(out)) {
      out = out.replace(/<\/head>/i, `${rtlCss}\n</head>`);
    }

    // 3) لفّ محتوى body داخل .rtl لضمان اتجاه السطر حتى لو داخل عناصر LTR
    out = out.replace(/<body\b([^>]*)>/i, `<body$1><div class="rtl">`);
    out = out.replace(/<\/body>/i, `</div></body>`);
    return out;
  }

  // إذا كان Fragment (بدون html/head/body) نلفّه داخل وثيقة كاملة RTL
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${rtlCss}
</head>
<body>
  <div class="rtl">
    ${html}
  </div>
</body>
</html>`;
}

export async function GET(_req: Request, context: { params: RouteParams }) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول لتحميل العقد." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      return NextResponse.json({ error: "معرف العقد غير صالح" }, { status: 400 });
    }

    const contract = await prisma.generatedContract.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        title: true,
        data: true,
        createdById: true, // إذا غير موجود في سكيمتك احذفه من هنا ومن التحقق أدناه
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "العقد غير موجود" }, { status: 404 });
    }

    const role = session?.user?.role;
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (
      role !== "ADMIN" &&
      contract.createdById &&
      userId &&
      contract.createdById !== userId
    ) {
      return NextResponse.json({ error: "غير مصرح لك بتحميل هذا العقد." }, { status: 403 });
    }

    const data = contract.data as any;
    const rawHtml = (data?.htmlBody ?? data?.html ?? "") as string;

    if (!rawHtml || typeof rawHtml !== "string") {
      return NextResponse.json(
        { error: "لا يوجد محتوى (HTML) محفوظ لهذا العقد" },
        { status: 400 }
      );
    }

    // ✅ هنا أصل الإصلاح: نضمن RTL داخل HTML قبل إرساله لـ Render
    const html = normalizeContractHtml(rawHtml);
    if (!html) {
      return NextResponse.json({ error: "HTML فارغ بعد المعالجة" }, { status: 400 });
    }

    const base = getPdfServiceBaseUrl();
    const url = `${base}/render/pdf`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = process.env.PDF_SERVICE_TOKEN?.trim();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        html,
        filename: `contract-${contract.id}.pdf`,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("PDF service error:", res.status, text);
      return NextResponse.json(
        { error: `فشل توليد PDF من خدمة Render (status ${res.status}).` },
        { status: 502 }
      );
    }

    const pdfArrayBuffer = await res.arrayBuffer();

    return new Response(pdfArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="contract-${contract.id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("contracts/generated/[id]/pdf error:", error);
    return NextResponse.json(
      { error: error?.message ?? "حدث خطأ أثناء تحميل العقد." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPdfServiceBaseUrl() {
  const base = process.env.PDF_SERVICE_URL?.trim();
  if (!base) throw new Error("PDF_SERVICE_URL غير مضبوط.");
  return base.replace(/\/$/, "");
}

function normalizeContractHtml(inputHtml: string) {
  const html = (inputHtml ?? "").trim();
  if (!html) return "";
  const rtlCss = `<style>
    html,body{direction:rtl;text-align:right;margin:40px 50px;line-height:1.9;font-family:"Cairo","Noto Naskh Arabic",Arial,sans-serif;}
    .rtl{direction:rtl;unicode-bidi:plaintext;text-align:right;}
    h1{text-align:center;font-size:28px;margin:0 0 22px;}
    h2{font-size:20px;margin:26px 0 10px;}
    p{margin:10px 0;} ol{padding-right:22px;} li{margin:8px 0;}
  </style>`;
  const hasFull = /<html\b/i.test(html) && /<head\b/i.test(html) && /<body\b/i.test(html);
  if (hasFull) {
    let out = html.replace(/<\/head>/i, `${rtlCss}\n</head>`);
    out = out.replace(/<body\b([^>]*)>/i, `<body$1><div class="rtl">`);
    out = out.replace(/<\/body>/i, `</div></body>`);
    return out;
  }
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"/>${rtlCss}</head><body><div class="rtl">${html}</div></body></html>`;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ التحقق بـ Bearer token (من query أو header)
    // WebView لا يرسل headers، لذا نقبل token عبر query param
    const url = new URL(req.url);
    const tokenFromQuery = url.searchParams.get("token");
    const authHeader = req.headers.get("authorization");
    const token = tokenFromQuery || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const payload = await verifyUserToken(token);
    const userId = Number(payload.sub);

    const { id } = await context.params;
    const numericId = Number(id);

    const contract = await prisma.generatedContract.findUnique({
      where: { id: numericId },
      select: { id: true, data: true, createdById: true },
    });

    if (!contract) {
      return NextResponse.json({ error: "العقد غير موجود" }, { status: 404 });
    }

    // التحقق من الملكية
    if (contract.createdById && contract.createdById !== userId && payload.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const data = contract.data as any;
    const rawHtml = (data?.htmlBody ?? data?.html ?? "") as string;
    if (!rawHtml) {
      return NextResponse.json({ error: "لا يوجد محتوى" }, { status: 400 });
    }

    const html = normalizeContractHtml(rawHtml);
    const base = getPdfServiceBaseUrl();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const pdfToken = process.env.PDF_SERVICE_TOKEN?.trim();
    if (pdfToken) headers["Authorization"] = `Bearer ${pdfToken}`;

    const res = await fetch(`${base}/render/pdf`, {
      method: "POST",
      headers,
      body: JSON.stringify({ html, filename: `contract-${contract.id}.pdf` }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "فشل توليد PDF" }, { status: 502 });
    }

    const pdfBuffer = await res.arrayBuffer();

    // ✅ inline بدلاً من attachment ليُعرض في WebView
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="contract-${contract.id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("mobile pdf error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

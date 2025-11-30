 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs/promises";
import path from "path";
import { parseLawArticles } from "@/lib/lawParser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  docId: number | string;
  mode?: "articles" | "text+articles";
  maxArticles?: number;
};

function resolvePublicPath(p: string) {
  const rel = p.startsWith("/") ? p.slice(1) : p;
  return path.join(process.cwd(), "public", rel);
}

function assert(cond: any, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const role = session?.user?.role?.toUpperCase?.() || "LAWYER";

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مخول. يتطلب صلاحية ADMIN." },
        { status: 403 },
      );
    }

    const { docId, mode = "articles", maxArticles = 2000 } =
      (await req.json()) as Body;

    assert(docId, "docId مطلوب.");

    const idNum = typeof docId === "string" ? Number(docId) : docId;
    assert(Number.isInteger(idNum), "docId يجب أن يكون رقمًا صحيحًا.");

    const doc = await prisma.lawDoc.findUnique({
      where: { id: idNum },
      select: {
        id: true,
        title: true,
        text: true,
        filePath: true,
      },
    });

    assert(doc, "المصدر غير موجود.");

    let baseText = doc.text ?? "";

    if (mode === "text+articles") {
      assert(doc.filePath, "لا يوجد ملف PDF مرتبط بهذا المصدر.");

      const absPath = resolvePublicPath(doc.filePath);
      const buf = await fs.readFile(absPath);
      const { extractPdfText } = await import("@/lib/pdf");

      const extracted = await extractPdfText(buf);

      assert(
        extracted && extracted.trim().length > 0,
        "تعذر استخراج النص من PDF.",
      );

      baseText = extracted;

      await prisma.lawDoc.update({
        where: { id: doc.id },
        data: { text: baseText },
      });
    }

    assert(baseText && baseText.trim().length > 0, "النص فارغ.");

    const articles = parseLawArticles(baseText);

    await prisma.lawArticle.deleteMany({
      where: { lawDocId: doc.id },
    });

    if (articles.length > 0) {
      const limited = articles.slice(
        0,
        Math.max(1, Math.min(maxArticles, 10000)),
      );

      await prisma.lawArticle.createMany({
        data: limited.map((a, idx) => ({
          lawDocId: doc.id,
          ordinal: a.ordinal ?? idx + 1,
          number: a.number ?? null,
          text: a.text,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      ok: true,
      docId: doc.id,
      title: doc.title,
      mode,
      articlesFound: articles.length,
    });
  } catch (e: any) {
    console.error("library/reindex error:", e);
    return NextResponse.json(
      { error: e?.message ?? "فشل إعادة بناء المواد" },
      { status: 500 },
    );
  }
}

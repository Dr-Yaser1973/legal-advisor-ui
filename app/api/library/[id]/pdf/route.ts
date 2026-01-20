 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// ===============================
// Supabase (SERVER ONLY)
// ===============================
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const lawUnitId = Number(id);

    if (!Number.isInteger(lawUnitId)) {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }

    // ===============================
    // نجيب مسار الملف من LawUnitDocument
    // ===============================
    const unit = await prisma.lawUnit.findUnique({
      where: { id: lawUnitId },
      include: {
        documents: {
          include: {
            document: {
              select: {
                filename: true, // مثال: laws/402e020ca4a2410d.pdf
              },
            },
          },
        },
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const filename = unit.documents[0]?.document?.filename;

    if (!filename) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // ===============================
    // تحميل من Supabase
    // ===============================
    const { data, error } = await supabase.storage
      .from("library")
      .download(filename); // ⚠️ بدون إضافة laws/ مرة ثانية

    if (error || !data) {
      console.error("SUPABASE DOWNLOAD ERROR:", error);
      return NextResponse.json(
        { error: "Failed to load PDF" },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await data.arrayBuffer());

    // ===============================
    // عرض فقط داخل المتصفح
    // ===============================
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=law.pdf",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("PDF PROXY ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

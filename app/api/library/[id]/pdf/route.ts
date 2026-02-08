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

// ===============================
// GET /api/library/[id]/pdf
// ===============================
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
    // جلب مسار الملف الحقيقي من DB
    // ===============================
    const unit = await prisma.lawUnit.findUnique({
      where: { id: lawUnitId },
      include: {
        documents: {
          include: {
            document: {
              select: {
                source: true, // مثال: laws/abc123.pdf
              },
            },
          },
        },
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const sourcePath = unit.documents[0]?.document?.source;

    if (!sourcePath) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // ===============================
    // Signed URL (10 دقائق)
    // ===============================
    const { data, error } = await supabase.storage
      .from("library")
      .createSignedUrl(sourcePath, 60 * 10);

    if (error || !data?.signedUrl) {
      console.error("SIGNED URL ERROR:", error);
      return NextResponse.json(
        { error: "Failed to access PDF" },
        { status: 500 }
      );
    }

    // ===============================
    // Redirect مباشر للمتصفح
    // ===============================
    return NextResponse.redirect(data.signedUrl);
  } catch (err) {
    console.error("PDF ROUTE ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

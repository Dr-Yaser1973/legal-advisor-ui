 // app/api/library/[id]/pdf/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

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

    // ===============================
    // جلب مسار الملف من DB
    // ===============================
     const item = await prisma.libraryItem.findUnique({
  where: { id },

  include: {
    itemDocuments: {
      include: {
        document: {
          select: {
            source: true
    // مثال: laws/abc123.pdf
              },
            },
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

     const sourcePath = item.itemDocuments[0]?.document?.source;

    if (!sourcePath) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // ===============================
    // زيادة عدد التحميلات
    // ===============================
    await prisma.libraryItem.update({
      where: { id },
      data: { downloads: { increment: 1 } }
    });

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
 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{ id: string }>;
};

const BUCKET = "library-documents";

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const requestId = Number(id);

    if (!Number.isFinite(requestId)) {
      return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 });
    }

    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user || user.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    if (!user.email) {
  return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
}

const dbOffice = await prisma.user.findUnique({
  where: { email: user.email },
  select: { id: true },
});

if (!dbOffice) {
  return NextResponse.json({ error: "مكتب الترجمة غير موجود" }, { status: 403 });
}

const officeId = dbOffice.id; // ✅ هذا هو المفتاح الصحيح


    const request = await prisma.translationRequest.findFirst({
      where: { id: requestId, officeId },
      include: {
        sourceDoc: {
          select: {
            filePath: true,
            filename: true,
            mimetype: true,
          },
        },
      },
    });

    if (!request || !request.sourceDoc?.filePath) {
      return NextResponse.json(
        { error: "الملف غير موجود" },
        { status: 404 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase غير متاح حاليًا" },
        { status: 500 }
      );
    }

    // 1️⃣ Signed URL
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(request.sourceDoc.filePath, 60);

    if (error || !data?.signedUrl) {
      throw error || new Error("Failed to create signed URL");
    }

    // 2️⃣ جلب الملف فعليًا
    const fileRes = await fetch(data.signedUrl);
    if (!fileRes.ok) {
      throw new Error("فشل جلب الملف من التخزين");
    }

    const buffer = await fileRes.arrayBuffer();

    // 3️⃣ إجبار التحميل
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          request.sourceDoc.mimetype || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          request.sourceDoc.filename || "document"
        )}"`,
      },
    });
  } catch (err) {
    console.error("🔥 download error:", err);
    return NextResponse.json(
      { error: "خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}

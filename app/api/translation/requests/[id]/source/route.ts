 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

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

    const officeId = Number(user.id);

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

    // 1️⃣ Signed URL
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(request.sourceDoc.filePath, 60);

    if (error || !data?.signedUrl) {
      throw error;
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
        "Content-Type": request.sourceDoc.mimetype || "application/octet-stream",
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

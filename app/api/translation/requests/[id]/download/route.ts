import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = Number(id);

    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // جلب الطلب
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        clientId: true,
        officeId: true,
        translatedFilePath: true,
        status: true,
      },
    });

    if (
      !request ||
      request.status !== "COMPLETED" ||
      !request.translatedFilePath
    ) {
      return NextResponse.json(
        { error: "الملف غير متاح" },
        { status: 404 }
      );
    }

    // 🔐 تحقق الصلاحيات
    const isAllowed =
      user.role === "ADMIN" ||
      user.id === request.clientId ||
      user.id === request.officeId;

    if (!isAllowed) {
      return NextResponse.json(
        { error: "غير مصرح بالوصول إلى الملف" },
        { status: 403 }
      );
    }

    // ⬇️ جلب الملف من Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("translations")
      .download(request.translatedFilePath);

    if (error || !data) {
      throw error || new Error("Download failed");
    }

    // إعادة الملف كبث PDF
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="translation-${requestId}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Download translation error:", err);
    return NextResponse.json(
      { error: "فشل تحميل الملف" },
      { status: 500 }
    );
  }
}


 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

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

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase غير متاح حاليًا" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase.storage
      .from("files")
      .download(request.translatedFilePath);

    if (error || !data) {
      throw error || new Error("Download failed");
    }

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

 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = Number(id);

    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user || user.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase غير متاح حاليًا" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const note = formData.get("note") as string | null;

    if (!file) {
      return NextResponse.json({ error: "الملف مطلوب" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "يسمح برفع ملفات PDF فقط" },
        { status: 400 }
      );
    }

    const officeId = Number(user.id);

    const request = await prisma.translationRequest.findFirst({
      where: {
        id: requestId,
        officeId,
        status: { in: ["IN_PROGRESS", "ACCEPTED"] },
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "الطلب غير موجود أو غير مسموح" },
        { status: 404 }
      );
    }

    const filePath = `translations/translation-${requestId}-${Date.now()}.pdf`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: signed } = await supabase.storage
      .from("files")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        translatedFilePath: filePath,
        translatedFileUrl: signed?.signedUrl ?? null,
        deliveredAt: new Date(),
        completedAt: new Date(),
        note: note ?? undefined,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Upload translation error:", err);
    return NextResponse.json(
      { error: "فشل رفع ملف الترجمة" },
      { status: 500 }
    );
  }
}

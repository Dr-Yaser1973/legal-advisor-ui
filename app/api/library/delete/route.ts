 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// ===============================
// Supabase (Service Role)
// ===============================
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ===============================
// DELETE /api/library/delete
// Body: { docId: number, soft?: boolean }
// ===============================
export async function DELETE(req: NextRequest) {
  try {
    // ===============================
    // 1) التحقق من الجلسة والصلاحيات
    // ===============================
    const session = (await getServerSession(authOptions as any)) as any;

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" },
        { status: 403 }
      );
    }

    // ===============================
    // 2) قراءة البيانات
    // ===============================
    const body = await req.json();
    const docId = Number(body?.docId);
    const softDelete = Boolean(body?.soft);

    if (!Number.isFinite(docId)) {
      return NextResponse.json(
        { ok: false, error: "معرّف غير صالح" },
        { status: 400 }
      );
    }

    // ===============================
    // 3) جلب القانون مع الروابط والملفات
    // ===============================
    const lawUnit = await prisma.lawUnit.findUnique({
      where: { id: docId },
      include: {
        documents: {
          include: {
            document: true,
          },
        },
      },
    });

    if (!lawUnit) {
      return NextResponse.json(
        { ok: false, error: "القانون غير موجود" },
        { status: 404 }
      );
    }

    // ===============================
    // 4) Soft Delete (أرشفة فقط)
    // ===============================
    if (softDelete) {
      await prisma.lawUnit.update({
        where: { id: lawUnit.id },
        data: {
          status: "ARCHIVED",
        },
      });

      // سجل تدقيق (اختياري إذا الجدول موجود)
      try {
        await prisma.auditLog.create({
          data: {
            userId: Number(session.user.id),
            action: "SOFT_DELETE_LAW_UNIT",
            meta: {
              lawUnitId: lawUnit.id,
              title: lawUnit.title,
            },
          },
        });
      } catch (e) {
        console.warn("AUDIT LOG WARNING:", e);
      }

      return NextResponse.json({
        ok: true,
        message: "تمت أرشفة القانون بنجاح",
      });
    }

    // ===============================
    // 5) حذف ملفات Supabase (إن وجدت)
    // ===============================
    for (const link of lawUnit.documents) {
      const filePath = link.document?.filename;

      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("library")
          .remove([filePath]);

        if (storageError) {
          console.warn(
            "SUPABASE DELETE WARNING:",
            filePath,
            storageError.message
          );
        }
      }
    }

    // ===============================
    // 6) حذف الأسئلة الشائعة
    // ===============================
    await prisma.lawDocFaq.deleteMany({
      where: { docId: lawUnit.id },
    });

    // ===============================
    // 7) حذف العلاقات القانونية
    // ===============================
    await prisma.lawRelation.deleteMany({
      where: {
        OR: [
          { fromId: lawUnit.id },
          { toId: lawUnit.id },
        ],
      },
    });

    // ===============================
    // 8) حذف روابط الربط
    // ===============================
    await prisma.lawUnitDocument.deleteMany({
      where: { lawUnitId: lawUnit.id },
    });

    // ===============================
    // 9) حذف المستندات القانونية نفسها
    // ===============================
    const legalDocIds = lawUnit.documents
      .map((d) => d.document?.id)
      .filter((id): id is number => Number.isFinite(id));

    if (legalDocIds.length > 0) {
      await prisma.legalDocument.deleteMany({
        where: {
          id: { in: legalDocIds },
        },
      });
    }

    // ===============================
    // 10) حذف القانون نفسه
    // ===============================
    await prisma.lawUnit.delete({
      where: { id: lawUnit.id },
    });

    // ===============================
    // 11) سجل التدقيق
    // ===============================
    try {
      await prisma.auditLog.create({
        data: {
          userId: Number(session.user.id),
          action: "HARD_DELETE_LAW_UNIT",
          meta: {
            lawUnitId: lawUnit.id,
            title: lawUnit.title,
            deletedDocuments: legalDocIds.length,
          },
        },
      });
    } catch (e) {
      console.warn("AUDIT LOG WARNING:", e);
    }

    return NextResponse.json({
      ok: true,
      message: "تم حذف القانون وجميع ملفاته وسجلاته بنجاح",
    });
  } catch (err: any) {
    console.error("FULL DELETE ERROR:", err);

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "فشل الحذف الكامل",
      },
      { status: 500 }
    );
  }
}

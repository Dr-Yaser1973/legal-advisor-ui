// app/api/admin/lawyer-approvals/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";
import { notifyUser } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرّح. هذه الواجهة لمدير النظام فقط." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const lawyerId = Number(id);
    if (!Number.isFinite(lawyerId) || lawyerId <= 0) {
      return NextResponse.json(
        { error: "معرّف المحامي غير صالح." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const action = body?.action as "approve" | "reject";
    const field = body?.field as "bio" | "avatar";

    if (!["approve", "reject"].includes(action) || !["bio", "avatar"].includes(field)) {
      return NextResponse.json(
        { error: "بيانات الطلب غير صالحة." },
        { status: 400 }
      );
    }

    const profile = await prisma.lawyerProfile.findUnique({
      where: { userId: lawyerId },
      select: {
        pendingBio: true,
        pendingAvatarPath: true,
        avatarPath: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "لم يتم العثور على ملف المحامي." },
        { status: 404 }
      );
    }

    let notifyTitle = "";
    let notifyBody = "";

    // ── النبذة ──
    if (field === "bio") {
      if (!profile.pendingBio) {
        return NextResponse.json(
          { error: "لا توجد نبذة معلّقة لهذا المحامي." },
          { status: 400 }
        );
      }

      if (action === "approve") {
        // نقل المعلّقة إلى المعتمدة، وتفريغ المعلّقة
        await prisma.lawyerProfile.update({
          where: { userId: lawyerId },
          data: { bio: profile.pendingBio, pendingBio: null },
        });
        notifyTitle = "تم اعتماد نبذتك ✅";
        notifyBody = "وافقت الإدارة على النبذة الجديدة، وأصبحت ظاهرة للزوّار.";
      } else {
        // رفض: تفريغ المعلّقة دون نقل
        await prisma.lawyerProfile.update({
          where: { userId: lawyerId },
          data: { pendingBio: null },
        });
        notifyTitle = "بخصوص نبذتك";
        notifyBody = "لم تُعتمد النبذة الجديدة. يمكنك تعديلها وإعادة إرسالها.";
      }
    }

    // ── الصورة ──
    if (field === "avatar") {
      if (!profile.pendingAvatarPath) {
        return NextResponse.json(
          { error: "لا توجد صورة معلّقة لهذا المحامي." },
          { status: 400 }
        );
      }

      const supabase = getSupabaseAdmin();

      if (action === "approve") {
        // حذف الصورة القديمة من التخزين (إن وُجدت) لتوفير المساحة
        if (profile.avatarPath && supabase) {
          try {
            await supabase.storage
              .from("lawyer-avatars")
              .remove([profile.avatarPath]);
          } catch {
            // تجاهل فشل الحذف — ليس حرجاً
          }
        }
        await prisma.lawyerProfile.update({
          where: { userId: lawyerId },
          data: {
            avatarPath: profile.pendingAvatarPath,
            pendingAvatarPath: null,
          },
        });
        notifyTitle = "تم اعتماد صورتك ✅";
        notifyBody = "وافقت الإدارة على الصورة الجديدة، وأصبحت ظاهرة للزوّار.";
      } else {
        // رفض: حذف الصورة المعلّقة من التخزين وتفريغ الحقل
        if (supabase) {
          try {
            await supabase.storage
              .from("lawyer-avatars")
              .remove([profile.pendingAvatarPath]);
          } catch {
            // تجاهل
          }
        }
        await prisma.lawyerProfile.update({
          where: { userId: lawyerId },
          data: { pendingAvatarPath: null },
        });
        notifyTitle = "بخصوص صورتك";
        notifyBody = "لم تُعتمد الصورة الجديدة. يمكنك رفع صورة أخرى.";
      }
    }

    // إشعار المحامي بالنتيجة (best-effort)
    try {
      await notifyUser({
        userId: lawyerId,
        title: notifyTitle,
        body: notifyBody,
      });
    } catch (notifyError) {
      console.error("فشل إشعار المحامي بنتيجة المراجعة:", notifyError);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/lawyer-approvals/[id] error:", e);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة القرار." },
      { status: 500 }
    );
  }
}

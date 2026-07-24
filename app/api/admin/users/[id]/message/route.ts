// app/api/admin/users/[id]/message/route.ts
// مراسلة الأدمن لمستخدم (شركة/مكتب/محامٍ): إشعار داخلي + Push + بريد إلكتروني.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notifyUser } from "@/lib/notify";
import mailer from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "هذه العملية للأدمن فقط." }, { status: 403 });
    }

    const { id } = await params;
    const userId = Number(id);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ ok: false, error: "معرّف غير صالح." }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!subject || !message) {
      return NextResponse.json(
        { ok: false, error: "العنوان والنص مطلوبان." },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    if (!target) {
      return NextResponse.json({ ok: false, error: "المستخدم غير موجود." }, { status: 404 });
    }

    // 1) إشعار داخلي + Push (best-effort)
    await notifyUser({ userId, title: subject, body: message }).catch(() => {});

    // 2) بريد إلكتروني (best-effort)
    let emailSent = false;
    if (target.email) {
      try {
        await mailer.sendMail({
          from: `"منصة المستشار القانوني" <${process.env.GMAIL_USER}>`,
          to: target.email,
          subject,
          html: `
            <div style="direction:rtl;font-family:tahoma;max-width:600px;margin:auto">
              <div style="background:#9A7D4A;padding:16px;border-radius:8px 8px 0 0;text-align:center">
                <h2 style="color:white;margin:0;font-size:18px">منصة المستشار القانوني الذكي</h2>
              </div>
              <div style="background:#f9f9f9;padding:20px;border-radius:0 0 8px 8px">
                <h3 style="margin-top:0">${subject}</h3>
                <p style="white-space:pre-wrap;line-height:1.8;color:#333">${message}</p>
                <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
                <p style="font-size:12px;color:#888">هذه رسالة من إدارة المنصّة.</p>
              </div>
            </div>
          `,
        });
        emailSent = true;
      } catch (e) {
        console.error("admin message email failed:", e);
      }
    }

    return NextResponse.json({ ok: true, emailSent });
  } catch (e: any) {
    console.error("ADMIN_MESSAGE_ERROR", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "فشل إرسال الرسالة." },
      { status: 500 }
    );
  }
}

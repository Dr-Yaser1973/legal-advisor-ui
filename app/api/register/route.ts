 // app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail, sendPendingReviewEmail } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      role, email, password, fullName, phone,
      barNumber, officeAddress,
      orgName, businessType,
      translationLangs,           // ← جديد: مكتب الترجمة
    } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { ok: false, message: "البريد وكلمة المرور ونوع الحساب مطلوبة." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "هذا البريد مسجّل مسبقًا." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // ── CLIENT ────────────────────────────────────────────────────────────────
    if (role === "CLIENT") {
      await prisma.user.create({
        data: {
          name: fullName || null,
          email: normalizedEmail,
          phone: phone || null,
          password: hashed,
          role: "CLIENT",
          status: "ACTIVE",
          isApproved: true,
        },
      });

      try { await sendWelcomeEmail(normalizedEmail, fullName); }
      catch (err) { console.error("Welcome email error:", err); }

      return NextResponse.json(
        { ok: true, message: "تم إنشاء الحساب بنجاح." },
        { status: 201 }
      );
    }

    // ── LAWYER ────────────────────────────────────────────────────────────────
    if (role === "LAWYER") {
      if (!fullName || !barNumber) {
        return NextResponse.json(
          { ok: false, message: "اسم المحامي ورقم هوية النقابة مطلوبان." },
          { status: 400 }
        );
      }

      await prisma.user.create({
        data: {
          name: fullName,
          email: normalizedEmail,
          phone: phone || null,
          password: hashed,
          role: "LAWYER",
          status: "PENDING",
          isApproved: false,
          lawyerProfile: {
            create: {
              barNumber,
              specialties: null,
              officeAddress: officeAddress || null,
              phone: phone || null,
            },
          },
        },
      });

      await notifyAdmins(
        "طلب تسجيل محامٍ جديد",
        `${fullName} طلب الانضمام كمحامٍ — رقم النقابة: ${barNumber}`
      );

      try { await sendPendingReviewEmail(normalizedEmail, fullName); }
      catch (err) { console.error("Pending email error:", err); }

      return NextResponse.json(
        { ok: true, pending: true, message: "تم إرسال طلب التسجيل — سيتم تفعيل حسابك بعد مراجعة الأدمن." },
        { status: 201 }
      );
    }

    // ── LAW_FIRM ─ TRANSLATION_OFFICE ─ COMPANY ───────────────────────────────
    if (role === "LAW_FIRM" || role === "TRANSLATION_OFFICE" || role === "COMPANY") {
      if (!orgName) {
        return NextResponse.json(
          { ok: false, message: "اسم المؤسسة مطلوب." },
          { status: 400 }
        );
      }

      // تحديد نوع المؤسسة في الـ schema
      const orgType =
        role === "LAW_FIRM"           ? "LAW_FIRM"
        : role === "TRANSLATION_OFFICE" ? "TRANSLATION_OFFICE"
        : "COMPANY";

      // بناء الوصف حسب نوع الدور
      const orgDescription =
        role === "TRANSLATION_OFFICE" && translationLangs
          ? `اللغات: ${translationLangs}`
          : businessType
          ? `نوع النشاط: ${businessType}`
          : null;

      const roleLabel =
        role === "LAW_FIRM"           ? "مكتب محاماة"
        : role === "TRANSLATION_OFFICE" ? "مكتب ترجمة"
        : "شركة";

             await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: fullName || orgName,
            email: normalizedEmail,
            phone: phone || null,
            password: hashed,
            role: orgType,
            status: "PENDING",
            isApproved: false,
            isManager: true,   // ← المدير العام للمؤسسة
          },
        });

        const org = await tx.organization.create({
          data: {
            name: orgName,
            type: orgType,
            email: normalizedEmail,
            phone: phone || null,
            description: orgDescription,
            isApproved: false,
            branches: {
              create: [{
                name: "المقر الرئيسي",
                city: officeAddress || "غير محدد",
                country: "IQ",
                email: normalizedEmail,
                phone: phone || null,
                address: officeAddress || null,
              }],
            },
          },
          include: { branches: true },
        });

        await tx.user.update({
          where: { id: newUser.id },
          data: { branchId: org.branches[0].id },
        });
      });

      await notifyAdmins(
        `طلب تسجيل ${roleLabel} جديد`,
        `${orgName} طلب الانضمام للمنصة${orgDescription ? ` — ${orgDescription}` : ""}`
      );

      try { await sendPendingReviewEmail(normalizedEmail, fullName || orgName); }
      catch (err) { console.error("Pending email error:", err); }

      return NextResponse.json(
        { ok: true, pending: true, message: "تم إرسال طلب التسجيل — سيتم تفعيل حسابك بعد مراجعة الأدمن." },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "نوع الحساب غير معروف." },
      { status: 400 }
    );

  } catch (err) {
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { ok: false, message: "حدث خطأ غير متوقع أثناء التسجيل." },
      { status: 500 }
    );
  }
}

// ─── helper: إشعار الأدمن ────────────────────────────────────────────────────
async function notifyAdmins(title: string, body: string) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  if (admins.length > 0) {
    await prisma.notification.createMany({
      data: admins.map((a) => ({ userId: a.id, title, body })),
    });
  }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail, sendPendingReviewEmail } from "@/lib/mailer";
import { signUserToken, signRefreshToken } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, email, password, fullName, phone,
            barNumber, officeAddress,
            orgName, businessType } = body;

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

    // ── CLIENT ──────────────────────────────────────────────────
    if (role === "CLIENT") {
      const user = await prisma.user.create({
        data: {
          name: fullName || null, email: normalizedEmail,
          phone: phone || null, password: hashed,
          role: "CLIENT", status: "ACTIVE", isApproved: true,
        },
      });

      try { await sendWelcomeEmail(normalizedEmail, fullName); } catch {}

      const token = await signUserToken({ id: user.id, role: user.role, isApproved: true });
      const refreshToken = await signRefreshToken(user.id);

      return NextResponse.json({
        ok: true,
        token,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      }, { status: 201 });
    }

    // ── LAWYER ──────────────────────────────────────────────────
    if (role === "LAWYER") {
      if (!fullName || !barNumber) {
        return NextResponse.json(
          { ok: false, message: "اسم المحامي ورقم هوية النقابة مطلوبان." },
          { status: 400 }
        );
      }

      await prisma.user.create({
        data: {
          name: fullName, email: normalizedEmail,
          phone: phone || null, password: hashed,
          role: "LAWYER", status: "PENDING", isApproved: false,
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

      const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((a) => ({
            userId: a.id,
            title: "طلب تسجيل محامٍ جديد",
            body: `${fullName} طلب الانضمام كمحامٍ — رقم النقابة: ${barNumber}`,
          })),
        });
      }

      try { await sendPendingReviewEmail(normalizedEmail, fullName); } catch {}

      // حساب PENDING لا يحصل على token — ينتظر موافقة الأدمن
      return NextResponse.json({
        ok: true,
        pending: true,
        message: "تم إرسال طلب التسجيل — سيتم تفعيل حسابك بعد مراجعة الأدمن.",
      }, { status: 201 });
    }

    // ── LAW_FIRM أو COMPANY ──────────────────────────────────────
    if (role === "LAW_FIRM" || role === "COMPANY") {
      if (!orgName) {
        return NextResponse.json(
          { ok: false, message: "اسم المؤسسة مطلوب." },
          { status: 400 }
        );
      }

      await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: fullName || orgName, email: normalizedEmail,
            phone: phone || null, password: hashed,
            role: role === "LAW_FIRM" ? "LAW_FIRM" : "COMPANY",
            status: "PENDING", isApproved: false,
          },
        });

        const org = await tx.organization.create({
          data: {
            name: orgName,
            type: role === "LAW_FIRM" ? "LAW_FIRM" : "COMPANY",
            email: normalizedEmail, phone: phone || null,
            description: businessType ? `نوع النشاط: ${businessType}` : null,
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

      const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((a) => ({
            userId: a.id,
            title: `طلب تسجيل ${role === "LAW_FIRM" ? "مكتب محاماة" : "شركة"} جديد`,
            body: `${orgName} طلب الانضمام للمنصة`,
          })),
        });
      }

      try { await sendPendingReviewEmail(normalizedEmail, fullName || orgName); } catch {}

      return NextResponse.json({
        ok: true,
        pending: true,
        message: "تم إرسال طلب التسجيل — سيتم تفعيل حسابك بعد مراجعة الأدمن.",
      }, { status: 201 });
    }

    return NextResponse.json(
      { ok: false, message: "نوع الحساب غير معروف." },
      { status: 400 }
    );

  } catch (err) {
    console.error("MOBILE_REGISTER_ERROR", err);
    return NextResponse.json(
      { ok: false, message: "حدث خطأ غير متوقع." },
      { status: 500 }
    );
  }
}

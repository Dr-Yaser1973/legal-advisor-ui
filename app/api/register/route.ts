 // app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, email, password, fullName, phone,
            // محامٍ
            barNumber, officeAddress,
            // مكتب محاماة / شركة
            orgName, orgType, businessType } = body;

    // ── التحقق الأساسي ──────────────────────────────────────────
    if (!email || !password || !role) {
      return NextResponse.json(
        { ok: false, message: "البريد وكلمة المرور ونوع الحساب مطلوبة." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "هذا البريد مسجّل مسبقًا." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // ── CLIENT ──────────────────────────────────────────────────
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
      return NextResponse.json({
        ok: true,
        message: "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.",
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
          name: fullName,
          email: normalizedEmail,
          phone: phone || null,
          password: hashed,
          role: "LAWYER",
          status: "PENDING",   // ينتظر موافقة الأدمن
          isApproved: false,
          lawyerProfile: {
            create: {
              specialties: null,
              officeAddress: officeAddress || null,
              phone: phone || null,
              bio: `رقم هوية النقابة: ${barNumber}`,
            },
          },
        },
      });

      // إشعار للأدمن
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      });
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((a) => ({
            userId: a.id,
            title: "طلب تسجيل محامٍ جديد",
            body: `${fullName} طلب الانضمام كمحامٍ — رقم النقابة: ${barNumber}`,
          })),
        });
      }

      return NextResponse.json({
        ok: true,
        pending: true,
        message: "تم إرسال طلب التسجيل — سيتم تفعيل حسابك بعد مراجعة الأدمن.",
      }, { status: 201 });
    }

    // ── COMPANY أو LAW_FIRM (مكتب محاماة) ──────────────────────
    if (role === "COMPANY" || role === "LAW_FIRM") {
      if (!orgName) {
        return NextResponse.json(
          { ok: false, message: "اسم المؤسسة مطلوب." },
          { status: 400 }
        );
      }

      // كل العمليات في transaction واحدة لتجنب Race Condition
      await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: fullName || orgName,
            email: normalizedEmail,
            phone: phone || null,
            password: hashed,
            role: "LAWYER",
            status: "PENDING",
            isApproved: false,
          },
        });

        const org = await tx.organization.create({
          data: {
            name: orgName,
            type: role === "LAW_FIRM" ? "LAW_FIRM" : "COMPANY",
            email: normalizedEmail,
            phone: phone || null,
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

      // إشعار للأدمن
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      });
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((a) => ({
            userId: a.id,
            title: `طلب تسجيل ${role === "LAW_FIRM" ? "مكتب محاماة" : "شركة"} جديد`,
            body: `${orgName} طلب الانضمام للمنصة${businessType ? ` — نوع النشاط: ${businessType}` : ""}`,
          })),
        });
      }

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
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { ok: false, message: "حدث خطأ غير متوقع أثناء التسجيل." },
      { status: 500 }
    );
  }
}
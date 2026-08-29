 // app/api/upload/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fileToText } from "@/lib/fileToText";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserPlanData } from "@/lib/plans";

export const runtime = "nodejs";

// أقصى حجم للملف المرفوع (بايت) — يمنع إغراق التخزين/المعالجة بملفات ضخمة.
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(req: Request) {
  try {
    // مصادقة + قصر المحامي الذكي على باقة الأعمال (permissions.smartLawyer)
    const session: any = await getServerSession(authOptions as any);
    const userId = session?.user?.id ? Number(session.user.id) : null;
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح. يرجى تسجيل الدخول." }, { status: 401 });
    }
    const planData = await getUserPlanData(userId);
    if (!planData?.permissions.smartLawyer) {
      return NextResponse.json(
        { error: "المحامي الذكي متاح لمشتركي باقة الأعمال فقط. يرجى الترقية.", upgradeRequired: true },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم رفع أي ملف" },
        { status: 400 }
      );
    }

    if (!file.type?.includes("pdf")) {
      return NextResponse.json(
        { error: "يرجى رفع ملف بصيغة PDF فقط" },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "حجم الملف كبير جداً. الحد الأقصى 15 ميغابايت." },
        { status: 413 }
      );
    }

    // 1️⃣ استخراج النص من ملف الـ PDF
    const text = await fileToText(file, file.name, file.type);

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "تعذر استخراج نص من هذا الملف" },
        { status: 400 }
      );
    }

    // 2️⃣ إنشاء سجل في جدول الملفات (LegalDocument أو ما يعادله عندك)
    const legalDoc = await prisma.legalDocument.create({
      data: {
        // عدِّل هذه الحقول حسب الـ schema عندك:
        title: file.name.replace(/\.pdf$/i, ""),
        filename: file.name,
        mimetype: file.type,
        size: file.size,
        createdById: userId, // نسبة المستند لرافعه (كان فارغاً → مستندات بلا مالك)
      },
    });

    // 3️⃣ إنشاء سجل في جدول المكتبة LawDoc حتى يظهر في صفحة /library
    const lawDoc = await prisma.lawDoc.create({
      data: {
        title: legalDoc.title ?? legalDoc.filename ?? file.name,
        jurisdiction: "العراق",
        category: "LAW",          // غيّرها إلى FIQH أو ACADEMIC_STUDY إذا احتجت
        year: new Date().getFullYear(),
        text,                     // 👈 أهم سطر: تخزين النص في LawDoc.text
      },
    });

    return NextResponse.json({
      ok: true,
      message: "تم رفع الملف واستخراج النص وحفظه في المكتبة",
      legalDocumentId: legalDoc.id,
      lawDocId: lawDoc.id,
    });
  } catch (err: any) {
    console.error("upload error:", err);
    return NextResponse.json(
      { error: err?.message ?? "فشل رفع الملف" },
      { status: 500 }
    );
  }
}

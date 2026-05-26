 // app/api/cases/[id]/memo/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chatCompletion } from "@/lib/ai";
import { buildMemoPDF } from "@/lib/pdf/memoPdf";
import { requireCaseAccess } from "@/lib/auth/guards";
 import { hasPermission, canPerformAction, consumePoints, logAiUsage } from "@/lib/plans";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = Number(idStr);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "معرّف القضية غير صالح." },
        { status: 400 }
      );
    }

    // ===============================
    // التحقق من الصلاحية والباقة
    // ===============================
    const auth = await requireCaseAccess(id);
    if (!auth.ok) return auth.res;

    const userId = Number(auth.user.id);

    // التحقق من صلاحية إدارة القضايا
    const { allowed: canManage } = await canPerformAction(userId, "AI_CONSULT");
    if (!canManage) {
      return NextResponse.json(
        {
          error: "إنشاء المذكرات غير متاح في باقتك الحالية. يرجى الترقية.",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // ===============================
    // جلب القضية
    // ===============================
    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) {
      return NextResponse.json(
        { error: "القضية غير موجودة" },
        { status: 404 }
      );
    }

    // ===============================
    // توليد المذكرة بـ GPT-5.5
    // ===============================
    const completion = await chatCompletion([
      {
        role: "system",
        content: `# الدور
أنت محامٍ عراقي متخصص تجيد الصياغة القانونية بالعربية الفصحى.

# الشخصية
دقيق، مهني، مباشر. لا تضف حشواً أو مقدمات غير ضرورية.

# معايير النجاح
- صياغة قانونية احترافية واضحة
- الاستناد للقانون العراقي حيثما أمكن
- هيكل منظم بترويسات واضحة
- لا تتجاوز 600 كلمة`,
      },
      {
        role: "user",
        content: `# بيانات القضية
- العنوان: ${c.title}
- المحكمة: ${c.court}
- النوع: ${c.type}
- الحالة: ${c.status}
- ملخص الوقائع: ${c.description}

# المطلوب
أعد مسوّدة مذكرة قانونية تشمل هذه الأقسام بالترتيب:
1. الوقائع
2. الأساس القانوني
3. التحليل القانوني
4. الطلبات`,
      },
    ]);

    const content = completion?.choices?.[0]?.message?.content || "";

    // ===============================
    // استهلاك النقاط بعد النجاح
    // ===============================
    try {
  await logAiUsage(userId, "AI_CONSULT");  // ← أضف هذا السطر
  await consumePoints(userId, "AI_CONSULT");
} catch (err) {
  console.error("Points consumption error:", err);
}

    // ===============================
    // تحليل أقسام المذكرة
    // ===============================
    const pick = (label: string) => {
      const rx = new RegExp(
        `${label}\\s*[:：]?([\\s\\S]*?)(?=\\n\\s*\\S+\\s*[:：]|$)`,
        "i"
      );
      const m = content.match(rx);
      return (m?.[1] || "").trim();
    };

    const facts = pick("الوقائع") || c.description;
    const legalBasis = pick("الأساس القانوني");
    const analysis = pick("التحليل") || pick("التحليل القانوني");
    const requests = pick("الطلبات");

    let partiesText = "";
    try {
      const parties = (c.parties as any[]) || [];
      partiesText = parties
        .map((p) => `${p.role || "طرف"}: ${p.name || ""}`)
        .join("، ");
    } catch {
      // تجاهل
    }

    // ===============================
    // بناء PDF
    // ===============================
    const pdfBytes = await buildMemoPDF({
      title: "مذكرة قانونية",
      caseTitle: c.title,
      court: c.court,
      partiesText: partiesText || "—",
      facts: facts || "—",
      legalBasis: legalBasis || "—",
      analysis: analysis || "—",
      requests: requests || "—",
      footerNote: "تم إنشاء هذه المذكرة إلكترونيًا عبر منصة المستشار القانوني.",
    });

    // ===============================
    // حفظ المستند وربطه بالقضية
    // ===============================
    const doc = await prisma.legalDocument.create({
      data: {
        title: `مذكرة - ${c.title}`,
        filename: `memo_case_${c.id}.pdf`,
        mimetype: "application/pdf",
        size: pdfBytes.byteLength,
      },
      select: { id: true },
    });

    await prisma.caseDocument.create({
      data: { caseId: c.id, documentId: doc.id },
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="memo_case_${c.id}.pdf"`,
        "X-Document-Id": String(doc.id),
      },
    });
  } catch (e: any) {
    console.error("Error generating memo:", e);
    return NextResponse.json(
      { error: e?.message ?? "حدث خطأ أثناء إنشاء المذكرة." },
      { status: 500 }
    );
  }
}
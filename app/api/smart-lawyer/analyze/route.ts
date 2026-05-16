 // app/api/smart-lawyer/analyze/route.ts
import { NextResponse } from "next/server";
import { fileToText } from "@/lib/fileToText";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { chatCompletion } from "@/lib/ai";
import { getUserPlanData } from "@/lib/plans";
import { JobStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let jobId: number | null = null;

  try {
    // ===============================
    // 1) التحقق من تسجيل الدخول
    // ===============================
    const session: any = await getServerSession(authOptions as any);
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) {
      return NextResponse.json(
        { error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 }
      );
    }

    // ===============================
    // 2) التحقق من الباقة — BUSINESS و ADMIN فقط
    // ===============================
    const planData = await getUserPlanData(userId);

    if (!planData) {
      return NextResponse.json(
        { error: "تعذر التحقق من بيانات الاشتراك." },
        { status: 500 }
      );
    }

    const isAllowed =
      planData.effectivePlan === "BUSINESS" ||
      session?.user?.role === "ADMIN";

    if (!isAllowed) {
      return NextResponse.json(
        {
          error: "المحامي الذكي متاح فقط لباقة الشركات. يرجى الترقية للاستفادة من هذه الميزة.",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // ===============================
    // 3) قراءة البيانات (نص / ملف)
    // ===============================
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string) || "";
    const rawTextInput = (form.get("text") as string) || "";

    let text = rawTextInput.trim();

    if (!text && file) {
      text = (await fileToText(file, file.name, file.type)).trim();
    }

    if (!text || text.length < 30) {
      return NextResponse.json(
        { error: "النص قصير أو غير موجود." },
        { status: 400 }
      );
    }

    // ===============================
    // 4) إنشاء AnalysisJob
    // ===============================
    const job = await prisma.analysisJob.create({
      data: {
        userId,
        filename: file?.name ?? "text-input",
        mimetype: file?.type ?? "text/plain",
        size: file?.size ?? null,
        status: JobStatus.QUEUED,
        startedAt: new Date(),
      },
    });

    jobId = job.id;

    // ===============================
    // 5) استدعاء GPT-5.5
    // ===============================
    const resp = await chatCompletion(
      [
        {
          role: "system",
          content: `# الدور
أنت محامٍ ممارس وخبير في التحليل القانوني وصياغة الآراء القانونية الرسمية، لديك خبرة عملية لا تقل عن 15 سنة، وتكتب بأسلوب مهني رصين ولغة عربية فصحى دقيقة.

# الإطار القانوني
تعمل ضمن الإطار العام للقانون العراقي، مع الاستئناس بالقواعد العامة في التشريعات العربية المقارنة عند الاقتضاء.

# قواعد التحليل
- التحليل يكون قانونيًا لا إنشائيًا
- تجنّب الجزم عند نقص المعطيات
- استخدم عبارات مثل: "يُحتمل"، "يُفهم"، "قد يُستدل"
- لا تخترع وقائع أو نصوص قانونية غير مذكورة

# شكل الإجابة
هيكل ثابت من خمسة أقسام بترويسات واضحة، بأسلوب يشبه المذكرات القانونية الرسمية.`,
        },
        {
          role: "user",
          content: `# النص القانوني المراد تحليله
${text}

# المطلوب
إعداد تحليل قانوني مهني موجز وفق الهيكل التالي:
1) ملخص الوقائع أو مضمون النص
2) التكييف القانوني المحتمل
3) الأساس أو الأسس القانونية المحتملة
4) الملاحظات والثغرات
5) الرأي القانوني المبدئي`,
        },
      ],
      { temperature: 0.1 }
    );

    const analysis =
      resp.choices[0]?.message?.content?.trim() || "تعذّر التحليل.";

    // ===============================
    // 6) حفظ الناتج
    // ===============================
    await prisma.analysisOutput.create({
      data: {
        jobId: job.id,
        kind: "LEGAL_OPINION",
        content: {
          title: title || "رأي قانوني",
          text,
          analysis,
          model: "gpt-5.5",
        },
      },
    });

    await prisma.analysisJob.update({
      where: { id: job.id },
      data: {
        status: JobStatus.SUCCEEDED,
        finishedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, jobId: job.id, analysis });
  } catch (e: any) {
    console.error("smart-lawyer analyze error:", e);

    if (jobId) {
      await prisma.analysisJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          error: String(e?.message ?? e),
          finishedAt: new Date(),
        },
      }).catch(() => null);
    }

    return NextResponse.json(
      { error: e?.message || "فشل التحليل" },
      { status: 500 }
    );
  }
}
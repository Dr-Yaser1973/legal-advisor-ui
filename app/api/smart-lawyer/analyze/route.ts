 // app/api/smart-lawyer/analyze/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { fileToText } from "@/lib/fileToText";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { JobStatus } from "@prisma/client";


export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const CHAT_MODEL = process.env.CHAT_MODEL ?? "gpt-4o-mini";

export async function POST(req: Request) {
  let jobId: number | null = null;

  try {
    // ===============================
    // 1) التحقق من الجلسة (اختياري لكن موصى به)
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
    // 2) قراءة البيانات (نص / ملف)
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
    // 3) إنشاء AnalysisJob
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
    // 4) البرومبت المحسّن
    // ===============================
    const system = `
أنت محامٍ ممارس وخبير في التحليل القانوني وصياغة الآراء القانونية الرسمية،
لديك خبرة عملية لا تقل عن 15 سنة، وتكتب بأسلوب مهني رصين ولغة عربية فصحى دقيقة.

تعمل ضمن الإطار العام للقانون العراقي، ومع الاستئناس بالقواعد العامة في
التشريعات العربية المقارنة عند الاقتضاء، ما لم يرد في النص ما يخالف ذلك.

التزم بما يلي:
- التحليل يكون قانونيًا لا إنشائيًا
- تجنّب الجزم عند نقص المعطيات
- استخدم عبارات مثل: "يُحتمل"، "يُفهم"، "قد يُستدل"
- لا تخترع وقائع أو نصوص قانونية غير مذكورة
`;

    const prompt = `
فيما يلي نص قانوني/واقعة قانونية يُراد تحليلها:

---
${text}
---

المطلوب:
إعداد تحليل قانوني مهني موجز، مع الالتزام الصارم بالهيكل التالي:

1) ملخص الوقائع أو مضمون النص
2) التكييف القانوني المحتمل
3) الأساس أو الأسس القانونية المحتملة
4) الملاحظات والثغرات
5) الرأي القانوني المبدئي

اكتب التحليل بلغة عربية فصحى رسمية، وبأسلوب يشبه المذكرات القانونية.
`;

    // ===============================
    // 5) استدعاء OpenAI
    // ===============================
    const resp = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.25,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    });

    const analysis =
      resp.choices[0]?.message?.content?.trim() || "تعذّر التحليل.";

    // ===============================
    // 6) حفظ الناتج في AnalysisOutput
    // ===============================
    await prisma.analysisOutput.create({
      data: {
        jobId: job.id,
        kind: "LEGAL_OPINION",
        content: {
          title: title || "رأي قانوني",
          text,
          analysis,
          model: CHAT_MODEL,
        },
      },
    });

    // ===============================
    // 7) إنهاء المهمة بنجاح
    // ===============================
    await prisma.analysisJob.update({
      where: { id: job.id },
      data: {
          status: JobStatus.SUCCEEDED,
        finishedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      jobId: job.id,
      analysis,
    });
  } catch (e: any) {
    console.error("smart-lawyer analyze error:", e);

    // تحديث حالة المهمة إلى FAILED إن وُجدت
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

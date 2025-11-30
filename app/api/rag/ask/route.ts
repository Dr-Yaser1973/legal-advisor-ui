 // app/api/rag/ask/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const questionRaw = body?.question ?? "";
    const lawDocId = body?.lawDocId as number | undefined;

    const question = String(questionRaw).trim();

    if (!question) {
      return NextResponse.json(
        { error: "الرجاء إرسال سؤال قانوني للتحليل." },
        { status: 400 }
      );
    }

    let context = "";
    let sources: { text: string; documentId?: number; distance?: number }[] = [];

    // 🧷 إذا أُرسل lawDocId نربط الاستشارة بالمستند المحدد
    if (lawDocId) {
      const doc = await prisma.lawDoc.findUnique({
        where: { id: lawDocId },
        include: {
          articles: {
            orderBy: { ordinal: "asc" },
          },
        },
      });

      if (!doc) {
        console.warn("LawDoc not found for id:", lawDocId);
      } else {
        if (doc.text && doc.text.trim()) {
          context = doc.text;
        } else if (doc.articles && doc.articles.length > 0) {
          context = doc.articles.map((a) => a.text ?? "").join("\n\n");
        }

        // نبني مصادر بسيطة من نفس النص (للعرض في الواجهة)
        if (context) {
          const paragraphs = context
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter((p) => p.length > 40);

          sources = paragraphs.slice(0, 3).map((p) => ({
            text: p,
            documentId: lawDocId,
          }));
        }
      }
    }

    // ✂️ تقليص النص حتى لا يكون طويلًا جدًا على النموذج
    const MAX_CHARS = 12000;
    const trimmedContext =
      context.length > MAX_CHARS ? context.slice(0, MAX_CHARS) : context;

    // 🧠 تجهيز الرسائل للنموذج
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "أنت مستشار قانوني عراقي خبير بالقانون المدني والتجاري والجزائي وقانون العقود. " +
          "مهمتك تحليل المستندات القانونية وإبداء رأي قانوني شامل ومتوازن، مع الإشارة إلى المخاطر والالتزامات والثغرات المحتملة، " +
          "وتقديم توصيات عملية بلغة عربية قانونية واضحة ومفهومة لغير المتخصص.",
      },
    ];

    let userContent = `السؤال القانوني:\n${question}`;

    if (trimmedContext) {
      userContent +=
        "\n\nنص المستند القانوني (أو أهم مقتطفاته) لتحليله:\n" + trimmedContext;
      userContent +=
        "\n\nيرجى تحليل هذا المستند من جميع النواحي القانونية (الالتزامات على كل طرف، المخاطر، الملاحظات على الصياغة، الثغرات المحتملة، الاقتراحات لتحسينه، وأي تحذيرات قانونية مهمة).";
    } else {
      userContent +=
        "\n\nلا يوجد مستند محدد مرفق في السياق، أجب بالاعتماد على معرفتك العامة مع توضيح أن الإجابة عامة وليست بديلاً عن مراجعة مستند فعلي.";
    }

    messages.push({
      role: "user",
      content: userContent,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ??
      "تعذر توليد إجابة قانونية في هذه اللحظة.";

    return NextResponse.json({
      answer,
      sources,
    });
  } catch (err) {
    console.error("rag/ask error:", err);
    return NextResponse.json(
      { error: "فشل التحليل الذكي للسؤال" },
      { status: 500 }
    );
  }
}

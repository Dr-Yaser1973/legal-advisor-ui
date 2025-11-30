 // lib/rag.ts
import { hybridSearch } from "./search";
import { chatCompletion } from "./ai";

export function buildRagPrompt(question: string, context: string) {
  return [
    {
      role: "system",
      content:
        "أنت مستشار قانوني عراقي خبير. استخدم فقط المعلومات الواردة في السياق للإجابة، مع لغة عربية قانونية واضحة.",
    },
    {
      role: "user",
      content: `السؤال: ${question}\n\nالسياق المتاح:\n${context}`,
    },
  ];
}

export function formatCitations(chunks: any[]) {
  if (!chunks?.length) return "";
  return (
    "\n\nالمصادر المستخدمة:\n" +
    chunks
      .map((c: any, idx: number) => `- [${idx + 1}] ${c.title ?? ""}`.trim())
      .join("\n")
  );
}

// دالة رئيسية تستخدم في /api/ai أو /api/ai/ask
export async function askLegalAdvisor(question: string) {
  const chunks = await hybridSearch(question, 8);
  const context = chunks.map((c: any) => c.text).join("\n\n---\n\n");

  const messages = buildRagPrompt(question, context);
  const res = await chatCompletion(messages);

  const answer = res.choices[0]?.message?.content ?? "";
  const citations = formatCitations(chunks);

  return {
    answer: (answer + citations).trim(),
    sources: chunks,
  };
}

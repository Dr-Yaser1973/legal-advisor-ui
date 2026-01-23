 // lib/rag.ts
import { hybridSearch, SearchResult } from "./search";
import { chatCompletion } from "./ai";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// ===============================
// بناء رسائل RAG للنموذج
// ===============================
export function buildRagMessages(
  question: string,
  context: string
): ChatMessage[] {
  return [
    {
      role: "system",
      content:
        "أنت مستشار قانوني عراقي خبير. استخدم فقط المعلومات الواردة في السياق للإجابة، مع لغة عربية قانونية واضحة. إذا لم يكن السياق كافيًا فاذكر ذلك صراحة.",
    },
    {
      role: "user",
      content: `السؤال:\n${question}\n\nالسياق المتاح:\n${context}`,
    },
  ];
}

// ===============================
// تنسيق المراجع
// ===============================
export function formatCitations(chunks: SearchResult[]) {
  if (!chunks?.length) return "";
  return (
    "\n\nالمصادر المستخدمة:\n" +
    chunks
      .map((c, idx) => `- [${idx + 1}] ${c.title}`.trim())
      .join("\n")
  );
}

// ===============================
// واجهة عالية المستوى
// ===============================
export async function askLegalAdvisor(question: string) {
  // 1) بحث هجين
  const chunks = await hybridSearch(question, 8);

  // 2) بناء السياق النصي من النوع الحقيقي
  const context = chunks
    .map((c, i) => `المقطع ${i + 1} (من: ${c.title})\n${c.snippet}`)
    .join("\n\n---\n\n");

  // 3) بناء الرسائل وإرسالها للنموذج
  const messages = buildRagMessages(question, context);
  const res = await chatCompletion(messages);

  const answer = res.choices[0]?.message?.content ?? "";
  const citations = formatCitations(chunks);

  return {
    answer: (answer + citations).trim(),
    sources: chunks,
  };
}

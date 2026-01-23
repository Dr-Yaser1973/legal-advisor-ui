 // lib/ai.ts
import OpenAI from "openai";

// ===============================
// Factory آمن — لا يُنفّذ إلا وقت الطلب
// ===============================
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return new OpenAI({ apiKey });
}

// ===============================
// Embeddings
// ===============================
export async function getEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAI();
  const model = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";

  const res = await openai.embeddings.create({
    model,
    input: text,
  });

  const embedding = res.data[0]?.embedding;
  if (!embedding) throw new Error("Failed to get embedding");

  return embedding;
}

// ===============================
// Chat Completion (Generic)
// ===============================
export async function chatCompletion(
  messages: any[],
  opts?: { model?: string; temperature?: number }
) {
  const openai = getOpenAI();
  const model = opts?.model ?? process.env.CHAT_MODEL ?? "gpt-4o-mini";

  return openai.chat.completions.create({
    model,
    messages,
    temperature: opts?.temperature ?? 0.2,
  });
}

// ===============================
// Legal Answer Generator
// ===============================
export async function generateAnswer(
  question: string,
  context: string
): Promise<string> {
  const messages = [
    {
      role: "system",
      content:
        "أنت مستشار قانوني عراقي خبير. أجب استنادًا إلى السياق المرسل فقط، وبأسلوب عربي قانوني واضح.",
    },
    {
      role: "user",
      content: `السؤال: ${question}\n\nالسياق المتاح:\n${context}`,
    },
  ];

  const res = await chatCompletion(messages);
  const answer = res.choices[0]?.message?.content ?? "";
  return answer.trim();
}

// ===============================
// Cosine Similarity
// ===============================
export function cosineSim(a: number[], b: number[]) {
  let dot = 0,
    na = 0,
    nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

//lip/ai.ts
import OpenAI from "openai";

// ===============================
// اللهجات المدعومة
// ===============================
export type Dialect = "formal" | "iraqi" | "egyptian" | "jordanian" | "auto";

const DIALECT_PROMPTS: Record<Dialect, string> = {
  formal: "",
  iraqi: "تحدث بالعامية العراقية الدارجة. استخدم مفردات بغدادية مألوفة وطبيعية. حافظ على المصطلحات القانونية بالفصحى فقط.",
  egyptian: "تحدث بالعامية المصرية الدارجة. استخدم مفردات قاهرية مألوفة وطبيعية. حافظ على المصطلحات القانونية بالفصحى فقط.",
  jordanian: "تحدث بالعامية الأردنية الشامية الدارجة. استخدم مفردات عمّانية مألوفة وطبيعية. حافظ على المصطلحات القانونية بالفصحى فقط.",
  auto: `حلّل لهجة المستخدم من سؤاله تلقائياً وأجب بنفس اللهجة.
- إذا كان السؤال بالعراقية → أجب بالعراقية
- إذا كان بالمصرية → أجب بالمصرية
- إذا كان بالأردنية أو الشامية → أجب بالشامية
- إذا كان بالفصحى → أجب بالفصحى
- إذا كانت اللهجة غير واضحة → أجب بالفصحى المبسطة
حافظ على المصطلحات القانونية بالفصحى دائماً بغض النظر عن اللهجة.`,
};

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
  opts?: {
    model?: string
    temperature?: number
    dialect?: Dialect
  }
) {
  const openai = getOpenAI();
  const model = opts?.model ?? process.env.CHAT_MODEL ?? "gpt-5.5";
  const supportsTemperature = !model.startsWith("gpt-5");

  const dialectPrompt = opts?.dialect ? DIALECT_PROMPTS[opts.dialect] : "";
  const dialectMessages = dialectPrompt ? [{
    role: "system" as const,
    content: dialectPrompt,
  }] : [];

  return openai.chat.completions.create({
    model,
    messages: [...dialectMessages, ...messages],
    ...(supportsTemperature ? { temperature: opts?.temperature ?? 0.1 } : {}),
  });
}

// ===============================
// Legal Answer Generator
// ===============================
export async function generateAnswer(
  question: string,
  context: string,
  dialect: Dialect = "auto"
): Promise<string> {
  const messages = [
    {
      role: "system",
      content: `# الدور
أنت مستشار قانوني عراقي متخصص. مهمتك تحليل المسائل القانونية وتقديم توصيات عملية مبنية على السياق المقدم فقط.

# الشخصية
كن مباشراً ومهنياً. استخدم اللغة العربية القانونية المبسطة. لا تضف مقدمات أو تعليقات غير ضرورية.

# معايير النجاح
- الإجابة مبنية على السياق المقدم فقط
- تتضمن تقييماً قانونياً واضحاً
- تتضمن توصيات عملية قابلة للتنفيذ
- لا تتجاوز 300 كلمة

# قواعد التوقف
إذا كان السياق غير كافٍ للإجابة، اذكر ما ينقص بدلاً من التخمين.`,
    },
    {
      role: "user",
      content: `# المطلوب\n${question}\n\n# السياق المتاح\n${context}\n\n# شكل الإجابة\n1. التقييم القانوني\n2. المخاطر المحتملة\n3. التوصيات العملية`,
    },
  ];

  const res = await chatCompletion(messages, { dialect });
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
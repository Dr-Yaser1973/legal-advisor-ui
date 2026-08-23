// lib/analytics/channel.ts
// تصنيف مصدر الزيارة (Channel) اعتماداً على الـ Referrer ووسوم UTM.
// يُستخدم في نقطة التتبّع /api/track/visit وفي صفحة تحليلات الأدمن.

export type Channel =
  | "direct"
  | "google"
  | "bing"
  | "yahoo"
  | "twitter"
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "telegram"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "email"
  | "referral";

// تسميات عربية لعرضها في لوحة الأدمن
export const CHANNEL_LABELS: Record<Channel, string> = {
  direct: "دخول مباشر",
  google: "بحث Google",
  bing: "بحث Bing",
  yahoo: "بحث Yahoo",
  twitter: "منصة X (تويتر)",
  facebook: "فيسبوك",
  instagram: "إنستغرام",
  whatsapp: "واتساب",
  telegram: "تيليغرام",
  linkedin: "لينكدإن",
  youtube: "يوتيوب",
  tiktok: "تيك توك",
  email: "بريد إلكتروني",
  referral: "إحالة من موقع آخر",
};

// لون مميّز لكل قناة (Tailwind) للاستخدام في أشرطة التوزيع
export const CHANNEL_COLORS: Record<Channel, string> = {
  direct: "bg-zinc-400",
  google: "bg-emerald-500",
  bing: "bg-teal-500",
  yahoo: "bg-purple-500",
  twitter: "bg-sky-400",
  facebook: "bg-blue-600",
  instagram: "bg-pink-500",
  whatsapp: "bg-green-500",
  telegram: "bg-cyan-500",
  linkedin: "bg-blue-400",
  youtube: "bg-red-500",
  tiktok: "bg-zinc-200",
  email: "bg-amber-500",
  referral: "bg-indigo-400",
};

// خريطة نطاقات المُحيلين إلى القنوات
const HOST_RULES: { test: RegExp; channel: Channel }[] = [
  { test: /(^|\.)google\./i, channel: "google" },
  { test: /(^|\.)bing\.com$/i, channel: "bing" },
  { test: /(^|\.)(yahoo|search\.yahoo)\./i, channel: "yahoo" },
  { test: /(^|\.)(t\.co|twitter\.com|x\.com)$/i, channel: "twitter" },
  { test: /(^|\.)(facebook\.com|fb\.com|m\.facebook\.com|l\.facebook\.com|lm\.facebook\.com)$/i, channel: "facebook" },
  { test: /(^|\.)instagram\.com$/i, channel: "instagram" },
  { test: /(^|\.)(whatsapp\.com|wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)$/i, channel: "whatsapp" },
  { test: /(^|\.)(t\.me|telegram\.org|telegram\.me)$/i, channel: "telegram" },
  { test: /(^|\.)(linkedin\.com|lnkd\.in)$/i, channel: "linkedin" },
  { test: /(^|\.)(youtube\.com|youtu\.be)$/i, channel: "youtube" },
  { test: /(^|\.)tiktok\.com$/i, channel: "tiktok" },
];

// وسوم UTM medium الشائعة للبريد
const EMAIL_MEDIUMS = /^(email|e-mail|newsletter|mail)$/i;

/**
 * يصنّف الزيارة إلى قناة.
 * @param referrer  قيمة document.referrer (قد تكون فارغة)
 * @param selfHost  نطاق المنصة نفسها (لاستبعاد التنقّل الداخلي واعتباره مباشراً)
 * @param utm       وسوم UTM الملتقطة من رابط الوصول
 */
export function classifyChannel(
  referrer: string | null | undefined,
  selfHost: string | null | undefined,
  utm?: { source?: string | null; medium?: string | null }
): Channel {
  // 1) وسوم UTM لها الأولوية (روابط الحملات مثل واتساب/تويتر تُوسم يدوياً غالباً)
  const src = (utm?.source || "").toLowerCase().trim();
  const medium = (utm?.medium || "").toLowerCase().trim();

  if (medium && EMAIL_MEDIUMS.test(medium)) return "email";
  if (src) {
    if (/whatsapp|wa/.test(src)) return "whatsapp";
    if (/twitter|x\b/.test(src)) return "twitter";
    if (/facebook|fb/.test(src)) return "facebook";
    if (/instagram|ig/.test(src)) return "instagram";
    if (/telegram|tg/.test(src)) return "telegram";
    if (/linkedin/.test(src)) return "linkedin";
    if (/youtube|yt/.test(src)) return "youtube";
    if (/tiktok/.test(src)) return "tiktok";
    if (/google/.test(src)) return "google";
    if (/bing/.test(src)) return "bing";
    if (/newsletter|email|mail/.test(src)) return "email";
  }

  // 2) لا referrer ولا UTM → دخول مباشر (رابط مكتوب، إشارة مرجعية، تطبيق بلا referrer)
  if (!referrer) return "direct";

  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "direct";
  }

  // 3) نفس النطاق → تنقّل داخلي، نعتبره جزءاً من نفس الجلسة (مباشر)
  if (selfHost && (host === selfHost || host.endsWith(`.${selfHost}`))) {
    return "direct";
  }

  // 4) مطابقة نطاق المُحيل
  for (const rule of HOST_RULES) {
    if (rule.test.test(host)) return rule.channel;
  }

  // 5) أي موقع خارجي آخر → إحالة
  return "referral";
}

// كشف بسيط للبوتات عبر User-Agent (JS الأول-طرفي يستبعد أغلبها أصلاً)
const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegrambot|headless|lighthouse|pagespeed|gtmetrix|monitor|uptime|preview|scan|curl|wget|python-requests|axios|node-fetch/i;

export function isBot(ua: string | null | undefined): boolean {
  if (!ua) return true; // بلا User-Agent = مشبوه
  return BOT_UA.test(ua);
}

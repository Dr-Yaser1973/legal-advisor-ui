// data/promoBanners.ts
// ─────────────────────────────────────────────────────────────
//  الشريط الإعلاني المتحرك — عدّل هذه القائمة متى شئت.
//
//  • لإضافة إعلان جديد:   انسخ عنصراً كاملاً وغيّر محتواه.
//  • لإخفاء إعلان مؤقتاً:  اجعل enabled: false  (يبقى محفوظاً لكن لا يظهر).
//  • الترتيب في الظهور:    حسب ترتيب العناصر هنا من الأعلى للأسفل.
//  • gradient:             لون الخلفية بصيغة CSS عادية (بدون Tailwind).
//  • href:                 وجهة الزر عند الضغط. external: true للروابط الخارجية.
//
//  ملاحظة: النصوص ثنائية اللغة (ar / en) وتتبدّل تلقائياً حسب لغة الصفحة.
// ─────────────────────────────────────────────────────────────

export type PromoBannerText = {
  title: string;
  subtitle: string;
  cta: string;
};

export type PromoBanner = {
  id: string;
  enabled: boolean;
  href: string;
  external?: boolean;
  emoji: string;
  /** خلفية البطاقة — تدرّج CSS عادي */
  gradient: string;
  ar: PromoBannerText;
  en: PromoBannerText;
};

export const promoBanners: PromoBanner[] = [
  {
    id: "certified-translation",
    enabled: true,
    href: "/translate",
    emoji: "🌐",
    gradient: "linear-gradient(135deg,#059669 0%,#0d9488 50%,#0891b2 100%)",
    ar: {
      title: "الترجمة القانونية المعتمدة",
      subtitle:
        "ترجمة رسمية معتمدة لعقودك ووثائقك عبر مكاتب مسجّلة — بسرعة وموثوقية.",
      cta: "اطلب الآن",
    },
    en: {
      title: "Certified Legal Translation",
      subtitle:
        "Official certified translation of your contracts and documents via registered offices.",
      cta: "Request now",
    },
  },
  {
    id: "contracts",
    enabled: true,
    href: "/contracts",
    emoji: "📄",
    gradient: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#9333ea 100%)",
    ar: {
      title: "مكتبة العقود الجاهزة",
      subtitle: "أكثر من ٤٠ عقداً احترافياً ثنائي اللغة، جاهز للتخصيص والتحميل.",
      cta: "تصفّح العقود",
    },
    en: {
      title: "Ready-Made Contracts Library",
      subtitle: "40+ professional bilingual contracts, ready to customize and download.",
      cta: "Browse contracts",
    },
  },
  {
    id: "consultations",
    enabled: true,
    href: "/consultations",
    emoji: "⚖️",
    gradient: "linear-gradient(135deg,#0b1f3a 0%,#1e3a8a 50%,#2563eb 100%)",
    ar: {
      title: "استشارة قانونية أولى مجاناً",
      subtitle: "استشر مستشاراً ذكياً فوراً، أو تواصل مع محامٍ متخصص.",
      cta: "ابدأ استشارتك",
    },
    en: {
      title: "First Legal Consultation Free",
      subtitle: "Get instant AI advice, or connect with a specialized lawyer.",
      cta: "Start now",
    },
  },
];

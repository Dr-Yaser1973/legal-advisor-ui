// lib/i18n/dictionaries/home.ts
// نصوص الصفحة الرئيسية. منقولة من app/page.tsx إلى قاموس مركزي.

import type { Locale } from "../config";

const ar = {
  heroTitle: "بوابة للخدمات القانونية الرقمية",
  heroSubtitle:
    "وصول سريع إلى المكتبة القانونية، توليد العقود، الترجمة القانونية، والاستشارات — بتجربة مؤسسية جاذبة تعمل بسلاسة على الموبايل.",
  heroPrimary: "الدخول إلى المكتبة القانونية",
  heroTranslate: "ترجمة قانونية معتمدة",

  quickActionsTitle: "الخدمات الأساسية",
  quickActionsHint:
    "اختر خدمة للبدء. المكتبة متاحة للعامة بدون تسجيل — بينما الخدمات المهنية تتطلب حسابًا.",
  quickExampleLabel: "مثال استخدام:",
  quickExample:
    "تصفح مادة قانونية ← اقرأ PDF الأصلي ← اطلب شرحًا مبسطًا/عمليًا/مهنيًا عند الحاجة.",

  servicesTitle: "دليل الخدمات",
  servicesSubtitle:
    "خدمات قانونية رقمية مصممة لتناسب المستخدم العادي والمهني والمؤسسات.",

  guideBannerTitle: "لست متأكداً من أين تبدأ؟",
  guideBannerDesc:
    "دليل مبسّط خطوة بخطوة لكل دور — المستخدم، المحامي، المكتب، الشركة.",
  guideBannerBtn: "كيف تستخدم المنصة",

  audiencesTitle: "الفئات المستفيدة",
  audiencesSubtitle:
    "بوابة موحّدة تخدم الأفراد والمحامين والشركات ومكاتب الترجمة.",

  trustTitle: "الخصوصية والموثوقية",
  trustSubtitle:
    "تم تصميم المنصة وفق مبادئ السلامة الرقمية وتجربة استخدام رسمية.",

  mobileCta: "المكتبة القانونية",

  badges: {
    public: "متاح للعامة",
    accountRequired: "يتطلب حساب",
    noAi: "بلا ذكاء اصطناعي",
    firms: "للشركات والمكاتب",
  },

  services: {
    library: {
      title: "المكتبة القانونية",
      desc: "بحث وقراءة وPDF أصلي وشرح متعدد المستويات.",
    },
    consultations: {
      title: "الاستشارات",
      desc: "ثلاثة مسارات: ذكية فورية، محامٍ معتمد، أو مكتب محاماة.",
    },
    translate: {
      title: "الترجمة القانونية",
      desc: "ذكية فورية بخمس لغات، أو رسمية معتمدة من المكاتب.",
    },
    contracts: {
      title: "توليد العقود",
      desc: "عقود اعتيادية ودولية بنماذج موثوقة + توليد PDF.",
    },
    cases: {
      title: "إدارة القضايا",
      desc: "متابعة القضايا والملفات والمهام والمواعيد.",
    },
    smartLawyer: {
      title: "المحامي الذكي",
      desc: "تحليل المخاطر القانونية وتوليد المذكرات للقضايا.",
    },
  },

  trust: [
    {
      title: "حماية البيانات",
      desc: "ضوابط وصول وأذونات واضحة للبيانات والملفات.",
    },
    {
      title: "مخرجات قانونية احترافية",
      desc: "قوالب عقود وتوثيق منظم لطلبات الخدمات.",
    },
    {
      title: "جاهزية الموبايل",
      desc: "واجهة خفيفة وسريعة مناسبة للأجهزة المحمولة.",
    },
  ],

  audience: [
    {
      title: "المستخدم العادي",
      points: ["تصفح وبحث", "نماذج عقود", "استشارات عند الحاجة"],
    },
    {
      title: "المحامي",
      points: ["حضور مهني", "طلبات واستشارات", "مكتبة قوية للبحث"],
    },
    {
      title: "الشركات",
      points: ["إدارة قضايا", "عقود مؤسسية", "ملفات وامتثال"],
    },
    {
      title: "مكتب ترجمة",
      points: ["طلبات منظمة", "رفع صور/مسح", "مسار ترجمة رسمية"],
    },
  ],
};

export type HomeDict = typeof ar;

const en: HomeDict = {
  heroTitle: "The Gateway for Digital Legal Services",
  heroSubtitle:
    "Fast access to the legal library, contract generation, legal translation, and consultations — with an institutional, mobile-first experience.",
  heroPrimary: "Open Legal Library",
  heroTranslate: "Certified Legal Translation",

  quickActionsTitle: "Core Services",
  quickActionsHint:
    "Pick a service to start. The library is public (no sign-in). Professional services require an account.",
  quickExampleLabel: "Example:",
  quickExample:
    "Browse a legal unit → open the original PDF → request a simplified/practical/pro explanation when needed.",

  servicesTitle: "Services Directory",
  servicesSubtitle:
    "Digital legal services designed for individuals, professionals, and organizations.",

  guideBannerTitle: "Not sure where to start?",
  guideBannerDesc:
    "A simple step-by-step guide for every role — user, lawyer, office, company.",
  guideBannerBtn: "How to Use the Platform",

  audiencesTitle: "Who Is It For?",
  audiencesSubtitle:
    "A unified portal serving individuals, lawyers, companies, and translation offices.",

  trustTitle: "Privacy & Reliability",
  trustSubtitle:
    "Built with digital safety principles and an official user experience in mind.",

  mobileCta: "Legal Library",

  badges: {
    public: "Public",
    accountRequired: "Account required",
    noAi: "No AI",
    firms: "Firms & companies",
  },

  services: {
    library: {
      title: "Legal Library",
      desc: "Search, read, original PDFs, and layered explanations.",
    },
    consultations: {
      title: "Consultations",
      desc: "Three paths: instant AI, certified lawyer, or law firm.",
    },
    translate: {
      title: "Legal Translation",
      desc: "Instant AI in five languages, or official certified by offices.",
    },
    contracts: {
      title: "Contract Generation",
      desc: "Standard and international contracts with trusted templates + PDF.",
    },
    cases: {
      title: "Case Management",
      desc: "Track cases, files, tasks, and dates.",
    },
    smartLawyer: {
      title: "Smart Lawyer",
      desc: "Legal risk analysis and memo generation for cases.",
    },
  },

  trust: [
    {
      title: "Data Protection",
      desc: "Clear access controls and secure handling for documents.",
    },
    {
      title: "Professional Output",
      desc: "Structured workflows and professional contract templates.",
    },
    {
      title: "Mobile-First",
      desc: "Fast, lightweight interface optimized for mobile devices.",
    },
  ],

  audience: [
    {
      title: "Individuals",
      points: ["Browse & search", "Contract templates", "On-demand advice"],
    },
    {
      title: "Lawyers",
      points: [
        "Professional presence",
        "Requests & consultations",
        "Powerful research library",
      ],
    },
    {
      title: "Companies",
      points: ["Case management", "Corporate contracts", "Files & compliance"],
    },
    {
      title: "Translation Offices",
      points: [
        "Organized requests",
        "Image/scan upload",
        "Official translation flow",
      ],
    },
  ],
};

export const home: Record<Locale, HomeDict> = { ar, en };

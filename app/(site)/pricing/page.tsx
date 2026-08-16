 // app/(site)/pricing/page.tsx
import Link from "next/link";
import { getLocale } from "@/lib/i18n/server";
import { resolveLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "الأسعار والباقات | Pricing",
  description: "اختر الباقة المناسبة لك: مجاني، أفراد، محامون، أو شركات. Choose your plan: Free, Individual, Lawyer, or Business.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "باقات المستشار القانوني الذكي",
    description: "باقات مرنة تناسب الأفراد والمحامين والشركات.",
    url: "https://smartlegaladvisor.com/pricing",
  },
};

type Props = { searchParams?: Promise<{ lang?: string }> };

const WHATSAPP_NUMBER = "9647719183785";
const SUPPORT_EMAIL = "yaseralzbadi@googlemail.com";

const formatNum = (n: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "ar" ? "ar-IQ" : "en-US").format(n);

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ===============================
// أنواع البيانات
// ===============================
type PlanId = "free" | "individual" | "lawyer" | "translation" | "business";

type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  priceIQD: number;
  period: string;
  badge?: string;
  recommended?: boolean;
  points?: number;
  features: { text: string; included: boolean }[];
  ctaLabel: string;
  ctaType: "whatsapp" | "contact" | "register";
  whatsappMessage?: string;
};

type PointsPackage = {
  points: number;
  priceIQD: number;
  label: string;
  saving?: string;
};

// ===============================
// نصوص الواجهة حسب اللغة
// ===============================
const UI = {
  ar: {
    badge: "التفعيل خلال دقائق عبر التواصل المباشر",
    titleA: "خطط وأسعار منصة ",
    titleB: "المستشار القانوني",
    subtitle:
      "اختر الخطة الأنسب لاحتياجك: ابدأ مجاناً، أو اشترك في باقة تناسب طبيعة عملك — للأفراد، الشركات، المحامين، أو مكاتب الترجمة.",
    currency: "العملة: دينار عراقي",
    instant: "التفعيل فوري عبر واتساب",
    cancelAny: "ترقية أو إلغاء في أي وقت",
    recommended: "موصى بها",
    free: "مجاناً",
    dinar: "دينار",
    includesPoints: (n: number) => `يشمل ${n} نقطة شهرياً`,
    monthlyNote: "اشتراك شهري — يمكنك الترقية أو الإلغاء متى شئت.",
    ctaRegisterNote: "لا يلزم بطاقة ائتمان.",
    ctaWhatsappNote: "يفتح محادثة واتساب برسالة جاهزة.",
    ctaContactNote: "سيتم تحويلك لصفحة التواصل.",
    pointsTitleA: "نظام ",
    pointsTitleB: "النقاط",
    pointsSubtitle: "لمشتركي باقة الأفراد والمحامين — اشترِ نقاطاً إضافية في أي وقت.",
    consumptionTitle: "استهلاك النقاط",
    consumption: [
      { label: "استشارة ذكية", points: 1 },
      { label: "ترجمة ذكية", points: 2 },
      { label: "استشارة بشرية", points: 5 },
    ],
    point: "نقطة",
    buyNow: "اشترِ الآن",
    compareA: "مقارنة ",
    compareB: "الباقات",
    colFeature: "الميزة",
    colFree: "مجاني",
    colIndividual: "أفراد",
    colLawyer: "محامون",
    colTranslation: "ترجمة",
    colBusiness: "شركات",
    rows: [
      { feature: "الاستشارة الذكية", values: ["1/أسبوع", "✓ نقاط", "✓ نقاط", "—", "✓ مفتوح"] },
      { feature: "توليد العقود", values: ["—", "✓", "✓", "—", "✓"] },
      { feature: "إدارة القضايا", values: ["—", "—", "✓", "—", "✓"] },
      { feature: "تقديم عروض بشرية", values: ["—", "—", "✓", "—", "✓"] },
      { feature: "طلب ترجمة معتمدة", values: ["✓", "✓", "✓", "—", "✓"] },
      { feature: "استقبال طلبات ترجمة", values: ["—", "—", "—", "✓", "✓"] },
      { feature: "التواصل مع محامٍ", values: ["عرض فقط", "✓ نقاط", "—", "—", "✓"] },
      { feature: "عدة مستخدمين", values: ["—", "—", "—", "—", "✓"] },
    ],
    howTitle: "كيف يتم التفعيل؟",
    howDesc:
      " اختر الباقة المناسبة وتواصل معنا عبر واتساب، ويُفعَّل حسابك خلال دقائق. يمكنك طلب فاتورة رسمية، والترقية أو تغيير الباقة في أي وقت.",
    supportEmail: "بريد الدعم:",
    contactWa: "تواصل معنا عبر واتساب",
    waGeneral: "مرحباً، أريد الاستفسار عن باقات منصة المستشار القانوني.",
    waPoints: (pts: number, price: string) =>
      `مرحباً، أريد شراء حزمة ${pts} نقطة بسعر ${price} دينار في منصة المستشار القانوني.`,
    waDefault: "مرحباً، أريد تفاصيل الاشتراك.",
  },
  en: {
    badge: "Activation within minutes via direct contact",
    titleA: "Plans and pricing for the ",
    titleB: "Smart Legal Advisor",
    subtitle:
      "Choose the plan that best fits your needs: start for free, or subscribe to a plan suited to your work — for individuals, businesses, lawyers, or translation offices.",
    currency: "Currency: Iraqi Dinar",
    instant: "Instant activation via WhatsApp",
    cancelAny: "Upgrade or cancel anytime",
    recommended: "Recommended",
    free: "Free",
    dinar: "IQD",
    includesPoints: (n: number) => `Includes ${n} points per month`,
    monthlyNote: "Monthly subscription — you can upgrade or cancel whenever you like.",
    ctaRegisterNote: "No credit card required.",
    ctaWhatsappNote: "Opens a WhatsApp chat with a ready message.",
    ctaContactNote: "You will be redirected to the contact page.",
    pointsTitleA: "The ",
    pointsTitleB: "points system",
    pointsSubtitle: "For Individual and Lawyer plan subscribers — buy extra points anytime.",
    consumptionTitle: "Points consumption",
    consumption: [
      { label: "Smart consultation", points: 1 },
      { label: "Smart translation", points: 2 },
      { label: "Human consultation", points: 5 },
    ],
    point: "points",
    buyNow: "Buy now",
    compareA: "Plan ",
    compareB: "comparison",
    colFeature: "Feature",
    colFree: "Free",
    colIndividual: "Individual",
    colLawyer: "Lawyers",
    colTranslation: "Translation",
    colBusiness: "Business",
    rows: [
      { feature: "Smart consultation", values: ["1/week", "✓ points", "✓ points", "—", "✓ open"] },
      { feature: "Contract generation", values: ["—", "✓", "✓", "—", "✓"] },
      { feature: "Case management", values: ["—", "—", "✓", "—", "✓"] },
      { feature: "Submitting human offers", values: ["—", "—", "✓", "—", "✓"] },
      { feature: "Certified translation request", values: ["✓", "✓", "✓", "—", "✓"] },
      { feature: "Receiving translation requests", values: ["—", "—", "—", "✓", "✓"] },
      { feature: "Contacting a lawyer", values: ["View only", "✓ points", "—", "—", "✓"] },
      { feature: "Multiple users", values: ["—", "—", "—", "—", "✓"] },
    ],
    howTitle: "How is activation done?",
    howDesc:
      " Choose the right plan and contact us via WhatsApp, and your account is activated within minutes. You can request an official invoice and upgrade or change your plan anytime.",
    supportEmail: "Support email:",
    contactWa: "Contact us on WhatsApp",
    waGeneral: "Hello, I would like to inquire about the Smart Legal Advisor plans.",
    waPoints: (pts: number, price: string) =>
      `Hello, I would like to buy a package of ${pts} points for ${price} IQD on the Smart Legal Advisor platform.`,
    waDefault: "Hello, I would like subscription details.",
  },
} as const;

// ===============================
// تعريف الباقات حسب اللغة
// ===============================
const PLANS: Record<Locale, Plan[]> = {
  ar: [
    {
      id: "free",
      name: "الباقة المجانية",
      tagline: "للتجربة والاستكشاف — يتطلب تسجيل حساب فقط.",
      priceIQD: 0,
      period: "مجاناً",
      badge: "ابدأ مجاناً",
      features: [
        { text: "استشارة ذكية واحدة أسبوعياً", included: true },
        { text: "عرض قائمة المحامين المتاحين", included: true },
        { text: "الوصول للمكتبة القانونية (قراءة فقط)", included: true },
        { text: "توليد العقود", included: false },
        { text: "إدارة القضايا", included: false },
        { text: "طلب ترجمة معتمدة من مكتب معتمد (تُدفع للمكتب)", included: true },
        { text: "التواصل مع محامٍ (استشارة بشرية)", included: false },
      ],
      ctaLabel: "سجّل حساباً مجانياً",
      ctaType: "register",
    },
    {
      id: "individual",
      name: "باقة الأفراد",
      tagline: "للأفراد الذين يحتاجون استشارات وعقوداً بشكل منتظم.",
      priceIQD: 15000,
      period: "شهرياً",
      badge: "مناسبة للبداية",
      points: 50,
      features: [
        { text: "50 نقطة شهرياً (قابلة للتجديد أو الشراء)", included: true },
        { text: "استشارة ذكية = 1 نقطة", included: true },
        { text: "ترجمة ذكية = 2 نقطة", included: true },
        { text: "استشارة بشرية = 5 نقاط", included: true },
        { text: "الترجمة المعتمدة: تُدفع مباشرة للمكتب حسب الوثيقة", included: true },
        { text: "توليد العقود الأساسية", included: true },
        { text: "عرض قائمة المحامين والتواصل معهم", included: true },
        { text: "إدارة القضايا", included: false },
      ],
      ctaLabel: "اشترك الآن (واتساب)",
      ctaType: "whatsapp",
      whatsappMessage:
        "مرحباً، أريد الاشتراك في باقة الأفراد داخل منصة المستشار القانوني. الرجاء تزويدي بالتفاصيل وطريقة التفعيل.",
    },
    {
      id: "lawyer",
      name: "باقة المحامين",
      tagline: "للمحامين الراغبين بتقديم خدماتهم وإدارة قضاياهم عبر المنصة.",
      priceIQD: 20000,
      period: "شهرياً",
      badge: "للمحترفين",
      features: [
        { text: "توليد العقود الاحترافية", included: true },
        { text: "إدارة القضايا والملفات", included: true },
        { text: "تقديم عروض للاستشارات البشرية", included: true },
        { text: "صفحة تعريفية احترافية داخل المنصة", included: true },
        { text: "لوحة متابعة الطلبات الواردة", included: true },
        { text: "الاستشارة الذكية / المحامي الذكي (بنقاط إضافية)", included: true },
        { text: "الترجمة الذكية أو البشرية (بنقاط إضافية)", included: true },
      ],
      ctaLabel: "سجّل كمحامٍ (واتساب)",
      ctaType: "whatsapp",
      whatsappMessage:
        "مرحباً، أريد التسجيل كمحامٍ في منصة المستشار القانوني. أرجو تزويدي بالتفاصيل وطريقة التفعيل.",
    },
    {
      id: "translation",
      name: "باقة مكاتب الترجمة",
      tagline: "لمكاتب الترجمة الراغبة باستقبال طلبات الترجمة القانونية.",
      priceIQD: 20000,
      period: "شهرياً",
      badge: "للمترجمين",
      features: [
        { text: "استقبال طلبات الترجمة القانونية من العملاء", included: true },
        { text: "صفحة تعريفية احترافية داخل المنصة", included: true },
        { text: "لوحة متابعة الطلبات المنجزة والواردة", included: true },
        { text: "نظام عمولات من كل خدمة منجزة", included: true },
        { text: "توليد العقود", included: false },
        { text: "إدارة القضايا", included: false },
      ],
      ctaLabel: "سجّل كمكتب ترجمة (واتساب)",
      ctaType: "whatsapp",
      whatsappMessage:
        "مرحباً، أريد تسجيل مكتب ترجمة في منصة المستشار القانوني. أرجو تزويدي بالتفاصيل وطريقة التفعيل.",
    },
    {
      id: "business",
      name: "باقة الشركات",
      tagline: "للشركات ومكاتب المحاماة التي تدير قضايا وعقوداً عديدة.",
      priceIQD: 75000,
      period: "شهرياً",
      badge: "الأكثر طلباً",
      recommended: true,
      features: [
        { text: "وصول مفتوح لجميع ميزات المنصة", included: true },
        { text: "استشارات ذكية وترجمة ذكية غير محدودة", included: true },
        { text: "توليد عقود احترافية غير محدود", included: true },
        { text: "إدارة القضايا والملفات القانونية", included: true },
        { text: "تواصل مفتوح مع المحامين ومكاتب الترجمة", included: true },
        { text: "عدة مستخدمين (فريق عمل) لحساب واحد", included: true },
        { text: "تقارير وإحصائيات نشاط", included: true },
        { text: "أولوية في الدعم والتحديثات", included: true },
      ],
      ctaLabel: "اطلب عرض سعر (واتساب)",
      ctaType: "whatsapp",
      whatsappMessage:
        "مرحباً، أنا من شركة/مكتب وأريد باقة الشركات في منصة المستشار القانوني. نحتاج عرض سعر وتفاصيل التفعيل وعدد المستخدمين.",
    },
  ],
  en: [
    {
      id: "free",
      name: "Free plan",
      tagline: "For trying and exploring — only account registration required.",
      priceIQD: 0,
      period: "Free",
      badge: "Start free",
      features: [
        { text: "One smart consultation per week", included: true },
        { text: "View the list of available lawyers", included: true },
        { text: "Access the legal library (read only)", included: true },
        { text: "Contract generation", included: false },
        { text: "Case management", included: false },
        { text: "Request certified translation from an accredited office (paid to the office)", included: true },
        { text: "Contacting a lawyer (human consultation)", included: false },
      ],
      ctaLabel: "Create a free account",
      ctaType: "register",
    },
    {
      id: "individual",
      name: "Individual plan",
      tagline: "For individuals who need consultations and contracts regularly.",
      priceIQD: 15000,
      period: "monthly",
      badge: "Great to start",
      points: 50,
      features: [
        { text: "50 points per month (renewable or purchasable)", included: true },
        { text: "Smart consultation = 1 point", included: true },
        { text: "Smart translation = 2 points", included: true },
        { text: "Human consultation = 5 points", included: true },
        { text: "Certified translation: paid directly to the office per document", included: true },
        { text: "Basic contract generation", included: true },
        { text: "View the lawyers list and contact them", included: true },
        { text: "Case management", included: false },
      ],
      ctaLabel: "Subscribe now (WhatsApp)",
      ctaType: "whatsapp",
      whatsappMessage:
        "Hello, I would like to subscribe to the Individual plan on the Smart Legal Advisor platform. Please send me the details and how to activate.",
    },
    {
      id: "lawyer",
      name: "Lawyers plan",
      tagline: "For lawyers who want to offer their services and manage their cases on the platform.",
      priceIQD: 20000,
      period: "monthly",
      badge: "For professionals",
      features: [
        { text: "Professional contract generation", included: true },
        { text: "Case and file management", included: true },
        { text: "Submitting offers for human consultations", included: true },
        { text: "A professional profile page on the platform", included: true },
        { text: "Incoming requests tracking dashboard", included: true },
        { text: "Smart consultation / AI lawyer (with extra points)", included: true },
        { text: "Smart or human translation (with extra points)", included: true },
      ],
      ctaLabel: "Register as a lawyer (WhatsApp)",
      ctaType: "whatsapp",
      whatsappMessage:
        "Hello, I would like to register as a lawyer on the Smart Legal Advisor platform. Please send me the details and how to activate.",
    },
    {
      id: "translation",
      name: "Translation offices plan",
      tagline: "For translation offices wishing to receive legal translation requests.",
      priceIQD: 20000,
      period: "monthly",
      badge: "For translators",
      features: [
        { text: "Receiving legal translation requests from clients", included: true },
        { text: "A professional profile page on the platform", included: true },
        { text: "Dashboard for completed and incoming requests", included: true },
        { text: "Commission system on every completed service", included: true },
        { text: "Contract generation", included: false },
        { text: "Case management", included: false },
      ],
      ctaLabel: "Register as a translation office (WhatsApp)",
      ctaType: "whatsapp",
      whatsappMessage:
        "Hello, I would like to register a translation office on the Smart Legal Advisor platform. Please send me the details and how to activate.",
    },
    {
      id: "business",
      name: "Business plan",
      tagline: "For companies and law firms managing many cases and contracts.",
      priceIQD: 75000,
      period: "monthly",
      badge: "Most popular",
      recommended: true,
      features: [
        { text: "Open access to all platform features", included: true },
        { text: "Unlimited smart consultations and smart translation", included: true },
        { text: "Unlimited professional contract generation", included: true },
        { text: "Legal case and file management", included: true },
        { text: "Open communication with lawyers and translation offices", included: true },
        { text: "Multiple users (a team) for a single account", included: true },
        { text: "Activity reports and statistics", included: true },
        { text: "Priority support and updates", included: true },
      ],
      ctaLabel: "Request a quote (WhatsApp)",
      ctaType: "whatsapp",
      whatsappMessage:
        "Hello, I am from a company/office and want the Business plan on the Smart Legal Advisor platform. We need a quote, activation details, and number of users.",
    },
  ],
};

const POINTS_PACKAGES: Record<Locale, PointsPackage[]> = {
  ar: [
    { points: 10, priceIQD: 3000, label: "صغيرة" },
    { points: 25, priceIQD: 6500, label: "متوسطة", saving: "وفّر 500 د.ع" },
    { points: 50, priceIQD: 12000, label: "كبيرة", saving: "وفّر 3,000 د.ع" },
    { points: 100, priceIQD: 20000, label: "كبيرة جداً", saving: "وفّر 10,000 د.ع" },
  ],
  en: [
    { points: 10, priceIQD: 3000, label: "Small" },
    { points: 25, priceIQD: 6500, label: "Medium", saving: "Save 500 IQD" },
    { points: 50, priceIQD: 12000, label: "Large", saving: "Save 3,000 IQD" },
    { points: 100, priceIQD: 20000, label: "Extra large", saving: "Save 10,000 IQD" },
  ],
};

// ===============================
// الصفحة الرئيسية
// ===============================
export default async function PricingPage({ searchParams }: Props) {
  const params = await searchParams;
  const locale = params?.lang ? resolveLocale(params.lang) : await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = UI[locale];
  const plans = PLANS[locale];
  const pointsPackages = POINTS_PACKAGES[locale];

  const hasWhatsapp = WHATSAPP_NUMBER && WHATSAPP_NUMBER.length >= 10;
  const align = dir === "rtl" ? "text-right" : "text-left";

  return (
    <div className="space-y-14" dir={dir}>

      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>{t.badge}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t.titleA}
          <span className="text-emerald-400">{t.titleB}</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base text-zinc-400 leading-7">
          {t.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-500">
          <span>{t.currency}</span>
          <span className="hidden sm:inline">•</span>
          <span>{t.instant}</span>
          <span className="hidden sm:inline">•</span>
          <span>{t.cancelAny}</span>
        </div>
      </section>

      {/* Plans Grid */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isRecommended = !!plan.recommended;
            const isFree = plan.id === "free";

            const ctaHref =
              plan.ctaType === "register"
                ? "/register"
                : plan.ctaType === "whatsapp" && hasWhatsapp
                ? waLink(plan.whatsappMessage || t.waDefault)
                : "/contact";

            return (
              <article
                key={plan.id}
                className={[
                  "relative flex flex-col rounded-2xl border bg-zinc-900/40 p-6 shadow-sm transition",
                  isRecommended
                    ? "border-emerald-400/60 shadow-emerald-400/10 shadow-lg"
                    : isFree
                    ? "border-zinc-600/40 hover:border-zinc-500/60"
                    : "border-white/10 hover:border-emerald-400/40 hover:shadow-md",
                ].join(" ")}
              >
                {/* Recommended ribbon */}
                {isRecommended && (
                  <div className="absolute -top-3 start-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black shadow">
                    {t.recommended}
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{plan.name}</h2>
                    <p className="text-xs text-zinc-400 mt-1">{plan.tagline}</p>
                  </div>
                  {plan.badge && (
                    <span className={[
                      "shrink-0 text-[11px] rounded-full border px-2 py-0.5",
                      isFree
                        ? "border-zinc-500/30 bg-zinc-500/10 text-zinc-300"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
                    ].join(" ")}>
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4 rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      {isFree ? (
                        <span className="text-3xl font-bold tracking-tight text-emerald-400">
                          {t.free}
                        </span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold tracking-tight">
                            {formatNum(plan.priceIQD, locale)}
                          </span>
                          <span className="text-xs text-zinc-400">{t.dinar}</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500">{plan.period}</span>
                  </div>
                  {plan.points && (
                    <p className="text-[11px] text-emerald-400/80 mt-2">
                      {t.includesPoints(plan.points)}
                    </p>
                  )}
                  {!isFree && (
                    <p className="text-[11px] text-zinc-500 mt-1 leading-5">
                      {t.monthlyNote}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-6 space-y-2 text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <span className="mt-1 text-emerald-400 text-xs">✓</span>
                      ) : (
                        <span className="mt-1 text-zinc-600 text-xs">✕</span>
                      )}
                      <span className={feature.included ? "text-zinc-200 leading-6" : "text-zinc-500 leading-6"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto pt-2 space-y-2">
                  <Link
                    href={ctaHref}
                    target={plan.ctaType === "whatsapp" ? "_blank" : undefined}
                    rel={plan.ctaType === "whatsapp" ? "noopener noreferrer" : undefined}
                    className={[
                      "w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition",
                      isRecommended
                        ? "bg-emerald-500 text-black hover:opacity-90"
                        : isFree
                        ? "border border-zinc-500/60 bg-zinc-500/10 text-zinc-100 hover:bg-zinc-500/20"
                        : "border border-emerald-500/60 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20",
                    ].join(" ")}
                  >
                    {plan.ctaLabel}
                  </Link>

                  <p className="text-[11px] text-zinc-500 leading-5 text-center">
                    {plan.ctaType === "register"
                      ? t.ctaRegisterNote
                      : plan.ctaType === "whatsapp"
                      ? t.ctaWhatsappNote
                      : t.ctaContactNote}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Points System */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">
            {t.pointsTitleA}<span className="text-emerald-400">{t.pointsTitleB}</span>
          </h2>
          <p className="text-sm text-zinc-400">{t.pointsSubtitle}</p>
        </div>

        {/* Points consumption table */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200">{t.consumptionTitle}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {t.consumption.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-center space-y-1"
              >
                <p className="text-xs text-zinc-400">{item.label}</p>
                <p className="text-2xl font-bold text-emerald-400">{item.points}</p>
                <p className="text-[11px] text-zinc-500">{t.point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Points packages */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pointsPackages.map((pkg) => (
            <div
              key={pkg.points}
              className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">{pkg.label}</span>
                {pkg.saving && (
                  <span className="text-[11px] rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                    {pkg.saving}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-emerald-400">{pkg.points}</span>
                <span className="text-xs text-zinc-400">{t.point}</span>
              </div>
              <div className="text-sm font-semibold">
                {formatNum(pkg.priceIQD, locale)}{" "}
                <span className="text-xs font-normal text-zinc-400">{t.dinar}</span>
              </div>
              <Link
                href={waLink(t.waPoints(pkg.points, formatNum(pkg.priceIQD, locale)))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-100 hover:bg-emerald-500/20 transition"
              >
                {t.buyNow}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-center">
          {t.compareA}<span className="text-emerald-400">{t.compareB}</span>
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className={`w-full text-sm ${align}`}>
            <thead>
              <tr className="border-b border-white/10 bg-zinc-950/60">
                <th className="p-3 text-zinc-300 font-semibold">{t.colFeature}</th>
                <th className="p-3 text-zinc-300 font-semibold text-center">{t.colFree}</th>
                <th className="p-3 text-zinc-300 font-semibold text-center">{t.colIndividual}</th>
                <th className="p-3 text-zinc-300 font-semibold text-center">{t.colLawyer}</th>
                <th className="p-3 text-zinc-300 font-semibold text-center">{t.colTranslation}</th>
                <th className="p-3 text-emerald-400 font-semibold text-center">{t.colBusiness}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {t.rows.map((row, i) => (
                <tr key={i} className="hover:bg-zinc-800/20 transition">
                  <td className="p-3 text-zinc-300">{row.feature}</td>
                  {row.values.map((v, j) => (
                    <td
                      key={j}
                      className={[
                        "p-3 text-center text-xs",
                        v === "—" ? "text-zinc-600" : j === 4 ? "text-emerald-400 font-medium" : "text-zinc-200",
                      ].join(" ")}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 text-sm text-zinc-400 space-y-3 leading-7">
        <p>
          <span className="text-zinc-200 font-semibold">{t.howTitle}</span>
          {t.howDesc}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-500">
            {t.supportEmail} <span className="text-zinc-300">{SUPPORT_EMAIL}</span>
          </div>
          <Link
            href={waLink(t.waGeneral)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline text-xs"
          >
            {t.contactWa}
          </Link>
        </div>
      </section>
    </div>
  );
}

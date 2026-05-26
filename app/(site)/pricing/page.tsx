 // app/(site)/pricing/page.tsx
import Link from "next/link";

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

const WHATSAPP_NUMBER = "9647719183785";
const SUPPORT_EMAIL = "support@legal-advisor.iq";

const formatIQD = (n: number) => new Intl.NumberFormat("ar-IQ").format(n);

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
  period: "شهرياً" | "مجاناً";
  badge?: string;
  recommended?: boolean;
  points?: number;
  features: { text: string; included: boolean }[];
  ctaLabel: string;
  ctaType: "whatsapp" | "contact" | "register";
  whatsappMessage?: string;
};

// ===============================
// تعريف الباقات
// ===============================
const plans: Plan[] = [
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
      { text: "التواصل مع محامٍ أو مكتب ترجمة", included: false },
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
      { text: "ترجمة بشرية = 5 نقاط", included: true },
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
];

// ===============================
// حزم النقاط الإضافية
// ===============================
type PointsPackage = {
  points: number;
  priceIQD: number;
  label: string;
  saving?: string;
};

const pointsPackages: PointsPackage[] = [
  { points: 10, priceIQD: 3000, label: "صغيرة" },
  { points: 25, priceIQD: 6500, label: "متوسطة", saving: "وفّر 500 د.ع" },
  { points: 50, priceIQD: 12000, label: "كبيرة", saving: "وفّر 3,000 د.ع" },
  { points: 100, priceIQD: 20000, label: "كبيرة جداً", saving: "وفّر 10,000 د.ع" },
];

// ===============================
// الصفحة الرئيسية
// ===============================
export default function PricingPage() {
  const hasWhatsapp = WHATSAPP_NUMBER && WHATSAPP_NUMBER.length >= 10;

  return (
    <div className="space-y-14">

      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>خطط تجريبية — قابلة للتعديل قبل الإطلاق الرسمي</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          خطط وأسعار منصة{" "}
          <span className="text-emerald-400">المستشار القانوني</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base text-zinc-400 leading-7">
          اختر الخطة الأنسب لاحتياجك: ابدأ مجاناً، أو اشترك في باقة تناسب
          طبيعة عملك — للأفراد، الشركات، المحامين، أو مكاتب الترجمة.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-500">
          <span>العملة: دينار عراقي</span>
          <span className="hidden sm:inline">•</span>
          <span>لا يوجد دفع إلكتروني حالياً (تفعيل يدوي)</span>
          <span className="hidden sm:inline">•</span>
          <span>سيتم إضافة فواتير ودفع لاحقاً</span>
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
                ? waLink(plan.whatsappMessage || "مرحباً، أريد تفاصيل الاشتراك.")
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
                  <div className="absolute -top-3 left-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black shadow">
                    موصى بها
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
                          مجاناً
                        </span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold tracking-tight">
                            {formatIQD(plan.priceIQD)}
                          </span>
                          <span className="text-xs text-zinc-400">دينار</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500">{plan.period}</span>
                  </div>
                  {plan.points && (
                    <p className="text-[11px] text-emerald-400/80 mt-2">
                      يشمل {plan.points} نقطة شهرياً
                    </p>
                  )}
                  {!isFree && (
                    <p className="text-[11px] text-zinc-500 mt-1 leading-5">
                      * السعر تجريبي وقد يتغير بعد الإطلاق الرسمي.
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
                      ? "لا يلزم بطاقة ائتمان."
                      : plan.ctaType === "whatsapp"
                      ? "يفتح محادثة واتساب برسالة جاهزة."
                      : "سيتم تحويلك لصفحة التواصل."}
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
            نظام <span className="text-emerald-400">النقاط</span>
          </h2>
          <p className="text-sm text-zinc-400">
            لمشتركي باقة الأفراد والمحامين — اشترِ نقاطاً إضافية في أي وقت.
          </p>
        </div>

        {/* Points consumption table */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200">استهلاك النقاط</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "استشارة ذكية", points: 1 },
              { label: "ترجمة ذكية", points: 2 },
              { label: "استشارة بشرية", points: 5 },
              { label: "ترجمة بشرية", points: 5 },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-center space-y-1"
              >
                <p className="text-xs text-zinc-400">{item.label}</p>
                <p className="text-2xl font-bold text-emerald-400">{item.points}</p>
                <p className="text-[11px] text-zinc-500">نقطة</p>
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
                <span className="text-xs text-zinc-400">نقطة</span>
              </div>
              <div className="text-sm font-semibold">
                {formatIQD(pkg.priceIQD)}{" "}
                <span className="text-xs font-normal text-zinc-400">دينار</span>
              </div>
              <Link
                href={waLink(`مرحباً، أريد شراء حزمة ${pkg.points} نقطة بسعر ${formatIQD(pkg.priceIQD)} دينار في منصة المستشار القانوني.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-100 hover:bg-emerald-500/20 transition"
              >
                اشترِ الآن
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-center">
          مقارنة <span className="text-emerald-400">الباقات</span>
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-950/60">
                <th className="p-3 text-zinc-300 font-semibold">الميزة</th>
                <th className="p-3 text-zinc-300 font-semibold text-center">مجاني</th>
                <th className="p-3 text-zinc-300 font-semibold text-center">أفراد</th>
                <th className="p-3 text-zinc-300 font-semibold text-center">محامون</th>
                <th className="p-3 text-zinc-300 font-semibold text-center">ترجمة</th>
                <th className="p-3 text-emerald-400 font-semibold text-center">شركات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { feature: "الاستشارة الذكية", values: ["1/أسبوع", "✓ نقاط", "✓ نقاط", "—", "✓ مفتوح"] },
                { feature: "توليد العقود", values: ["—", "✓", "✓", "—", "✓"] },
                { feature: "إدارة القضايا", values: ["—", "—", "✓", "—", "✓"] },
                { feature: "تقديم عروض بشرية", values: ["—", "—", "✓", "—", "✓"] },
                { feature: "استقبال طلبات ترجمة", values: ["—", "—", "—", "✓", "✓"] },
                { feature: "التواصل مع محامٍ", values: ["عرض فقط", "✓ نقاط", "—", "—", "✓"] },
                { feature: "عدة مستخدمين", values: ["—", "—", "—", "—", "✓"] },
              ].map((row, i) => (
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
          <span className="text-zinc-200 font-semibold">ملاحظة مهمة:</span> هذه
          صفحة تسعير للنسخة التجريبية (Beta). التفعيل حالياً يتم يدوياً عبر
          التواصل، وبعد الإطلاق الرسمي سنضيف الدفع الإلكتروني والفواتير وربط كل
          باقة بحدود استخدام دقيقة.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-500">
            بريد الدعم: <span className="text-zinc-300">{SUPPORT_EMAIL}</span>
          </div>
          <Link
            href={waLink("مرحباً، أريد الاستفسار عن باقات منصة المستشار القانوني.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline text-xs"
          >
            تواصل معنا عبر واتساب
          </Link>
        </div>
      </section>
    </div>
  );
}

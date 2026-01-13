 // app/(site)/pricing/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

type Plan = {
  id: "individual" | "business" | "professionals";
  name: string;
  tagline: string;
  priceIQD: number;
  period: "شهرياً";
  badge?: string;
  recommended?: boolean;
  features: string[];
  ctaLabel: string;
  ctaType: "whatsapp" | "contact";
  whatsappMessage?: string;
};

const WHATSAPP_NUMBER = "9647719183785"; // ضع رقمك بصيغة دولية بدون + (مثال: 9647...)
const SUPPORT_EMAIL = "support@legal-advisor.iq"; // اختياري (حتى لو الدومين غير جاهز اتركه فارغاً)

const formatIQD = (n: number) => new Intl.NumberFormat("ar-IQ").format(n);

function waLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

const plans: Plan[] = [
  {
    id: "individual",
    name: "باقة الأفراد",
    tagline: "للأفراد الذين يحتاجون استشارات وعقود بسيطة بشكل متكرر.",
    priceIQD: 15000,
    period: "شهرياً",
    badge: "مناسبة للبداية",
    features: [
      "استشارات قانونية ذكية بعدد مناسب شهرياً",
      "توليد عقود أساسية (إيجار، عمل، بيع… إلخ)",
      "تحليل مستندات PDF ضمن حدود الاستخدام",
      "وصول للمكتبة القانونية (بحث وقراءة)",
      "حفظ تاريخ الطلبات داخل الحساب",
    ],
    ctaLabel: "تواصل للاشتراك (واتساب)",
    ctaType: "whatsapp",
    whatsappMessage:
      "مرحباً، أريد الاشتراك في باقة الأفراد داخل منصة المستشار القانوني. الرجاء تزويدي بالتفاصيل وطريقة التفعيل.",
  },
  {
    id: "business",
    name: "باقة الشركات والمكاتب",
    tagline: "للشركات ومكاتب المحاماة التي تدير قضايا وعقود عديدة.",
    priceIQD: 75000,
    period: "شهرياً",
    badge: "الأكثر طلباً",
    recommended: true,
    features: [
      "توليد عقود احترافية بعدد كبير شهرياً",
      "إدارة القضايا والملفات القانونية داخل المنصة",
      "إتاحة عدة مستخدمين (فريق عمل) لحساب واحد",
      "تقارير وإحصائيات نشاط أساسية",
      "أولوية في الدعم والتحديثات",
      "خيارات تخصيص أعلى حسب طبيعة العمل",
    ],
    ctaLabel: "اطلب عرض سعر للشركات (واتساب)",
    ctaType: "whatsapp",
    whatsappMessage:
      "مرحباً، أنا من شركة/مكتب وأريد باقة الشركات في منصة المستشار القانوني. نحتاج عرض سعر وتفاصيل التفعيل وعدد المستخدمين.",
  },
  {
    id: "professionals",
    name: "باقة المحامين ومكاتب الترجمة",
    tagline: "لمن يرغب بتقديم خدماته عبر المنصة وزيادة دخله.",
    priceIQD: 20000,
    period: "شهرياً",
    badge: "للمحترفين",
    features: [
      "الظهور ضمن قائمة المحامين/مكاتب الترجمة",
      "استقبال طلبات الاستشارة أو الترجمة من العملاء",
      "نظام عمولات من كل خدمة يتم تنفيذها",
      "صفحة تعريفية احترافية داخل المنصة",
      "لوحة متابعة للطلبات الواردة والمنجزة",
      "إمكانية توثيق الحساب (لاحقاً) لزيادة الثقة",
    ],
    ctaLabel: "سجّل كمحامٍ/مكتب ترجمة (تواصل)",
    ctaType: "contact",
  },
];

export default function PricingPage() {
  const WHATSAPP_NUMBER: string = "9647719183785";

  const hasWhatsapp =
    WHATSAPP_NUMBER &&
    WHATSAPP_NUMBER !== "9647719183785" &&
    WHATSAPP_NUMBER.length >= 10;

  return (
    <div className="space-y-10">
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
          اختر الخطة الأنسب لاحتياجك: للأفراد، للشركات والمكاتب، أو للمحامين
          ومكاتب الترجمة. يمكنك البدء الآن عبر التواصل المباشر لتفعيل اشتراكك
          يدوياً في النسخة التجريبية.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-500">
          <span>العملة: دينار عراقي</span>
          <span className="hidden sm:inline">•</span>
          <span>لا يوجد دفع إلكتروني حالياً (تفعيل يدوي)</span>
          <span className="hidden sm:inline">•</span>
          <span>سيتم إضافة فواتير ودفع لاحقاً</span>
        </div>
      </section>

      {/* Plans */}
      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const price = formatIQD(plan.priceIQD);
          const isRecommended = !!plan.recommended;

          const ctaHref =
            plan.ctaType === "whatsapp" && hasWhatsapp
              ? waLink(plan.whatsappMessage || "مرحباً، أريد تفاصيل الاشتراك.")
              : "/contact";

          return (
            <article
              key={plan.id}
              className={[
                "relative flex flex-col rounded-2xl border bg-zinc-900/40 p-6 shadow-sm transition",
                isRecommended
                  ? "border-emerald-400/60 shadow-md"
                  : "border-white/10 hover:border-emerald-400/40 hover:shadow-md",
              ].join(" ")}
            >
              {/* Top badges */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                  <p className="text-xs text-zinc-400 mt-1">{plan.tagline}</p>
                </div>

                {plan.badge ? (
                  <span className="shrink-0 text-[11px] rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-200">
                    {plan.badge}
                  </span>
                ) : null}
              </div>

              {/* Price */}
              <div className="mb-4 rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                <div className="flex items-end justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">
                      {price}
                    </span>
                    <span className="text-xs text-zinc-400">دينار</span>
                  </div>
                  <span className="text-xs text-zinc-500">{plan.period}</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2 leading-5">
                  * السعر تجريبي وقد يتغير بعد إضافة الدفع الإلكتروني والباقات
                  السنوية.
                </p>
              </div>

              {/* Features */}
              <ul className="mb-6 space-y-2 text-sm text-zinc-200">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="leading-6">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto pt-2 space-y-2">
                <Link
                  href={ctaHref}
                  target={plan.ctaType === "whatsapp" ? "_blank" : undefined}
                  className={[
                    "w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition",
                    isRecommended
                      ? "bg-emerald-500 text-black hover:opacity-90"
                      : "border border-emerald-500/60 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20",
                  ].join(" ")}
                >
                  {plan.ctaType === "whatsapp" && !hasWhatsapp
                    ? "9647719183785"
                    : plan.ctaLabel}
                </Link>

                <p className="text-[11px] text-zinc-500 leading-5 text-center">
                  {plan.ctaType === "whatsapp"
                    ? "يفتح محادثة واتساب برسالة جاهزة."
                    : "سيتم تحويلك لصفحة التواصل."}
                </p>
              </div>

              {/* Recommended ribbon */}
              {isRecommended ? (
                <div className="absolute -top-3 left-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black shadow">
                  موصى بها
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      {/* Footer notes */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 text-sm text-zinc-400 space-y-3 leading-7">
        <p>
          <span className="text-zinc-200 font-semibold">ملاحظة مهمة:</span> هذه
          صفحة تسعير للنسخة التجريبية (Beta). التفعيل حالياً يتم يدوياً عبر
          التواصل، وبعد الإطلاق الرسمي سنضيف الدفع الإلكتروني والفواتير وربط كل
          باقة بحدود استخدام دقيقة.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-500">
            {SUPPORT_EMAIL ? (
              <span>
                بريد الدعم: <span className="text-zinc-300">{SUPPORT_EMAIL}</span>
              </span>
            ) : (
              <span>يمكن إضافة بريد دعم رسمي لاحقاً.</span>
            )}
          </div>

          <Link
            href="/contact"
            className="text-emerald-400 hover:underline text-xs"
          >
            انتقل إلى صفحة اتصل بنا
          </Link>
        </div>
      </section>
    </div>
  );
}

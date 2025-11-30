// app/(site)/pricing/page.tsx
import Link from "next/link";

const plans = [
  {
    id: "individual",
    name: "باقة الأفراد",
    tagline: "للأفراد الذين يحتاجون استشارات وعقود بسيطة بشكل متكرر.",
    price: "15,000",
    period: "شهرياً",
    highlight: "الأفضل لبدء الاستخدام",
    features: [
      "استشارات قانونية ذكية بعدد معقول شهرياً",
      "توليد عقود ذكية أساسية (إيجار، عمل، بيع... إلخ)",
      "استخدام المحامي الذكي لتحليل مستندات PDF محدودة",
      "وصول إلى المكتبة القانونية الذكية (قراءة وبحث)",
    ],
    cta: "ابدأ الآن كفرد",
  },
  {
    id: "business",
    name: "باقة الشركات والمكاتب",
    tagline: "للشركات ومكاتب المحاماة التي تدير قضايا وعقود عديدة.",
    price: "75,000",
    period: "شهرياً",
    highlight: "أنسب للأعمال",
    features: [
      "استخدام غير محدود تقريباً لتوليد العقود الذكية",
      "إدارة القضايا والملفات القانونية داخل المنصة",
      "عدة مستخدمين لحساب واحد (إدارة الفريق)",
      "تقارير واحصائيات أساسية عن النشاط",
      "أولوية في دعم المنصة والتحديثات",
    ],
    cta: "تواصل لبدء اشتراك الشركات",
  },
  {
    id: "professionals",
    name: "باقة المحامين ومكاتب الترجمة",
    tagline: "للمحامين والمكاتب التي ترغب في تقديم خدمات عبر المنصة.",
    price: "20,000",
    period: "شهرياً",
    highlight: "زيادة دخلك عبر المنصة",
    features: [
      "الظهور ضمن قائمة المحامين أو مكاتب الترجمة",
      "استقبال طلبات الاستشارة أو الترجمة من المستخدمين",
      "نظام عمولات من كل خدمة يتم تنفيذها",
      "صفحة تعريفية احترافية داخل المنصة",
      "لوحة متابعة للطلبات الواردة والمنجزة",
    ],
    cta: "سجّل كمحامٍ أو مكتب ترجمة",
  },
];

export const dynamic = "force-dynamic";

export default function PricingPage() {
  return (
    <div className="space-y-10">
      {/* رأس الصفحة */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          خطط وأسعار منصة <span className="text-emerald-400">المستشار القانوني</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-zinc-400">
          اختر الخطة الأنسب لاحتياجك: سواء كنت فرداً تبحث عن استشارة أو عقد،
          أو شركة تدير قضايا وعقود، أو محامياً/مكتب ترجمة ترغب بزيادة دخلك
          عبر المنصة.
        </p>
        <p className="text-xs text-zinc-500">
          جميع الأسعار تقريبية ويمكن تعديلها لاحقاً وفقاً لسياسة التسعير النهائية.
        </p>
      </section>

      {/* الباقات */}
      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/40 p-5 shadow-sm hover:border-emerald-400/60 hover:shadow-md transition"
          >
            {/* العنوان */}
            <div className="mb-4 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <span className="text-[11px] rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                  {plan.highlight}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{plan.tagline}</p>
            </div>

            {/* السعر */}
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-sm text-zinc-400">دينار عراقي</span>
              </div>
              <div className="text-xs text-zinc-500">{plan.period}</div>
            </div>

            {/* المزايا */}
            <ul className="mb-5 space-y-2 text-sm text-zinc-300">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* زر الإجراء */}
            <div className="mt-auto pt-3">
              <button className="w-full rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/20 transition">
                {plan.cta}
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* ملاحظات تذييل الصفحة */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 text-xs text-zinc-400 space-y-2">
        <p>
          يمكن تفعيل الدفع الإلكتروني (بطاقات، محافظ إلكترونية، أو تحويل مصرفي)
          وربط كل خطة بنظام فواتير حقيقي عند الانتقال للنسخة النهائية للإطلاق.
        </p>
        <p>
          في النسخة التجريبية يمكن الاكتفاء بعرض هذه الأسعار كمرجع، مع إتاحة زر
          تواصل عبر البريد أو الواتساب لتنسيق الاشتراكات يدوياً.
        </p>
        <p>
          لمزيد من المعلومات أو لتخصيص خطة خاصة بكم، يمكنكم التواصل عبر صفحة{" "}
          <Link href="/contact" className="text-emerald-400 hover:underline">
            اتصل بنا
          </Link>{" "}
          (يمكن إنشاؤها لاحقاً بسهولة).
        </p>
      </section>
    </div>
  );
}


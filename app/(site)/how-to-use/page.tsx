// app/(site)/how-to-use/page.tsx
import Link from "next/link";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

type Props = {
  searchParams?: Promise<{ lang?: string }>;
};

export const metadata = {
  title: "كيف تستخدم المنصة | How to Use",
  description:
    "دليل استخدام المنصة خطوة بخطوة للمستخدمين والمحامين ومكاتب الترجمة والشركات. Step-by-step guide for users, lawyers, translation offices, and companies.",
  alternates: {
    canonical: "/how-to-use",
    languages: { ar: "/how-to-use?lang=ar", en: "/how-to-use?lang=en" },
  },
  openGraph: {
    title: "كيف تستخدم المنصة | How to Use",
    description:
      "دليل استخدام المنصة القانونية الذكية خطوة بخطوة لكل دور.",
    url: "https://smartlegaladvisor.com/how-to-use",
  },
};

export default async function HowToUsePage({ searchParams }: Props) {
  const params = await searchParams;
  const locale = params?.lang === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const t = {
    ar: {
      siteName: "Legal Advisor",
      backHome: "العودة للرئيسية",
      title: "كيف تستخدم المنصة",
      subtitle: "دليل مبسّط خطوة بخطوة — اختر دورك واتبع الخطوات.",
      ctaTitle: "جاهز للبدء؟",
      ctaDesc: "أنشئ حسابك واطرح أول استشارة خلال دقائق.",
      ctaBtn: "إنشاء حساب",
      roles: [
        {
          icon: "👤",
          role: "المستخدم (الباحث عن خدمة)",
          tasks: [
            {
              q: "كيف أحصل على استشارة قانونية؟",
              steps: [
                "سجّل دخولك أو أنشئ حساباً جديداً.",
                "اختر نوع الاستشارة: ذكية فورية، أو محامٍ معتمد، أو مكتب محاماة.",
                "اكتب سؤالك، وإن اخترت محامياً انتظر العروض ثم اقبل الأنسب.",
              ],
            },
            {
              q: "كيف أطلب ترجمة رسمية؟",
              steps: [
                "ادخل قسم الترجمة وارفع المستند المراد ترجمته.",
                "اختر مكتب الترجمة المعتمد واللغة المستهدفة وأرسل الطلب.",
                "انتظر عرض السعر من المكتب، ووافق عليه للبدء.",
                "استلم الملف المترجم وتابع الحالة من «طلباتي».",
              ],
            },
            {
              q: "كيف أولّد عقداً؟",
              steps: [
                "ادخل قسم العقود واختر نوع العقد (اعتيادي أو دولي).",
                "املأ بيانات الأطراف والبنود في النموذج.",
                "ولّد العقد وحمّله جاهزاً — نماذج موثوقة بلا ذكاء اصطناعي.",
              ],
            },
          ],
        },
        {
          icon: "⚖️",
          role: "المحامي المعتمد",
          tasks: [
            {
              q: "كيف أستقبل القضايا وأقدّم العروض؟",
              steps: [
                "سجّل كمحامٍ عبر المنصة وانتظر اعتماد الإدارة.",
                "استعرض طلبات الاستشارة الواردة من لوحتك.",
                "قدّم عرضك (السعر والمدة)، وعند القبول تواصل مع الموكّل.",
              ],
            },
          ],
        },
        {
          icon: "🏛️",
          role: "مكتب الترجمة",
          tasks: [
            {
              q: "كيف أستقبل الطلبات وأسلّم الترجمة؟",
              steps: [
                "من لوحة المكتب، استعرض طلبات الترجمة الواردة من العملاء.",
                "قدّم عرض السعر على الطلب.",
                "بعد موافقة العميل على السعر، ابدأ العمل على الترجمة.",
                "عند الاكتمال، ارفع الملف المترجم لتسليمه للعميل.",
              ],
            },
          ],
        },
        {
          icon: "🏢",
          role: "الشركات ومكاتب المحاماة",
          tasks: [
            {
              q: "كيف أدير القضايا وأحلّل المخاطر؟",
              steps: [
                "أنشئ قضية جديدة وأضف تفاصيلها وأطرافها ومستنداتها.",
                "استخدم المحامي الذكي لتحليل المخاطر القانونية وتوليد المذكرات.",
                "كلّف أعضاء فريقك بالقضايا وتابع المواعيد والجلسات.",
              ],
            },
          ],
        },
      ],
    },
    en: {
      siteName: "Legal Advisor",
      backHome: "Back to Home",
      title: "How to Use the Platform",
      subtitle: "A simple step-by-step guide — pick your role and follow the steps.",
      ctaTitle: "Ready to start?",
      ctaDesc: "Create your account and ask your first consultation in minutes.",
      ctaBtn: "Create Account",
      roles: [
        {
          icon: "👤",
          role: "User (Seeking a service)",
          tasks: [
            {
              q: "How do I get a legal consultation?",
              steps: [
                "Sign in or create a new account.",
                "Choose the consultation type: instant AI, certified lawyer, or law firm.",
                "Write your question; if you chose a lawyer, wait for offers and accept the best one.",
              ],
            },
            {
              q: "How do I request an official translation?",
              steps: [
                "Go to the translation section and upload the document.",
                "Choose the certified translation office and target language, then send the request.",
                "Wait for the office's price offer and approve it to start.",
                "Receive the translated file and track status under \u201cMy Requests\u201d.",
              ],
            },
            {
              q: "How do I generate a contract?",
              steps: [
                "Go to the contracts section and choose the contract type (standard or international).",
                "Fill in the parties' details and clauses in the form.",
                "Generate and download the contract — trusted templates, no AI.",
              ],
            },
          ],
        },
        {
          icon: "⚖️",
          role: "Certified Lawyer",
          tasks: [
            {
              q: "How do I receive cases and submit offers?",
              steps: [
                "Register as a lawyer via the platform and await admin approval.",
                "Review incoming consultation requests from your dashboard.",
                "Submit your offer (price and duration); upon acceptance, contact the client.",
              ],
            },
          ],
        },
        {
          icon: "🏛️",
          role: "Translation Office",
          tasks: [
            {
              q: "How do I receive requests and deliver translations?",
              steps: [
                "From the office dashboard, review incoming translation requests from clients.",
                "Submit your price offer on the request.",
                "After the client approves the price, start working on the translation.",
                "When complete, upload the translated file to deliver it to the client.",
              ],
            },
          ],
        },
        {
          icon: "🏢",
          role: "Companies & Law Firms",
          tasks: [
            {
              q: "How do I manage cases and analyze risks?",
              steps: [
                "Create a new case and add its details, parties, and documents.",
                "Use the Smart Lawyer to analyze legal risks and generate memos.",
                "Assign cases to your team members and track dates and hearings.",
              ],
            },
          ],
        },
      ],
    },
  };

  const texts = t[locale];

  const accents = [
    { bar: "from-blue-600 to-blue-400", num: "bg-blue-600", chip: "bg-blue-100 text-blue-700" },
    { bar: "from-emerald-600 to-emerald-400", num: "bg-emerald-600", chip: "bg-emerald-100 text-emerald-700" },
    { bar: "from-purple-600 to-purple-400", num: "bg-purple-600", chip: "bg-purple-100 text-purple-700" },
    { bar: "from-amber-600 to-amber-400", num: "bg-amber-600", chip: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={dir}>
      {/* شريط التنقل */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            {texts.siteName}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      {/* الهيرو */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {texts.title}
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
            {texts.subtitle}
          </p>
        </div>
      </div>

      {/* الأدوار */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {texts.roles.map((roleBlock, i) => {
          const a = accents[i % accents.length];
          return (
            <div
              key={roleBlock.role}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${a.bar}`} />
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-3xl">{roleBlock.icon}</span>
                  {roleBlock.role}
                </h2>

                <div className="space-y-8">
                  {roleBlock.tasks.map((task) => (
                    <div key={task.q}>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        {task.q}
                      </h3>
                      <ol className="space-y-3">
                        {task.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span
                              className={`flex-shrink-0 w-7 h-7 rounded-full ${a.num} text-white text-sm font-bold flex items-center justify-center`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-gray-600 leading-relaxed pt-0.5">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* نداء التسجيل */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">{texts.ctaTitle}</h2>
          <p className="text-blue-100 mb-6">{texts.ctaDesc}</p>
          <Link
            href={`/register?lang=${locale}`}
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            {texts.ctaBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}

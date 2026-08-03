// app/(site)/disclaimer/page.tsx
export const metadata = {
  title: "إخلاء المسؤولية | Disclaimer",
  description:
    "إخلاء المسؤولية القانونية لمنصة المستشار القانوني الذكي — طبيعة المحتوى وحدود المسؤولية.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">
        {/* القسم العربي */}
        <section className="text-right space-y-6" dir="rtl">
          <h1 className="text-2xl font-bold">إخلاء المسؤولية</h1>

          <p className="leading-8 text-zinc-300">
            توفّر منصة <strong>المستشار القانوني الذكي</strong> أدوات ومحتوى قانونيًا
            رقميًا لأغراض إرشادية ومعلوماتية فقط. باستخدامك للمنصة فإنك تُقرّ بفهمك
            للبنود التالية وقبولك بها.
          </p>

          <div className="border border-amber-400/30 bg-amber-500/5 rounded-xl p-5 space-y-3">
            <h2 className="text-lg font-semibold text-amber-300">
              طبيعة المحتوى
            </h2>
            <p className="leading-8 text-zinc-200">
              جميع الاستشارات المُقدَّمة عبر الذكاء الاصطناعي داخل المنصة تُعدّ مواد
              معلوماتية فقط، ولا يمكن اعتبارها بديلاً عن استشارة قانونية من محامٍ
              مرخّص. كما أن القوالب والعقود الجاهزة والترجمات المتاحة تُقدَّم لأغراض
              إرشادية ولا تمثّل استشارة قانونية ملزمة.
            </p>
          </div>

          <div className="border border-zinc-700/60 bg-zinc-900/40 rounded-xl p-5 space-y-3">
            <h2 className="text-lg font-semibold text-zinc-100">حدود المسؤولية</h2>
            <p className="leading-8 text-zinc-300">
              لا تتحمّل منصة المستشار القانوني الذكي أو إدارتها أو مطوّروها أي مسؤولية
              عن أي ضرر مباشر أو غير مباشر ناتج عن استخدام المعلومات الظاهرة داخل
              المنصة أو الاعتماد عليها في أي إجراء قانوني أو تجاري أو شخصي.
            </p>
            <p className="leading-8 text-zinc-300">
              مكاتب الترجمة والمحاماة المسجّلة في المنصة جهات مستقلة، والتعامل معها
              يتم على مسؤولية المستخدم المباشرة، والمنصة تعمل كوسيط تعريفي فقط.
            </p>
          </div>

          <p className="leading-8 text-zinc-400 text-sm">
            للحصول على مشورة ملزمة تخصّ حالتك، يُرجى مراجعة محامٍ مرخّص. راجع أيضًا
            {" "}
            <a href="/terms" className="text-amber-300 hover:underline">شروط الاستخدام</a>
            {" "}و
            {" "}
            <a href="/privacy" className="text-amber-300 hover:underline">سياسة الخصوصية</a>.
          </p>
        </section>

        {/* فاصل */}
        <div className="h-px w-full bg-white/10" />

        {/* English Section */}
        <section className="text-left space-y-6" dir="ltr">
          <h1 className="text-2xl font-bold">Disclaimer</h1>

          <p className="leading-7 text-zinc-300">
            The <strong>Smart Legal Advisor</strong> platform provides digital legal
            tools and content for general guidance and informational purposes only. By
            using the platform, you acknowledge and accept the terms below.
          </p>

          <div className="border border-amber-400/30 bg-amber-500/5 rounded-xl p-5 space-y-3">
            <h2 className="text-lg font-semibold text-amber-300">Nature of content</h2>
            <p className="leading-7 text-zinc-200">
              All AI-generated legal consultations on the platform are for informational
              purposes only and must not be considered a substitute for legal advice from
              a licensed attorney. The contract templates, legal documents, and
              translations provided are offered as general guidance and do not constitute
              binding legal advice.
            </p>
          </div>

          <div className="border border-zinc-700/60 bg-zinc-900/40 rounded-xl p-5 space-y-3">
            <h2 className="text-lg font-semibold text-zinc-100">Limitation of liability</h2>
            <p className="leading-7 text-zinc-300">
              The Smart Legal Advisor platform, its administrators, and its developers
              shall not be held liable for any direct or indirect damages resulting from
              the use of, or reliance upon, information provided within the platform for
              any legal, commercial, or personal action.
            </p>
            <p className="leading-7 text-zinc-300">
              Translation and law offices registered on the platform are independent
              entities; dealing with them is at the user’s own responsibility, and the
              platform acts only as an introductory intermediary.
            </p>
          </div>

          <p className="leading-7 text-zinc-400 text-sm">
            For binding advice specific to your situation, please consult a licensed
            attorney. See also our{" "}
            <a href="/terms" className="text-amber-300 hover:underline">Terms of Use</a>{" "}
            and{" "}
            <a href="/privacy" className="text-amber-300 hover:underline">Privacy Policy</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

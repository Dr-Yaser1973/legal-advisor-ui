
"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

        {/* القسم العربي */}
        <section className="text-right space-y-6">
          <h1 className="text-2xl font-bold">شروط الاستخدام</h1>

          <p className="leading-8 text-zinc-300">
            باستخدامك لمنصة <strong>المستشار القانوني</strong>، فإنك توافق على الالتزام
            الكامل بشروط الاستخدام الموضحة أدناه. تهدف هذه الشروط إلى تنظيم العلاقة
            بين المنصة والمستخدم وتحديد الحقوق والالتزامات المتبادلة.
          </p>

          <p className="leading-8 text-zinc-300">
            تلتزم بعدم استخدام المنصة لأي نشاط غير قانوني أو مخالف للآداب العامة،
            كما تتعهد بالحفاظ على سرية معلومات تسجيل الدخول وعدم مشاركتها مع أي طرف.
          </p>

          <p className="leading-8 text-zinc-300">
            قد تقوم إدارة المنصة بتحديث هذه الشروط من وقت لآخر، ويتوجب على المستخدم
            مراجعتها بشكل دوري.
          </p>

          {/* إخلاء المسؤولية القانوني */}
          <div className="border border-amber-400/30 bg-amber-500/5 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-amber-300 mb-2">
              إخلاء المسؤولية القانونية
            </h2>
            <p className="leading-8 text-zinc-200">
              إن جميع الاستشارات المقدمة عبر الذكاء الاصطناعي داخل المنصة تُعد مواد
              معلوماتية فقط، ولا يمكن اعتبارها بديلاً عن الاستشارة القانونية المقدمة
              من محامٍ مرخّص. كما أن القوالب والعقود الجاهزة والترجمات المتاحة في
              المنصة تُقدم لأغراض إرشادية ولا تمثل استشارة قانونية ملزمة.  
            </p>

            <p className="leading-8 text-zinc-200 mt-3">
              لا تتحمل منصة المستشار القانوني أو إدارتها أو مطوروها أي مسؤولية عن أي
              ضرر مباشر أو غير مباشر ناتج عن استخدام المعلومات الظاهرة داخل المنصة أو
              اعتماد المستخدم عليها في أي إجراء قانوني أو تجاري أو شخصي.
            </p>
          </div>
        </section>

        {/* فاصل بين اللغتين */}
        <div className="h-px w-full bg-white/10" />

        {/* English Section */}
        <section className="text-left space-y-6">
          <h1 className="text-2xl font-bold">Terms of Use</h1>

          <p className="leading-7 text-zinc-300">
            By using the <strong>Legal Advisor</strong> platform, you agree to the
            following Terms of Use. These terms govern the relationship between the
            platform and its users and outline the respective rights and obligations.
          </p>

          <p className="leading-7 text-zinc-300">
            You agree not to use the platform for any unlawful purpose or in any way
            that violates public morality. You also agree to keep your login information
            confidential and refrain from sharing it with any third party.
          </p>

          <p className="leading-7 text-zinc-300">
            The platform may update these Terms of Use from time to time as part of
            ongoing service improvements. Users are encouraged to review the terms
            regularly.
          </p>

          {/* Disclaimer */}
          <div className="border border-amber-400/30 bg-amber-500/5 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-amber-300 mb-2">
              Legal Disclaimer
            </h2>

            <p className="leading-7 text-zinc-200">
              All AI-generated legal consultations on the platform are for informational
              purposes only and must not be considered a substitute for legal advice from
              a licensed attorney. The contract templates, legal documents, and
              translations provided on the platform are offered as general guidance and
              do not constitute binding legal advice.
            </p>

            <p className="leading-7 text-zinc-200 mt-3">
              The Legal Advisor platform, its administrators, and its developers shall
              not be held liable for any direct or indirect damages resulting from the
              use of information provided within the platform or reliance upon it for any
              legal, commercial, or personal action.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

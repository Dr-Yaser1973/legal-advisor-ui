 "use client";
//app/(site)/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" dir="rtl">
      <div className="container mx-auto px-4 py-10 text-right max-w-3xl leading-8">
        <h1 className="text-2xl font-bold mb-2">سياسة الخصوصية</h1>
        <p className="text-sm text-zinc-400 mb-8">آخر تحديث: 31 مايو 2026</p>

        <p className="mb-6 text-zinc-300">
          تُوضّح هذه السياسة كيفية جمع واستخدام وحماية بياناتك عند استخدامك تطبيق ومنصة
          «المستشار القانوني الذكي» (الخدمة). باستخدامك الخدمة فإنك توافق على الممارسات الموضّحة أدناه.
        </p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">١. البيانات التي نجمعها</h2>
        <ul className="list-disc pr-6 space-y-2 mb-6 text-zinc-300">
          <li>بيانات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف.</li>
          <li>بيانات تسجيل الدخول عبر Google: الاسم والبريد الإلكتروني عند اختيارك الدخول عبر حساب Google.</li>
          <li>المستندات والملفات التي ترفعها لأغراض الترجمة.</li>
          <li>نصوص الاستشارات القانونية والمحادثات داخل الخدمة.</li>
          <li>بيانات الاستخدام الأساسية لتحسين أداء الخدمة.</li>
        </ul>

        <h2 className="text-xl font-bold text-amber-400 mb-3">٢. كيفية استخدام البيانات</h2>
        <ul className="list-disc pr-6 space-y-2 mb-6 text-zinc-300">
          <li>تقديم خدمات الاستشارة القانونية والترجمة وتوليد العقود.</li>
          <li>إنشاء حسابك وإدارته والتحقق من هويتك.</li>
          <li>ربطك بالمحامين ومكاتب الترجمة عند طلبك.</li>
          <li>تحسين جودة الخدمة وتجربة المستخدم والتواصل معك بشأن طلباتك.</li>
        </ul>

        <h2 className="text-xl font-bold text-amber-400 mb-3">٣. مشاركة البيانات مع أطراف ثالثة</h2>
        <p className="mb-3 text-zinc-300">
          نستعين بمزوّدي خدمات موثوقين لتشغيل الخدمة، وتقتصر مشاركة البيانات على ما يلزم لأداء وظائفهم:
        </p>
        <ul className="list-disc pr-6 space-y-2 mb-3 text-zinc-300">
          <li><b>Google</b> — خدمة تسجيل الدخول.</li>
          <li><b>OpenAI</b> — معالجة الاستشارات والترجمة الذكية.</li>
          <li><b>Neon</b> — قاعدة البيانات.</li>
          <li><b>Supabase</b> — تخزين الملفات والمستندات.</li>
          <li><b>Vercel</b> — استضافة المنصة وواجهات البرمجة.</li>
          <li><b>Render</b> — توليد ملفات العقود بصيغة PDF.</li>
        </ul>
        <p className="mb-6 text-zinc-300">لا نبيع بياناتك الشخصية لأي طرف ثالث لأغراض إعلانية.</p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">٤. الاستشارات القانونية</h2>
        <p className="mb-6 text-zinc-300">
          الاستشارات المُقدَّمة عبر الذكاء الاصطناعي لأغراض معلوماتية فقط ولا تُعدّ بديلاً عن استشارة
          محامٍ مختص. أما الاستشارات مع المحامين البشريين فتتم بينك وبين المحامي المعتمد عبر الخدمة.
        </p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">٥. حماية البيانات</h2>
        <p className="mb-6 text-zinc-300">
          نتخذ تدابير تقنية وتنظيمية معقولة لحماية بياناتك من الوصول أو الاستخدام أو الإفصاح غير المصرّح به.
          ومع ذلك، لا توجد طريقة نقل أو تخزين إلكترونية آمنة بنسبة 100%.
        </p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">٦. حقوقك وحذف الحساب</h2>
        <ul className="list-disc pr-6 space-y-2 mb-6 text-zinc-300">
          <li>الوصول إلى بياناتك الشخصية وطلب تصحيحها.</li>
          <li>
            حذف حسابك وبياناتك نهائياً في أي وقت مباشرةً من داخل التطبيق عبر
            «حسابي ← حذف الحساب»، أو بمراسلتنا على البريد أدناه.
          </li>
          <li>سحب موافقتك على معالجة بياناتك.</li>
        </ul>

        <h2 className="text-xl font-bold text-amber-400 mb-3">٧. الأطفال</h2>
        <p className="mb-6 text-zinc-300">
          الخدمة غير موجّهة للأشخاص دون سن 18 عاماً، ولا نجمع عن قصد بيانات منهم.
        </p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">٨. التعديلات على هذه السياسة</h2>
        <p className="mb-6 text-zinc-300">
          قد نُحدّث هذه السياسة من حين لآخر، وسننشر أي تغييرات على هذه الصفحة مع تحديث تاريخ «آخر تحديث» أعلاه.
        </p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">٩. التواصل</h2>
        <p className="text-zinc-300">
          لأي استفسار يتعلق بالخصوصية أو بياناتك، يمكنك التواصل مع المسؤول عن الخدمة:
        </p>
        <p className="mt-2 text-zinc-300">
          <b>ياسر حسن حسين</b><br />
          البريد الإلكتروني:{" "}
          <a href="mailto:yaseralzbadi@gmail.com" className="text-amber-400 hover:underline">
            yaseralzbadi@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
 // app/(site)/about/page.tsx
"use client";

import { useState } from "react";

export default function AboutPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const isArabic = lang === "ar";

  return (
    <div
      className={`container mx-auto py-10 px-4 ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ===== العنوان / Title ===== */}
      <h1 className="text-3xl font-bold mb-6">
        {isArabic ? "من نحن" : "About Us"}
      </h1>

      {/* ===== المحتوى ===== */}
      {isArabic ? (
        <div className="space-y-6 leading-8 text-lg">
          <p>
            مرحبًا بك في <strong>منصة المستشار القانوني الذكي</strong>؛ أول
            منظومة قانونية عربية متخصصة تجمع بين الخبرة القانونية والتقنيات
            الحديثة والذكاء الاصطناعي لتقديم الاستشارات، العقود، إدارة القضايا،
            الترجمة القانونية، والمكتبة القانونية في مكان واحد.
          </p>

          <h2 className="text-2xl font-semibold mt-4">رؤيتنا</h2>
          <p>
            أن نكون المنصة القانونية الرقمية الأولى عربيًا، عبر تقديم خدمات
            دقيقة وذكية للشركات، الأفراد، ومكاتب المحاماة.
          </p>

          <h2 className="text-2xl font-semibold mt-4">مهمتنا</h2>
          <ul className="list-disc pr-6 space-y-2">
            <li>تسهيل الوصول للنصوص والمراجع القانونية.</li>
            <li>توفير أدوات فعالة لإعداد العقود والمذكرات.</li>
            <li>مساعدة الشركات ومكاتب المحاماة في إدارة قضاياها.</li>
            <li>تقديم ترجمة قانونية متخصصة ودقيقة.</li>
            <li>تطوير محامٍ ذكي يعتمد على الذكاء الاصطناعي والتحليل القانوني.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">خدماتنا</h2>
          <ul className="list-disc pr-6 space-y-2">
            <li>المحامي الذكي – إجابات وتحليل قانوني بالذكاء الاصطناعي.</li>
            <li>المكتبة القانونية – قوانين وكتب وفقه ودراسات.</li>
            <li>العقود الذكية – إعداد وتوليد العقود بصيغة PDF.</li>
            <li>الاستشارات القانونية – ذكاء اصطناعي ومحامون بشريون.</li>
            <li>إدارة القضايا – للشركات ومكاتب المحاماة.</li>
            <li>الترجمة القانونية – آلية وبشرية معتمدة.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">عن المؤسس</h2>
          <p>
            <strong>د. ياسر حسن حسين الزبيدي</strong>
            <br />
            حاصل على درجة الدكتوراه في القانون العام،  
            وبكالوريوس في الإحصاء ونظم المعلومات،  
            وباحث في القانون الدستوري والإداري والاقتصادي.
          </p>

          <p>
            يجمع المؤسس بين الخبرة الأكاديمية والقانونية من جهة، والخبرة التقنية
            والتحليلية من جهة أخرى، مما مكّنه من بناء منصة قانونية حديثة ترتكز
            على الذكاء الاصطناعي والتطوير التكنولوجي.
          </p>

          <h2 className="text-2xl font-semibold mt-4">تواصل معنا</h2>
          <p>نرحّب بملاحظاتكم واقتراحاتكم عبر البريد:</p>
          <p className="font-mono text-blue-400">support@legal-advisor.iq</p>
        </div>
      ) : (
        <div className="space-y-6 leading-8 text-lg">
          <p>
            Welcome to the <strong>Intelligent Legal Advisor Platform</strong>, the
            first advanced Arabic legal system that integrates legal expertise with
            modern technology and artificial intelligence to deliver consultations,
            smart contracts, legal case management, legal translation, and a
            comprehensive law library in one place.
          </p>

          <h2 className="text-2xl font-semibold mt-4">Our Vision</h2>
          <p>
            To become the leading digital legal platform in the Arab world by
            offering accurate and intelligent services for individuals, companies,
            and law firms.
          </p>

          <h2 className="text-2xl font-semibold mt-4">Our Mission</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Facilitate access to legal texts and references.</li>
            <li>Provide smart tools for drafting contracts and legal documents.</li>
            <li>Help companies and law firms manage their cases efficiently.</li>
            <li>Deliver accurate and specialized legal translation.</li>
            <li>Develop an AI-powered legal assistant for smart analysis.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">Our Services</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI Lawyer – Intelligent legal answers and analysis.</li>
            <li>Legal Library – Laws, jurisprudence, and academic studies.</li>
            <li>Smart Contracts – Automated PDF contract generation.</li>
            <li>Legal Consultations – AI and human lawyers.</li>
            <li>Case Management – For companies and law firms.</li>
            <li>Legal Translation – Automated and certified translation.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">About the Founder</h2>
          <p>
            <strong>Dr. Yaser Hassan Hussein Al-Zubaidi</strong>,  
            holds a PhD in Public Law,  
            and a Bachelor's degree in Statistics and Information Systems.  
            He is a legal and constitutional researcher, and currently works at the
            Iraqi Ministry of Trade – Department of External Economic Relations.
          </p>

          <p>
            Combining legal, academic, and technical expertise, the founder built
            this platform as a modern legal system powered by AI and advanced
            technology.
          </p>

          <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
          <p>We welcome your feedback and suggestions at:</p>
          <p className="font-mono text-blue-500">support@legal-advisor.iq</p>
        </div>
      )}

      {/* ===== أزرار تغيير اللغة ===== */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => setLang("ar")}
          className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700"
        >
          العربية
        </button>

        <button
          onClick={() => setLang("en")}
          className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700"
        >
          English
        </button>
      </div>
    </div>
  );
}

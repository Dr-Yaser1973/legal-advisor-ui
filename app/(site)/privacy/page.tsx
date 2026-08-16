 "use client";
//app/(site)/privacy/page.tsx
import { useLocale } from "@/lib/hooks/useLocale";

const T = {
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 31 مايو 2026",
    intro:
      "تُوضّح هذه السياسة كيفية جمع واستخدام وحماية بياناتك عند استخدامك تطبيق ومنصة «المستشار القانوني الذكي» (الخدمة). باستخدامك الخدمة فإنك توافق على الممارسات الموضّحة أدناه.",
    s1: "١. البيانات التي نجمعها",
    s1list: [
      "بيانات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف.",
      "بيانات تسجيل الدخول عبر Google: الاسم والبريد الإلكتروني عند اختيارك الدخول عبر حساب Google.",
      "المستندات والملفات التي ترفعها لأغراض الترجمة.",
      "نصوص الاستشارات القانونية والمحادثات داخل الخدمة.",
      "بيانات الاستخدام الأساسية لتحسين أداء الخدمة.",
    ],
    s2: "٢. كيفية استخدام البيانات",
    s2list: [
      "تقديم خدمات الاستشارة القانونية والترجمة وتوليد العقود.",
      "إنشاء حسابك وإدارته والتحقق من هويتك.",
      "ربطك بالمحامين ومكاتب الترجمة عند طلبك.",
      "تحسين جودة الخدمة وتجربة المستخدم والتواصل معك بشأن طلباتك.",
    ],
    s3: "٣. مشاركة البيانات مع أطراف ثالثة",
    s3intro:
      "نستعين بمزوّدي خدمات موثوقين لتشغيل الخدمة، وتقتصر مشاركة البيانات على ما يلزم لأداء وظائفهم:",
    s3list: [
      ["Google", " — خدمة تسجيل الدخول."],
      ["OpenAI", " — معالجة الاستشارات والترجمة الذكية."],
      ["Neon", " — قاعدة البيانات."],
      ["Supabase", " — تخزين الملفات والمستندات."],
      ["Vercel", " — استضافة المنصة وواجهات البرمجة."],
      ["Render", " — توليد ملفات العقود بصيغة PDF."],
    ],
    s3note: "لا نبيع بياناتك الشخصية لأي طرف ثالث لأغراض إعلانية.",
    s4: "٤. الاستشارات القانونية",
    s4p:
      "الاستشارات المُقدَّمة عبر الذكاء الاصطناعي لأغراض معلوماتية فقط ولا تُعدّ بديلاً عن استشارة محامٍ مختص. أما الاستشارات مع المحامين البشريين فتتم بينك وبين المحامي المعتمد عبر الخدمة.",
    s5: "٥. حماية البيانات",
    s5p:
      "نتخذ تدابير تقنية وتنظيمية معقولة لحماية بياناتك من الوصول أو الاستخدام أو الإفصاح غير المصرّح به. ومع ذلك، لا توجد طريقة نقل أو تخزين إلكترونية آمنة بنسبة 100%.",
    s6: "٦. حقوقك وحذف الحساب",
    s6list: [
      "الوصول إلى بياناتك الشخصية وطلب تصحيحها.",
      "حذف حسابك وبياناتك نهائياً في أي وقت مباشرةً من داخل التطبيق عبر «حسابي ← حذف الحساب»، أو بمراسلتنا على البريد أدناه.",
      "سحب موافقتك على معالجة بياناتك.",
    ],
    s7: "٧. الأطفال",
    s7p:
      "الخدمة غير موجّهة للأشخاص دون سن 18 عاماً، ولا نجمع عن قصد بيانات منهم.",
    s8: "٨. التعديلات على هذه السياسة",
    s8p:
      "قد نُحدّث هذه السياسة من حين لآخر، وسننشر أي تغييرات على هذه الصفحة مع تحديث تاريخ «آخر تحديث» أعلاه.",
    s9: "٩. التواصل",
    s9p: "لأي استفسار يتعلق بالخصوصية أو بياناتك، يمكنك التواصل مع المسؤول عن الخدمة:",
    owner: "ياسر حسن حسين",
    emailLabel: "البريد الإلكتروني:",
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: May 31, 2026",
    intro:
      "This policy explains how your data is collected, used, and protected when you use the “Smart Legal Advisor” app and platform (the Service). By using the Service, you agree to the practices described below.",
    s1: "1. Data we collect",
    s1list: [
      "Account data: name, email, phone number.",
      "Google sign-in data: name and email when you choose to sign in with a Google account.",
      "Documents and files you upload for translation purposes.",
      "Legal consultation texts and conversations within the Service.",
      "Basic usage data to improve the Service’s performance.",
    ],
    s2: "2. How we use data",
    s2list: [
      "Providing legal consultation, translation, and contract generation services.",
      "Creating and managing your account and verifying your identity.",
      "Connecting you with lawyers and translation offices upon request.",
      "Improving service quality and user experience, and communicating with you about your requests.",
    ],
    s3: "3. Sharing data with third parties",
    s3intro:
      "We rely on trusted service providers to operate the Service, and data sharing is limited to what is necessary for them to perform their functions:",
    s3list: [
      ["Google", " — sign-in service."],
      ["OpenAI", " — processing consultations and smart translation."],
      ["Neon", " — database."],
      ["Supabase", " — file and document storage."],
      ["Vercel", " — platform hosting and APIs."],
      ["Render", " — generating contract files as PDF."],
    ],
    s3note: "We do not sell your personal data to any third party for advertising purposes.",
    s4: "4. Legal consultations",
    s4p:
      "Consultations provided via artificial intelligence are for informational purposes only and are not a substitute for advice from a qualified attorney. Consultations with human lawyers take place between you and the certified lawyer through the Service.",
    s5: "5. Data protection",
    s5p:
      "We take reasonable technical and organizational measures to protect your data from unauthorized access, use, or disclosure. However, no method of electronic transmission or storage is 100% secure.",
    s6: "6. Your rights and account deletion",
    s6list: [
      "Access your personal data and request its correction.",
      "Permanently delete your account and data at any time directly from within the app via “My Account → Delete Account,” or by contacting us at the email below.",
      "Withdraw your consent to the processing of your data.",
    ],
    s7: "7. Children",
    s7p:
      "The Service is not directed to persons under 18 years of age, and we do not knowingly collect data from them.",
    s8: "8. Changes to this policy",
    s8p:
      "We may update this policy from time to time, and any changes will be posted on this page with the “Last updated” date above revised.",
    s9: "9. Contact",
    s9p: "For any inquiry regarding privacy or your data, you can contact the person responsible for the Service:",
    owner: "Yaser Hassan Hussein",
    emailLabel: "Email:",
  },
} as const;

export default function PrivacyPage() {
  const { locale, dir } = useLocale();
  const t = T[locale];
  const align = dir === "rtl" ? "text-right" : "text-left";
  const listPad = dir === "rtl" ? "pr-6" : "pl-6";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" dir={dir}>
      <div className={`container mx-auto px-4 py-10 ${align} max-w-3xl leading-8`}>
        <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
        <p className="text-sm text-zinc-400 mb-8">{t.updated}</p>

        <p className="mb-6 text-zinc-300">{t.intro}</p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">{t.s1}</h2>
        <ul className={`list-disc ${listPad} space-y-2 mb-6 text-zinc-300`}>
          {t.s1list.map((li) => (
            <li key={li}>{li}</li>
          ))}
        </ul>

        <h2 className="text-xl font-bold text-amber-400 mb-3">{t.s2}</h2>
        <ul className={`list-disc ${listPad} space-y-2 mb-6 text-zinc-300`}>
          {t.s2list.map((li) => (
            <li key={li}>{li}</li>
          ))}
        </ul>

        <h2 className="text-xl font-bold text-amber-400 mb-3">{t.s3}</h2>
        <p className="mb-3 text-zinc-300">{t.s3intro}</p>
        <ul className={`list-disc ${listPad} space-y-2 mb-3 text-zinc-300`}>
          {t.s3list.map(([name, rest]) => (
            <li key={name}>
              <b>{name}</b>
              {rest}
            </li>
          ))}
        </ul>
        <p className="mb-6 text-zinc-300">{t.s3note}</p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">{t.s4}</h2>
        <p className="mb-6 text-zinc-300">{t.s4p}</p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">{t.s5}</h2>
        <p className="mb-6 text-zinc-300">{t.s5p}</p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">{t.s6}</h2>
        <ul className={`list-disc ${listPad} space-y-2 mb-6 text-zinc-300`}>
          {t.s6list.map((li) => (
            <li key={li}>{li}</li>
          ))}
        </ul>

        <h2 className="text-xl font-bold text-amber-400 mb-3">{t.s7}</h2>
        <p className="mb-6 text-zinc-300">{t.s7p}</p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">{t.s8}</h2>
        <p className="mb-6 text-zinc-300">{t.s8p}</p>

        <h2 className="text-xl font-bold text-amber-400 mb-3">{t.s9}</h2>
        <p className="text-zinc-300">{t.s9p}</p>
        <p className="mt-2 text-zinc-300">
          <b>{t.owner}</b>
          <br />
          {t.emailLabel}{" "}
          <a href="mailto:yaseralzbadi@gmail.com" className="text-amber-400 hover:underline">
            yaseralzbadi@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

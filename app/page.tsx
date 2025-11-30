 // app/(site)/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, FileText, Scale, MessageCircle, Languages } from "lucide-react";

type Lang = "ar" | "en";

 const content = {
  ar: {
    dir: "rtl" as const,
    label: "العربية",
    heroTitle: "منصة المستشار القانوني",
    heroSubtitle:
      "منصّة قانونية ذكية تجمع بين المكتبة القانونية المتقدمة، توليد العقود، الترجمة القانونية، والاستشارات مع محامين معتمدين.",
    heroPrimary: "ابدأ الآن",
    heroSecondary: "تعرّف على الخدمات",
    badge: "نسخة تجريبية",

    sections: {
      servicesTitle: "خدمات المنصة",
      servicesSubtitle: "مجموعة من الأدوات القانونية الذكية الموجهة للمحامين، الشركات، والأفراد.",
      aboutTitle: "لماذا المستشار القانوني؟",
      aboutBody:
        "تم تطوير هذه المنصة بواسطة د. ياسر حسن حسين الزبيدي، الحاصل على درجة الدكتوراه في القانون العام، "
        + "والذي يمتلك أيضًا بكالوريوس في الإحصاء ونظم المعلومات وخبرة عملية في المجالين القانوني والاقتصادي. "
        + "تهدف المنصة إلى تقديم خدمات قانونية رقمية ذات جودة عالية تجمع بين الدقة القانونية والذكاء الاصطناعي.",
      ctaTitle: "جاهز لتجربة المنصة؟",
      ctaBody:
        "ابدأ الآن باستخدام المكتبة القانونية، أو جرّب توليد عقد قانوني، أو اطلب استشارة من محامٍ معتمد.",
    },

    // 🔹 هنا أصبح عدد الخدمات 6
     services: [
  {
    title: "المكتبة القانونية الذكية",
    description: "بحث في القوانين والكتب الفقهية والدراسات الأكاديمية مع إمكانات بحث نصي ودلالي.",
    href: "/library",
    icon: BookOpen,
  },
  {
    title: "توليد العقود القانونية",
    description: "إنشاء عقود قانونية ذكية باللغة العربية بصيغة PDF وفق نماذج جاهزة وقابلة للتخصيص.",
    href: "/contracts",
    icon: FileText,
  },
  {
    title: "الترجمة القانونية",
    description: "ترجمة النصوص والعقود والمذكرات القانونية بين العربية والإنجليزية مع خيار الترجمة الرسمية.",
    href: "/translation",
    icon: Languages,
  },
  {
    title: "المحامي الذكي",
    description: "تحليل ذكي للمستندات وتقديم بيانات رأي قانونية.",
    href: "/smart-lawyer",
    icon: MessageCircle,
  },
  {
    title: "الاستشارات الذكية",
    description: "استشارات فورية للموضوعات القانونية عبر الذكاء الاصطناعي.",
    href: "/consultations/ai",
    icon: Scale,
  },
  {
    title: "استشارات من محامين معتمدين",
    description: "طلب استشارة قانونية من محامين معتمدين داخل المنصة ومتابعة حالة الطلب.",
    href: "/consultations",
    icon: Scale,
  },
      {
        title: "إدارة القضايا للشركات",
        description: "لوحة لإدارة ومتابعة القضايا الخاصة بالشركات ومكاتب المحاماة (قابلة للتطوير في الإصدارات القادمة).",
        href: "/cases", // عدّل المسار إذا لديك مسار آخر
        icon: Scale,
      },
    ],

    stats: [
      { label: "الخدمات الأساسية في النسخة التجريبية", value: "6+" },
      { label: "مجالات قانونية مدعومة", value: "متعددة" },
      { label: "لغة الواجهة", value: "العربية والإنجليزية" },
    ],

    footer: {
      about: "من نحن",
      privacy: "الخصوصية والشروط",
      rights: "جميع الحقوق محفوظة",
    },
  },

  en: {
    dir: "ltr" as const,
    label: "English",
    heroTitle: "Legal Advisor Platform",
    heroSubtitle:
      "A smart legal platform combining an advanced legal library, contract generation, legal translation, and consultations with licensed lawyers.",
    heroPrimary: "Get started",
    heroSecondary: "Explore services",
    badge: "Beta Version",

    sections: {
      servicesTitle: "Platform Services",
      servicesSubtitle:
        "A set of intelligent legal tools tailored for lawyers, companies, and individuals.",
      aboutTitle: "Why Legal Advisor?",
      aboutBody:
        "This platform was developed by Dr. Yaser Hassan Hussein Al-Zubaidi, who holds a PhD in Public Law "
        + "and a BSc in Statistics and Information Systems, with professional experience in both legal and economic fields. "
        + "The platform aims to deliver high-quality digital legal services that combine legal accuracy with artificial intelligence.",
      ctaTitle: "Ready to try the platform?",
      ctaBody:
        "Start using the legal library, generate a legal contract, or request a consultation from a licensed lawyer.",
    },

    // 🔹 نفس الفكرة بالإنجليزي: 6 خدمات
     services: [
  {
    title: "Smart Legal Library",
    description: "Search Iraqi laws, fiqh books, and academic studies with full-text and semantic search capabilities.",
    href: "/library",
    icon: BookOpen,
  },
  {
    title: "Contract Generator",
    description: "Create Arabic legal contracts in PDF format using customizable ready-made templates.",
    href: "/contracts",
    icon: FileText,
  },
  {
    title: "Legal Translation",
    description: "Translate legal texts, contracts, and memos between Arabic and English, with an option for official translation.",
    href: "/translation",
    icon: Languages,
  },
  {
    title: "smart-lawyer",
    description: "Intelligent document analysis and generation of legal opinion information.",
    href: "/smart-lawyer",
    icon: MessageCircle,
  },
  {
    title: "Smart Consultations",
    description: "Instant AI-powered consultations for various legal topics.",
    href: "/consultations/ai",
    icon: Scale,
  },
  {
    title: "Consultations from Licensed Lawyers",
    description: "Request legal consultations from verified lawyers and track the status of your request.",
    href: "/consultations",
    icon: Scale,
  },
      {
        title: "Case Management for Companies",
        description:
          "A dedicated area to manage and follow up legal cases for companies and law firms (extensible in future releases).",
        href: "/cases",
        icon: Scale,
      },
    ],

    stats: [
      { label: "Core services in beta", value: "6+" },
      { label: "Supported legal domains", value: "Multiple" },
      { label: "Interface language", value: "Arabic & English" },
    ],

    footer: {
      about: "About Us",
      privacy: "Privacy & Terms",
      rights: "All rights reserved",
    },
  },
};


export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = content[lang];

  return (
    <main
      dir={t.dir}
      className="min-h-screen bg-zinc-950 text-zinc-50"
    >
      {/* أعلى الصفحة + تبديل اللغة */}
      <div className="border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-yellow-400" />
            <span className="text-lg font-semibold tracking-tight">
              {lang === "ar" ? "المستشار القانوني" : "Legal Advisor"}
            </span>
            <span className="ms-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-300">
              {t.badge}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* روابط سريعة أعلى الصفحة (يمكنك حذفها إذا كان لديك Navbar في layout.tsx) */}
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-300">
              <Link href="/library" className="hover:text-white transition">
                {lang === "ar" ? "المكتبة" : "Library"}
              </Link>
              <span className="opacity-30">•</span>
              <Link href="/contracts" className="hover:text-white transition">
                {lang === "ar" ? "العقود" : "Contracts"}
              </Link>
              <span className="opacity-30">•</span>
              <Link href="/translation" className="hover:text-white transition">
                {lang === "ar" ? "الترجمة" : "Translation"}
              </Link>
              <span className="opacity-30">•</span>
              <Link href="/lawyers" className="hover:text-white transition">
                {lang === "ar" ? "المحامون" : "Lawyers"}
              </Link>
            </div>

            {/* زرّي اللغة */}
            <div className="flex rounded-full border border-white/10 bg-zinc-900/80 p-1 text-xs">
              <button
                onClick={() => setLang("ar")}
                className={`px-3 py-1 rounded-full ${
                  lang === "ar"
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full ${
                  lang === "en"
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 py-10 md:py-16">
        {/* Hero Section */}
        <section className="grid gap-10 md:grid-cols-2 items-center">
          <div className={lang === "ar" ? "text-right" : "text-left"}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-sm md:text-base text-zinc-300 mb-6">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/library"
                className="inline-flex items-center justify-center rounded-full bg-yellow-500 text-zinc-900 px-5 py-2.5 text-sm font-semibold hover:bg-yellow-400 transition"
              >
                {t.heroPrimary}
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5 transition"
              >
                {t.heroSecondary}
              </a>
            </div>

            {/* إحصائيات بسيطة */}
            <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
              {t.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2"
                >
                  <div className="text-lg md:text-xl font-semibold text-yellow-300">
                    {s.value}
                  </div>
                  <div className="text-zinc-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* بطاقة توضيحية جانبية */}
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-zinc-100">
                  {lang === "ar"
                    ? "نموذج من واجهة الخدمات"
                    : "Preview of services"}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-zinc-300">
                {t.services.map((service) => (
                  <li
                    key={service.title}
                    className="flex items-start gap-2 rounded-lg bg-zinc-950/60 px-3 py-2"
                  >
                    <service.icon className="w-4 h-4 mt-1 text-yellow-400" />
                    <div>
                      <div className="font-medium text-zinc-50">
                        {service.title}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {service.description}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-[11px] text-zinc-500">
                {lang === "ar"
                  ? "هذه واجهة تجريبية توضح أهم الخدمات المتاحة في النسخة الأولى من المنصة."
                  : "This is a demo preview showing the core services available in the first beta version."}
              </div>
            </div>
          </div>
        </section>

        {/* قسم الخدمات */}
        <section id="services" className="mt-16 md:mt-20">
          <div
            className={
              "mb-6 " + (lang === "ar" ? "text-right" : "text-left")
            }
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              {t.sections.servicesTitle}
            </h2>
            <p className="text-sm md:text-base text-zinc-300">
              {t.sections.servicesSubtitle}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {t.services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-4 hover:border-yellow-400/70 hover:bg-zinc-900 transition flex flex-col h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="rounded-full bg-yellow-500/15 p-2">
                    <service.icon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-sm font-semibold">{service.title}</h3>
                </div>
                <p className="text-xs text-zinc-300 flex-1">
                  {service.description}
                </p>
                <div
                  className={
                    "mt-3 text-xs font-medium text-yellow-300 " +
                    (lang === "ar" ? "text-left" : "text-right")
                  }
                >
                  {lang === "ar" ? "الدخول للخدمة →" : "Open service →"}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* قسم لماذا المنصة / نبذة عنك */}
        <section className="mt-16 md:mt-20 grid gap-8 md:grid-cols-2 items-start">
          <div className={lang === "ar" ? "text-right" : "text-left"}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              {t.sections.aboutTitle}
            </h2>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
              {t.sections.aboutBody}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 text-xs text-zinc-300">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-yellow-400" />
              {lang === "ar"
                ? "ركائز المنصة"
                : "Core pillars of the platform"}
            </h3>
            <ul className="space-y-1.5 list-disc ps-4">
              <li>
                {lang === "ar"
                  ? "دقة قانونية معتمدة على خبرة أكاديمية وعملية."
                  : "Legal accuracy based on academic and practical expertise."}
              </li>
              <li>
                {lang === "ar"
                  ? "استخدام الذكاء الاصطناعي لدعم العمل القانوني لا لاستبداله."
                  : "Using AI to support, not replace, professional legal work."}
              </li>
              <li>
                {lang === "ar"
                  ? "تصميم واجهة عربية/إنجليزية مريحة للمستخدم."
                  : "User-friendly Arabic/English interface."}
              </li>
              <li>
                {lang === "ar"
                  ? "إمكانية التوسع لاحقًا لإضافة القضايا والمحامي الذكي للشركات."
                  : "Future-ready to add case management and smart corporate lawyer modules."}
              </li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 md:mt-20">
          <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-l from-yellow-500/10 via-zinc-900 to-zinc-950 px-5 py-6 md:px-8 md:py-8">
            <div
              className={
                "flex flex-col md:flex-row md:items-center md:justify-between gap-4 " +
                (lang === "ar" ? "text-right" : "text-left")
              }
            >
              <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-1">
                  {t.sections.ctaTitle}
                </h2>
                <p className="text-sm md:text-base text-zinc-200">
                  {t.sections.ctaBody}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contracts"
                  className="inline-flex items-center justify-center rounded-full bg-yellow-400 text-zinc-900 px-5 py-2.5 text-sm font-semibold hover:bg-yellow-300 transition"
                >
                  {lang === "ar"
                    ? "جرّب توليد عقد"
                    : "Try generating a contract"}
                </Link>
                <Link
                  href="/lawyers"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-50 hover:bg-white/5 transition"
                >
                  {lang === "ar"
                    ? "استعرض قائمة المحامين"
                    : "Browse lawyers"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer بسيط */}
      <footer className="border-t border-white/10 bg-zinc-950/90">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1">
            <Scale className="w-3 h-3 text-yellow-400" />
            <span>
              {lang === "ar"
                ? `منصة المستشار القانوني – ${t.footer.rights}`
                : `Legal Advisor Platform – ${t.footer.rights}`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/about"
              className="hover:text-zinc-200 transition"
            >
              {t.footer.about}
            </Link>
            <span className="opacity-30">•</span>
            <Link
              href="/privacy"
              className="hover:text-zinc-200 transition"
            >
              {t.footer.privacy}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

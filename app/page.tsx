 "use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Languages,
  MessageSquare,
  Briefcase,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Scale,
  ArrowLeft,
  ChevronLeft,
  Globe,
  CheckCircle2,
} from "lucide-react";

type Lang = "ar" | "en";

type Service = {
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
};

const CONTENT = {
  ar: {
    dir: "rtl" as const,
    langLabel: "العربية",
    brand: "منصة المستشار القانوني الذكي",
    portal: "البوابة الرقمية للخدمات القانونية",
    portalEn: "Digital Legal Services Portal",
    topNote: "واجهة رسمية • ثنائية اللغة • محسّنة للموبايل",
    heroTitle: "بوابة للخدمات القانونية الرقمية",
    heroSubtitle:
      "وصول سريع إلى المكتبة القانونية، توليد العقود، الترجمة القانونية، والاستشارات — بتجربة مؤسسية جاذبة تعمل بسلاسة على الموبايل.",
    heroPrimary: "الدخول إلى المكتبة القانونية",
    heroSecondary: "إنشاء حساب",
    heroTertiary: "تسجيل الدخول",

    quickActionsTitle: "الخدمات الأساسية",
    quickActionsHint:
      "اختر خدمة للبدء. المكتبة متاحة للعامة بدون تسجيل — بينما الخدمات المهنية تتطلب حسابًا.",

    servicesTitle: "دليل الخدمات",
    servicesSubtitle:
      "خدمات قانونية رقمية مصممة لتناسب المستخدم العادي والمهني والمؤسسات.",

    audiencesTitle: "الفئات المستفيدة",
    audiencesSubtitle:
      "بوابة موحّدة تخدم الأفراد والمحامين والشركات ومكاتب الترجمة.",

    trustTitle: "الخصوصية والموثوقية",
    trustSubtitle:
      "تم تصميم المنصة وفق مبادئ السلامة الرقمية وتجربة استخدام رسمية.",

    trust: [
      {
        title: "حماية البيانات",
        desc: "ضوابط وصول وأذونات واضحة للبيانات والملفات.",
      },
      {
        title: "مخرجات قانونية احترافية",
        desc: "قوالب عقود وتوثيق منظم لطلبات الخدمات.",
      },
      {
        title: "جاهزية الموبايل",
        desc: "واجهة خفيفة وسريعة مناسبة للأجهزة المحمولة.",
      },
    ],

    audience: [
      {
        title: "المستخدم العادي",
        points: ["تصفح وبحث", "نماذج عقود", "استشارات عند الحاجة"],
      },
      {
        title: "المحامي",
        points: ["حضور مهني", "طلبات واستشارات", "مكتبة قوية للبحث"],
      },
      {
        title: "الشركات",
        points: ["إدارة قضايا", "عقود مؤسسية", "ملفات وامتثال"],
      },
      {
        title: "مكتب ترجمة",
        points: ["طلبات منظمة", "رفع صور/مسح", "مسار ترجمة رسمية"],
      },
    ],

    footer: {
      rights: "جميع الحقوق محفوظة",
      about: "من نحن",
      privacy: "الخصوصية",
      terms: "الشروط",
      disclaimer: "إخلاء المسؤولية",
    },

    mobileCta: "المكتبة القانونية",
  },

  en: {
    dir: "ltr" as const,
    langLabel: "English",
    brand: "Smart Legal Advisor Platform",
    portal: "Digital Legal Services Portal",
    portalEn: "البوابة الرقمية للخدمات القانونية",
    topNote: "Official • Bilingual • Mobile-Optimized",
    heroTitle: " Gateway for Digital Legal Services",
    heroSubtitle:
      "Fast access to the legal library, contract generation, legal translation, and consultations — with an institutional, mobile-first experience.",
    heroPrimary: "Open Legal Library",
    heroSecondary: "Create Account",
    heroTertiary: "Sign In",

    quickActionsTitle: "Core Services",
    quickActionsHint:
      "Pick a service to start. The library is public (no sign-in). Professional services require an account.",

    servicesTitle: "Services Directory",
    servicesSubtitle:
      "Digital legal services designed for individuals, professionals, and organizations.",

    audiencesTitle: "Who Is It For?",
    audiencesSubtitle:
      "A unified portal serving individuals, lawyers, companies, and translation offices.",

    trustTitle: "Privacy & Reliability",
    trustSubtitle:
      "Built with digital safety principles and an official user experience in mind.",

    trust: [
      {
        title: "Data Protection",
        desc: "Clear access controls and secure handling for documents.",
      },
      {
        title: "Professional Output",
        desc: "Structured workflows and professional contract templates.",
      },
      {
        title: "Mobile-First",
        desc: "Fast, lightweight interface optimized for mobile devices.",
      },
    ],

    audience: [
      {
        title: "Individuals",
        points: ["Browse & search", "Contract templates", "On-demand advice"],
      },
      {
        title: "Lawyers",
        points: ["Professional presence", "Requests & consultations", "Powerful research library"],
      },
      {
        title: "Companies",
        points: ["Case management", "Corporate contracts", "Files & compliance"],
      },
      {
        title: "Translation Offices",
        points: ["Organized requests", "Image/scan upload", "Official translation flow"],
      },
    ],

    footer: {
      rights: "All rights reserved",
      about: "About",
      privacy: "Privacy",
      terms: "Terms",
      disclaimer: "Disclaimer",
    },

    mobileCta: "Legal Library",
  },
} as const;

export default function HomeGovPortal() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = CONTENT[lang];

  const services: Service[] = useMemo(
    () => [
      {
        title: lang === "ar" ? "المكتبة القانونية" : "Legal Library",
        desc:
          lang === "ar"
            ? "بحث وقراءة وPDF أصلي وشرح متعدد المستويات."
            : "Search, read, original PDFs, and layered explanations.",
        href: "/library",
        icon: BookOpen,
      },
      {
        title: lang === "ar" ? "العقود الذكية" : "Smart Contracts",
        desc:
          lang === "ar"
            ? "نماذج احترافية + توليد PDF سريع."
            : "Professional templates + fast PDF generation.",
        href: "/contracts",
        icon: FileText,
      },
      {
        title: lang === "ar" ? "الترجمة القانونية" : "Legal Translation",
        desc:
          lang === "ar"
            ? "طلبات منظمة + دعم صور/مسح من الموبايل."
            : "Organized requests + mobile image/scan support.",
        href: "/translate",
        icon: Languages,
      },
      {
        title: lang === "ar" ? "الاستشارات" : "Consultations",
        desc:
          lang === "ar"
            ? "طلبات واضحة ومحادثات منظمة."
            : "Clear requests and organized conversations.",
        href: "/consultations",
        icon: MessageSquare,
      },
      {
        title: lang === "ar" ? "إدارة القضايا" : "Case Management",
        desc:
          lang === "ar"
            ? "للشركات: متابعة القضايا والملفات والمهام."
            : "For companies: track cases, files, and tasks.",
        href: "/cases",
        icon: Briefcase,
      },
      {
        title: lang === "ar" ? "المحامي الذكي" : "Smart Lawyer",
        desc:
          lang === "ar"
            ? "مساند بحثي وتحليل أولي مدعوم بالذكاء."
            : "AI-assisted research and preliminary legal analysis.",
        href: "/smart-lawyer",
        icon: Sparkles,
      },
    ],
    [lang],
  );

  return (
    <main dir={t.dir} className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* TOP BAR (Official) */}
      <div className="border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <Scale className="h-4 w-4 text-amber-300" />
            <span className="font-semibold text-zinc-100">{t.portal}</span>
            <span className="opacity-40">•</span>
            <span className="hidden sm:inline">{t.topNote}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
              <Globe className="h-4 w-4" />
              <span>{lang === "ar" ? "Language" : "اللغة"}</span>
            </div>

            <div className="flex rounded-full border border-white/10 bg-zinc-900/60 p-1 text-xs">
              <button
                onClick={() => setLang("ar")}
                className={`px-3 py-1 rounded-full transition ${
                  lang === "ar"
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full transition ${
                  lang === "en"
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-white/10 bg-zinc-900/50 grid place-items-center">
              <Scale className="h-5 w-5 text-amber-300" />
            </div>
            <div className="leading-tight">
              <div className="text-sm sm:text-base font-bold">{t.brand}</div>
              <div className="text-[11px] text-zinc-400">{t.portalEn}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm text-zinc-300">
            <Link className="hover:text-white transition" href="/library">
              {lang === "ar" ? "المكتبة" : "Library"}
            </Link>
            <Link className="hover:text-white transition" href="/contracts">
              {lang === "ar" ? "العقود" : "Contracts"}
            </Link>
            <Link className="hover:text-white transition" href="/translate">
              {lang === "ar" ? "الترجمة" : "Translation"}
            </Link>
            <Link className="hover:text-white transition" href="/consultations">
              {lang === "ar" ? "الاستشارات" : "Consultations"}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-2 text-sm font-semibold hover:bg-zinc-900 transition"
            >
              {t.heroTertiary}
            </Link>
            <Link
              href="/register-smart"
              className="inline-flex rounded-xl bg-amber-400 text-zinc-900 px-4 py-2 text-sm font-bold hover:bg-amber-300 transition"
            >
              {t.heroSecondary}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO (Official Portal style) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-8 md:pt-16 md:pb-12">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-300">
                <BadgeCheck className="h-4 w-4 text-amber-300" />
                <span>{t.topNote}</span>
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-extrabold leading-[1.2]">
                {t.heroTitle}
              </h1>

              <p className="mt-4 text-sm sm:text-base md:text-lg text-zinc-300 leading-7">
                {t.heroSubtitle}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/library"
                  className="inline-flex items-center justify-center rounded-xl bg-amber-400 text-zinc-900 px-5 py-3 text-sm font-bold hover:bg-amber-300 transition"
                >
                  {t.heroPrimary}
                  <ChevronLeft className="ms-2 h-4 w-4" />
                </Link>

                <Link
                  href="/register-smart"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-900/40 px-5 py-3 text-sm font-semibold text-zinc-100 hover:bg-zinc-900 transition"
                >
                  {t.heroSecondary}
                  <ChevronLeft className="ms-2 h-4 w-4" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/5 transition"
                >
                  {t.heroTertiary}
                  <ArrowLeft className="ms-2 h-4 w-4" />
                </Link>
              </div>

              {/* Official Trust strip */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                <TrustPill text={t.trust[0].title} icon={<ShieldCheck className="h-4 w-4" />} />
                <TrustPill text={t.trust[1].title} icon={<BadgeCheck className="h-4 w-4" />} />
                <TrustPill text={t.trust[2].title} icon={<Sparkles className="h-4 w-4" />} />
              </div>
            </div>

            {/* Right card: Official quick guide */}
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-5">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3">
                <div className="text-sm font-bold">{t.quickActionsTitle}</div>
                <div className="text-xs text-zinc-400">Portal</div>
              </div>

              <p className="mt-4 text-sm text-zinc-300 leading-7">
                {t.quickActionsHint}
              </p>

              <div className="mt-4 grid gap-3">
                {services.slice(0, 3).map((s) => (
                  <QuickRow key={s.title} title={s.title} desc={s.desc} Icon={s.icon} href={s.href} />
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/50 p-4">
                <div className="text-xs text-zinc-400">
                  {lang === "ar" ? "مثال استخدام:" : "Example:"}
                </div>
                <div className="mt-2 text-sm leading-7 text-zinc-200">
                  {lang === "ar"
                    ? "تصفح مادة قانونية → اقرأ PDF الأصلي → اطلب شرحًا مبسطًا/عمليًا/مهنيًا عند الحاجة."
                    : "Browse a legal unit → open the original PDF → request a simplified/practical/pro explanation when needed."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES DIRECTORY */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className={lang === "ar" ? "text-right" : "text-left"}>
          <h2 className="text-xl md:text-2xl font-extrabold">{t.servicesTitle}</h2>
          <p className="mt-2 text-sm md:text-base text-zinc-300">{t.servicesSubtitle}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard
              key={s.title}
              title={s.title}
              desc={s.desc}
              href={s.href}
              Icon={s.icon}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* TRUST / RELIABILITY */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className={lang === "ar" ? "text-right" : "text-left"}>
          <h2 className="text-xl md:text-2xl font-extrabold">{t.trustTitle}</h2>
          <p className="mt-2 text-sm md:text-base text-zinc-300">{t.trustSubtitle}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {t.trust.map((x: any) => (
            <InfoCard key={x.title} title={x.title} desc={x.desc} />
          ))}
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className={lang === "ar" ? "text-right" : "text-left"}>
          <h2 className="text-xl md:text-2xl font-extrabold">{t.audiencesTitle}</h2>
          <p className="mt-2 text-sm md:text-base text-zinc-300">{t.audiencesSubtitle}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {t.audience.map((a: any) => (
            <AudienceCard key={a.title} title={a.title} points={a.points} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-zinc-950/80">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-amber-300" />
            <span>
              © {new Date().getFullYear()} {t.brand} — {t.footer.rights}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="hover:text-zinc-200 transition" href="/about">
              {t.footer.about}
            </Link>
            <span className="opacity-30">•</span>
            <Link className="hover:text-zinc-200 transition" href="/privacy">
              {t.footer.privacy}
            </Link>
            <span className="opacity-30">•</span>
            <Link className="hover:text-zinc-200 transition" href="/terms">
              {t.footer.terms}
            </Link>
            <span className="opacity-30">•</span>
            <Link className="hover:text-zinc-200 transition" href="/disclaimer">
              {t.footer.disclaimer}
            </Link>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA (Library first) */}
      <div className="md:hidden fixed bottom-3 left-0 right-0 z-50 px-4">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur p-2 shadow-lg">
          <div className="flex gap-2">
            <Link
              href="/library"
              className="flex-1 inline-flex items-center justify-center rounded-xl bg-amber-400 text-zinc-900 py-3 text-sm font-extrabold"
            >
              <BookOpen className="me-2 h-5 w-5" />
              {t.mobileCta}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm font-semibold text-zinc-100"
            >
              {lang === "ar" ? "دخول" : "Sign In"}
            </Link>
          </div>
        </div>
      </div>

      {/* spacing for mobile sticky */}
      <div className="md:hidden h-20" />
    </main>
  );
}

/* =======================
   UI Components
======================= */

function TrustPill({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-200">
      <span className="text-amber-300">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function QuickRow({
  title,
  desc,
  Icon,
  href,
}: {
  title: string;
  desc: string;
  Icon: React.ElementType;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-zinc-950/50 p-4 hover:bg-zinc-950/70 transition"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-white/10 bg-zinc-900/40 p-2">
          <Icon className="h-5 w-5 text-amber-300" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-zinc-100">{title}</div>
          <div className="mt-1 text-xs leading-6 text-zinc-400">{desc}</div>
        </div>
        <ChevronLeft className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 mt-2" />
      </div>
    </Link>
  );
}

function ServiceCard({
  title,
  desc,
  href,
  Icon,
  lang,
}: {
  title: string;
  desc: string;
  href: string;
  Icon: React.ElementType;
  lang: Lang;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/10 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-2">
          <Icon className="h-5 w-5 text-amber-300" />
        </div>
        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition">
          {lang === "ar" ? "استكشف" : "Explore"}
        </span>
      </div>

      <div className="mt-3 text-base font-extrabold">{title}</div>
      <div className="mt-2 text-sm leading-7 text-zinc-300">{desc}</div>

      <div className="mt-4 inline-flex items-center text-sm font-bold text-amber-200">
        {lang === "ar" ? "الدخول للخدمة" : "Open service"}
        <ChevronLeft className="ms-2 h-4 w-4" />
      </div>
    </Link>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-5">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-amber-300" />
        <div className="text-sm font-extrabold">{title}</div>
      </div>
      <div className="mt-2 text-sm leading-7 text-zinc-300">{desc}</div>
    </div>
  );
}

function AudienceCard({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-5">
      <div className="text-sm font-extrabold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-zinc-300">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-300" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

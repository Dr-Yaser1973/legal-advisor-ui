// app/(site)/contracts/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { listTemplates } from "@/lib/contracts/catalog";
import { enabledJurisdictions, getJurisdiction } from "@/lib/contracts/jurisdictions";
import type { JurisdictionCode } from "@/lib/contracts/engine/types";
import { getLocale } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/config";
import QuickSearch from "./_components/QuickSearch";

type Props = { searchParams?: Promise<{ lang?: string; jur?: string }> };

export const metadata: Metadata = {
  title: "منصة العقود المعتمدة | نماذج عقود موثوقة وفق التشريعات العربية والدولية",
  description:
    "مكتبة عقود قانونية جاهزة للتعبئة مصاغة وفق القوانين المدنية والتجارية في العراق ومصر والإمارات والأردن + عقود التجارة الدولية (Incoterms). بالعربية والإنجليزية مع معاينة فورية وتنزيل PDF.",
  alternates: { canonical: "/contracts" },
  openGraph: {
    title: "منصة العقود المعتمدة — نماذج عقود موثوقة",
    description:
      "اختر الاختصاص القضائي وابدأ: عقود عراقية ومصرية وإماراتية وأردنية ودولية، بالعربية والإنجليزية.",
    url: "https://smartlegaladvisor.com/contracts",
  },
};

// نسبة كل اختصاص (للعناوين) + لون مميّز للبطاقة
const JUR_UI: Record<string, { adjAr: string; adjEn: string; accent: string }> = {
  IQ: { adjAr: "العراقية", adjEn: "Iraqi", accent: "emerald" },
  EG: { adjAr: "المصرية", adjEn: "Egyptian", accent: "rose" },
  AE: { adjAr: "الإماراتية", adjEn: "Emirati", accent: "amber" },
  JO: { adjAr: "الأردنية", adjEn: "Jordanian", accent: "violet" },
  SA: { adjAr: "السعودية", adjEn: "Saudi", accent: "teal" },
  KW: { adjAr: "الكويتية", adjEn: "Kuwaiti", accent: "indigo" },
};

const ACCENT: Record<
  string,
  { tile: string; cta: string; hover: string; bar: string }
> = {
  emerald: { tile: "bg-emerald-500/10 text-emerald-300", cta: "text-emerald-300", hover: "hover:border-emerald-400/40", bar: "bg-emerald-500/10" },
  rose: { tile: "bg-rose-500/10 text-rose-300", cta: "text-rose-300", hover: "hover:border-rose-400/40", bar: "bg-rose-500/10" },
  amber: { tile: "bg-amber-500/10 text-amber-300", cta: "text-amber-300", hover: "hover:border-amber-400/40", bar: "bg-amber-500/10" },
  violet: { tile: "bg-violet-500/10 text-violet-300", cta: "text-violet-300", hover: "hover:border-violet-400/40", bar: "bg-violet-500/10" },
  teal: { tile: "bg-teal-500/10 text-teal-300", cta: "text-teal-300", hover: "hover:border-teal-400/40", bar: "bg-teal-500/10" },
  indigo: { tile: "bg-indigo-500/10 text-indigo-300", cta: "text-indigo-300", hover: "hover:border-indigo-400/40", bar: "bg-indigo-500/10" },
  sky: { tile: "bg-sky-500/10 text-sky-300", cta: "text-sky-300", hover: "hover:border-sky-400/40", bar: "bg-sky-500/10" },
};

const T = {
  ar: {
    badge: "مكتبة قانونية متخصصة ومحدثة 2026",
    heroTitle: "نماذج وعقود قانونية موثوقة وفق التشريعات العربية والدولية",
    heroSub:
      "احصل على عقود مصاغة بدقة عالية وجاهزة للاستخدام والتعديل المباشر، مصممة وفق أحكام القوانين المدنية والتجارية، بالعربية والإنجليزية.",
    searchPlaceholder:
      "ابحث عن نوع العقد (مثال: عقد بيع، عقد إيجار مصري، عقد عمل إماراتي…)",
    searchBtn: "بحث سريع",
    searchEmpty: "لا توجد نتائج مطابقة.",
    browseBtn: "استعراض النماذج الجاهزة",
    sectionTitle: "مكتبة العقود المعتمدة حسب الاختصاص القضائي",
    sectionSub: "اختر الاختصاص أو الدولة لعرض النماذج والصيغ المتاحة للتحميل والتعبئة.",
    modelsWord: "نموذج عقد",
    browsePrefix: "استعراض العقود",
    intlTitle: "عقود التجارة الدولية",
    intlDesc: "مصاغة وفق قواعد غرفة التجارة الدولية (Incoterms® 2020) واتفاقية البيع الدولي (CISG).",
    intlBrowse: "استعراض العقود الدولية",
    intlBullets: ["عقود البيع الدولي بشروط التسليم من EXW حتى DDP", "صياغة ثنائية اللغة جاهزة للتوقيع"],
    bullets: ["العقود المدنية والتجارية: بيع، إيجار، عمل، مقاولة، شراكة، وكالة", "عقود الخدمات: استشارة، تطوير برمجي، ترخيص وغيرها"],
    back: "← كل الاختصاصات",
    chooseModel: "اختر النموذج",
    history: "سجلّ عقودي ↗",
    note: "ملاحظة: النماذج إرشادية للاستخدام العام. للحالات الخاصة يُنصح بمراجعة مختصّ قبل التوقيع.",
    footer: "جميع الحقوق محفوظة © 2026 منصة المستشار القانوني للعقود — النماذج للاستخدام المباشر والتعديل.",
    modelCount: (n: number) => `${n} نموذجاً`,
  },
  en: {
    badge: "Specialized legal library — updated 2026",
    heroTitle: "Trusted legal contract templates under Arab & international law",
    heroSub:
      "Get precisely drafted, ready-to-use and editable contracts, built under civil and commercial law, in Arabic and English.",
    searchPlaceholder:
      "Search a contract type (e.g. sale, Egyptian lease, UAE employment…)",
    searchBtn: "Quick search",
    searchEmpty: "No matching results.",
    browseBtn: "Browse ready templates",
    sectionTitle: "Approved contracts library by jurisdiction",
    sectionSub: "Choose a jurisdiction or country to view the available templates for download and completion.",
    modelsWord: "contract template",
    browsePrefix: "Browse",
    intlTitle: "International trade contracts",
    intlDesc: "Drafted under the ICC rules (Incoterms® 2020) and the international sale convention (CISG).",
    intlBrowse: "Browse international contracts",
    intlBullets: ["International sale contracts, delivery terms EXW to DDP", "Bilingual drafting ready to sign"],
    bullets: ["Civil & commercial: sale, lease, employment, construction, partnership, agency", "Service contracts: consultancy, software development, licensing, and more"],
    back: "← All jurisdictions",
    chooseModel: "Choose a template",
    history: "My contracts ↗",
    note: "Note: These templates are for general guidance. For special cases, consult a specialist before signing.",
    footer: "All rights reserved © 2026 Legal Advisor Contracts Platform — templates for direct use and editing.",
    modelCount: (n: number) => `${n} templates`,
  },
} as const;

export default async function ContractsHomePage({ searchParams }: Props) {
  const params = await searchParams;
  const locale = params?.lang ? resolveLocale(params.lang) : await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = T[locale];
  const langQS = params?.lang ? `?lang=${encodeURIComponent(params.lang)}` : "";
  const langAmp = params?.lang ? `&lang=${encodeURIComponent(params.lang)}` : "";

  const jurisdictions = enabledJurisdictions();
  const validCodes = [...jurisdictions.map((j) => j.code), "INTL"];
  const activeJur = params?.jur && validCodes.includes(params.jur) ? params.jur : null;

  const templates = listTemplates();
  const searchItems = templates.map((x) => ({
    slug: x.slug,
    title: x.title,
    lang: x.lang.toUpperCase(),
    jurisdiction: x.jurisdiction,
  }));

  const proCount = (code: string) =>
    templates.filter((x) => x.group === "PRO" && x.jurisdiction === code && x.lang === "ar").length;
  const incoCount = templates.filter((x) => x.group === "INCOTERMS" && x.lang === "ar").length;

  // ── العرض التفصيلي لاختصاص مختار ──
  if (activeJur) {
    const isIntl = activeJur === "INTL";
    const list = isIntl
      ? templates.filter((x) => x.group === "INCOTERMS")
      : templates.filter((x) => x.group === "PRO" && x.jurisdiction === (activeJur as JurisdictionCode));
    const j = isIntl ? null : getJurisdiction(activeJur as JurisdictionCode);
    const ui = isIntl ? { accent: "sky" } : JUR_UI[activeJur] ?? { accent: "sky" };
    const acc = ACCENT[ui.accent] ?? ACCENT.sky;
    const heading = isIntl
      ? `🌐 ${t.intlTitle}`
      : `${j!.flag} ${locale === "ar" ? "العقود " + JUR_UI[activeJur].adjAr : JUR_UI[activeJur].adjEn + " contracts"}`;

    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-zinc-100" dir={dir}>
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/contracts${langQS}`} className="text-sm text-zinc-400 hover:text-zinc-200">
            {t.back}
          </Link>
          <Link className="text-sm text-emerald-300 hover:underline" href={`/contracts/history${langQS}`}>
            {t.history}
          </Link>
        </div>

        <h1 className="mb-1 text-2xl font-bold">{heading}</h1>
        {!isIntl && <p className="mb-6 text-sm text-zinc-400">{locale === "ar" ? j!.governingLawAr : j!.governingLawEn}</p>}
        {isIntl && <p className="mb-6 text-sm text-zinc-400">{t.intlDesc}</p>}

        <h2 className="mb-3 text-sm font-semibold text-zinc-300">{t.chooseModel}</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {list.map((x) => (
            <Link
              key={x.slug}
              href={`/contracts/${x.slug}${langQS}`}
              className={`rounded-xl border border-zinc-700 bg-zinc-900 p-4 transition hover:-translate-y-0.5 hover:bg-zinc-800 ${acc.hover}`}
            >
              <div className="text-xs text-zinc-500">{x.lang.toUpperCase()}</div>
              <div className="mt-1 font-semibold leading-6">{x.title}</div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-[11px] text-zinc-500 leading-6">{t.note}</p>
      </div>
    );
  }

  // ── الصفحة الرئيسية (الهيرو + البطاقات) ──
  const cards = jurisdictions.map((j) => {
    const ui = JUR_UI[j.code] ?? { adjAr: j.nameAr, adjEn: j.nameEn, accent: "sky" };
    return {
      code: j.code,
      flag: j.flag,
      titleAr: `عقود اعتيادية ${ui.adjAr}`,
      titleEn: `${ui.adjEn} standard contracts`,
      desc: locale === "ar" ? j.governingLawAr : j.governingLawEn,
      count: proCount(j.code),
      accent: ui.accent,
      browseAr: `${t.browsePrefix} ${ui.adjAr}`,
      browseEn: `${T.en.browsePrefix} ${ui.adjEn}`,
    };
  });

  return (
    <div className="text-zinc-100" dir={dir}>
      {/* الهيرو */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-center sm:px-10">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold text-amber-300">
            {t.badge}
          </span>
          <h1 className="mt-5 text-2xl font-extrabold leading-snug sm:text-4xl">{t.heroTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400">{t.heroSub}</p>
          <div className="mt-8">
            <QuickSearch
              items={searchItems}
              placeholder={t.searchPlaceholder}
              buttonLabel={t.searchBtn}
              emptyLabel={t.searchEmpty}
              langQS={langQS}
            />
          </div>
        </div>
      </section>

      {/* البطاقات حسب الاختصاص */}
      <section className="mx-auto max-w-6xl px-1 py-10">
        <div className="mb-1 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xl font-bold">{t.sectionTitle}</h2>
          <Link className="text-sm text-emerald-300 hover:underline" href={`/contracts/history${langQS}`}>
            {t.history}
          </Link>
        </div>
        <p className="mb-6 text-sm text-zinc-400">{t.sectionSub}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const acc = ACCENT[c.accent] ?? ACCENT.sky;
            return (
              <Link
                key={c.code}
                href={`/contracts?jur=${c.code}${langAmp}`}
                className={`group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.05] ${acc.hover}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${acc.tile}`}>⚖️</div>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs">{c.flag}</span>
                </div>
                <div className="mt-4 text-base font-bold">{locale === "ar" ? c.titleAr : c.titleEn}</div>
                <p className="mt-1 text-xs leading-5 text-zinc-400">{c.desc}</p>
                <ul className="mt-3 space-y-1.5 text-[11px] leading-5 text-zinc-400">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex gap-1.5"><span className={acc.cta}>•</span><span>{b}</span></li>
                  ))}
                </ul>
                <div className="mt-auto pt-4">
                  <div className={`rounded-lg ${acc.bar} px-3 py-2 text-center text-sm font-semibold ${acc.cta}`}>
                    {(locale === "ar" ? c.browseAr : c.browseEn)} ← <span className="text-zinc-400">({t.modelCount(c.count)})</span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* بطاقة التجارة الدولية */}
          <Link
            href={`/contracts?jur=INTL${langAmp}`}
            className={`group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.05] ${ACCENT.sky.hover}`}
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${ACCENT.sky.tile}`}>🌐</div>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs">Incoterms®</span>
            </div>
            <div className="mt-4 text-base font-bold">{t.intlTitle}</div>
            <p className="mt-1 text-xs leading-5 text-zinc-400">{t.intlDesc}</p>
            <ul className="mt-3 space-y-1.5 text-[11px] leading-5 text-zinc-400">
              {t.intlBullets.map((b) => (
                <li key={b} className="flex gap-1.5"><span className={ACCENT.sky.cta}>•</span><span>{b}</span></li>
              ))}
            </ul>
            <div className="mt-auto pt-4">
              <div className={`rounded-lg ${ACCENT.sky.bar} px-3 py-2 text-center text-sm font-semibold ${ACCENT.sky.cta}`}>
                {t.intlBrowse} ← <span className="text-zinc-400">({t.modelCount(incoCount)})</span>
              </div>
            </div>
          </Link>
        </div>

        <p className="mt-8 text-[11px] leading-6 text-zinc-500">{t.note}</p>
      </section>

      {/* التذييل */}
      <footer className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 px-6 py-6 text-center text-[11px] text-zinc-500">
        {t.footer}
      </footer>
    </div>
  );
}

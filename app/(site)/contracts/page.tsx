// app/(site)/contracts/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { listTemplates } from "@/lib/contracts/catalog";
import {
  enabledJurisdictions,
  getJurisdiction,
  DEFAULT_JURISDICTION,
} from "@/lib/contracts/jurisdictions";
import type { JurisdictionCode } from "@/lib/contracts/engine/types";
import { getLocale } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/config";

type Props = { searchParams?: Promise<{ lang?: string; jur?: string }> };

export const metadata: Metadata = {
  title: "نماذج عقود احترافية جاهزة بالعربية والإنجليزية | عقود عراقية ومصرية",
  description:
    "عقود احترافية جاهزة للتعبئة مصاغة وفق القانون العراقي والقانون المصري (بيع، إيجار، عمل، شراكة، توزيع، توريد، عدم إفشاء، إنشاءات) + ١١ عقد Incoterms للتجارة الدولية. بالعربية والإنجليزية، مع معاينة فورية وتنزيل PDF.",
  keywords: [
    "نموذج عقد",
    "صياغة عقود",
    "عقود مصرية",
    "عقود عراقية",
    "عقد عمل مصري",
    "عقد إيجار مصري",
    "عقد بيع",
    "عقود Incoterms",
    "نماذج عقود بالعربية",
    "عقد احترافي جاهز",
  ],
  alternates: { canonical: "/contracts" },
  openGraph: {
    title: "نماذج عقود احترافية جاهزة | عراقية ومصرية بالعربية والإنجليزية",
    description:
      "املأ نموذج العقد في دقائق، عاينه فوراً، ونزّله PDF — مصاغ وفق القانون العراقي أو المصري.",
    url: "https://smartlegaladvisor.com/contracts",
  },
};

const T = {
  ar: {
    heroTitle: "نماذج عقود احترافية جاهزة — بالعربية والإنجليزية",
    valChoose: "اختر نموذج العقد",
    valHistory: "سجلّ عقودي ↗",
    proTitle: "عقود احترافية (PRO)",
    incoTitle: "عقود التجارة الدولية — Incoterms (١١)",
    jurLabel: "اختر الاختصاص القانوني:",
    emptyPro: "لا توجد عقود لهذا الاختصاص بعد — قريباً.",
    note: "ملاحظة: النماذج إرشادية للاستخدام العام. للحالات الخاصة يُنصح بمراجعة مختصّ قبل التوقيع.",
    valBilingual: { t: "ثنائي اللغة", d: "كل عقد بالعربية والإنجليزية" },
    valPreview: { t: "معاينة فورية مجانية", d: "شاهد عقدك يتشكّل وأنت تملأ" },
    valPdf: { t: "تنزيل PDF", d: "جاهز للطباعة والتوقيع (بالاشتراك)" },
    valLawTitle: "وفق قانون الدولة",
  },
  en: {
    heroTitle: "Ready-to-Use Professional Contract Templates — Arabic & English",
    valChoose: "Choose a contract template",
    valHistory: "My contracts ↗",
    proTitle: "Professional contracts (PRO)",
    incoTitle: "International trade contracts — Incoterms (11)",
    jurLabel: "Choose jurisdiction:",
    emptyPro: "No contracts for this jurisdiction yet — coming soon.",
    note: "Note: These templates are for general guidance. For special cases, consult a specialist before signing.",
    valBilingual: { t: "Bilingual", d: "Every contract in Arabic and English" },
    valPreview: { t: "Free instant preview", d: "Watch your contract take shape as you fill" },
    valPdf: { t: "PDF download", d: "Ready to print and sign (with subscription)" },
    valLawTitle: "Compliant with local law",
  },
} as const;

export default async function ContractsHomePage({ searchParams }: Props) {
  const params = await searchParams;
  const locale = params?.lang ? resolveLocale(params.lang) : await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = T[locale];

  // الاختصاص المختار (افتراضياً العراق)
  const jurisdictions = enabledJurisdictions();
  const validCodes = jurisdictions.map((j) => j.code);
  const activeJur: JurisdictionCode =
    params?.jur && validCodes.includes(params.jur as JurisdictionCode)
      ? (params.jur as JurisdictionCode)
      : DEFAULT_JURISDICTION;
  const active = getJurisdiction(activeJur);

  const templates = listTemplates();
  const pro = templates.filter(
    (x) => x.group === "PRO" && x.jurisdiction === activeJur
  );
  const inco = templates.filter((x) => x.group === "INCOTERMS"); // دولية — تظهر دائماً

  const lawText = locale === "ar" ? active.governingLawAr : active.governingLawEn;
  const jurName = locale === "ar" ? active.nameAr : active.nameEn;

  // للحفاظ على lang في روابط التبويبات
  const langQS = params?.lang ? `&lang=${encodeURIComponent(params.lang)}` : "";

  const values = [
    t.valBilingual,
    { t: t.valLawTitle, d: lawText },
    t.valPreview,
    t.valPdf,
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-zinc-100" dir={dir}>
      {/* الهيرو */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">{t.heroTitle}</h1>
        <p className="text-sm text-zinc-400 leading-7 max-w-3xl">
          {locale === "ar" ? (
            <>
              عقود مصاغة بعناية وفق{" "}
              <strong className="text-zinc-200">{lawText}</strong> — تملأها بنموذج بسيط،
              تعاينها فوراً على الشاشة، ثم تنزّلها ملف PDF جاهزاً للتوقيع. اختر الاختصاص
              القانوني ثم النموذج المناسب.
            </>
          ) : (
            <>
              Contracts carefully drafted under the{" "}
              <strong className="text-zinc-200">{lawText}</strong> — fill in a simple form,
              preview them instantly, then download a signable PDF. Pick a jurisdiction, then
              the template you need.
            </>
          )}
        </p>
      </div>

      {/* تبويبات الاختصاص */}
      <div className="mb-6">
        <div className="mb-2 text-xs font-semibold text-zinc-400">{t.jurLabel}</div>
        <div className="flex flex-wrap gap-2">
          {jurisdictions.map((j) => {
            const isActive = j.code === activeJur;
            const label = locale === "ar" ? j.nameAr : j.nameEn;
            return (
              <Link
                key={j.code}
                href={`/contracts?jur=${j.code}${langQS}`}
                className={
                  "rounded-full border px-4 py-1.5 text-sm transition " +
                  (isActive
                    ? "border-amber-400 bg-amber-400/10 text-amber-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-amber-400/40")
                }
              >
                <span className="ml-1">{j.flag}</span> {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* شريط القيمة */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((c) => (
          <div key={c.t} className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
            <div className="text-sm font-semibold text-amber-300">{c.t}</div>
            <div className="mt-1 text-xs text-zinc-400 leading-6">{c.d}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t.valChoose}</h2>
        <Link className="text-sm text-emerald-300 hover:underline" href="/contracts/history">
          {t.valHistory}
        </Link>
      </div>

      {/* عقود احترافية حسب الاختصاص */}
      <h3 className="mb-3 text-sm font-bold text-amber-400">
        {t.proTitle} — {active.flag} {jurName}
      </h3>
      {pro.length === 0 ? (
        <p className="text-sm text-zinc-500">{t.emptyPro}</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {pro.map((x) => (
            <Link
              key={x.slug}
              href={`/contracts/${x.slug}`}
              className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-800"
            >
              <div className="text-xs text-zinc-500">{x.lang.toUpperCase()}</div>
              <div className="mt-1 font-semibold">{x.title}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Incoterms — دولية */}
      <h3 className="mt-8 mb-3 text-sm font-bold text-amber-400">{t.incoTitle}</h3>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {inco.map((x) => (
          <Link
            key={x.slug}
            href={`/contracts/${x.slug}`}
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-800"
          >
            <div className="text-xs text-zinc-500">{x.lang.toUpperCase()}</div>
            <div className="mt-1 font-semibold">{x.title}</div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-[11px] text-zinc-500 leading-6">{t.note}</p>
    </div>
  );
}

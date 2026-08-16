// app/(site)/contracts/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { listTemplates } from "@/lib/contracts/catalog";
import { getLocale } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/config";

type Props = { searchParams?: Promise<{ lang?: string }> };

export const metadata: Metadata = {
  title: "نماذج عقود احترافية جاهزة بالعربية والإنجليزية | صياغة عقود",
  description:
    "عقود احترافية جاهزة للتعبئة (بيع، خدمات، إيجار، عمل، شراكة، توزيع، توريد، عدم إفشاء، إنشاءات) + ١١ عقد Incoterms للتجارة الدولية. مصاغة وفق القانون العراقي، بالعربية والإنجليزية، مع معاينة فورية وتنزيل PDF.",
  keywords: [
    "نموذج عقد",
    "صياغة عقود",
    "عقد عمل",
    "عقد إيجار",
    "عقد بيع",
    "عقد شراكة",
    "عقد عدم إفشاء NDA",
    "عقود Incoterms",
    "نماذج عقود بالعربية",
    "عقد احترافي جاهز",
  ],
  alternates: { canonical: "/contracts" },
  openGraph: {
    title: "نماذج عقود احترافية جاهزة | صياغة عقود بالعربية والإنجليزية",
    description:
      "املأ نموذج العقد في دقائق، عاينه فوراً، ونزّله PDF — مصاغ وفق القانون العراقي.",
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
    note: "ملاحظة: النماذج إرشادية للاستخدام العام. للحالات الخاصة يُنصح بمراجعة مختصّ قبل التوقيع.",
    values: [
      { t: "ثنائي اللغة", d: "كل عقد بالعربية والإنجليزية" },
      { t: "وفق القانون العراقي", d: "بنود القانون المدني رقم ٤٠ لسنة ١٩٥١" },
      { t: "معاينة فورية مجانية", d: "شاهد عقدك يتشكّل وأنت تملأ" },
      { t: "تنزيل PDF", d: "جاهز للطباعة والتوقيع (بالاشتراك)" },
    ] as { t: string; d: string }[],
  },
  en: {
    heroTitle: "Ready-to-Use Professional Contract Templates — Arabic & English",
    valChoose: "Choose a contract template",
    valHistory: "My contracts ↗",
    proTitle: "Professional contracts (PRO)",
    incoTitle: "International trade contracts — Incoterms (11)",
    note: "Note: These templates are for general guidance. For special cases, consult a specialist before signing.",
    values: [
      { t: "Bilingual", d: "Every contract in Arabic and English" },
      { t: "Iraqi law compliant", d: "Provisions of Civil Code No. 40 of 1951" },
      { t: "Free instant preview", d: "Watch your contract take shape as you fill" },
      { t: "PDF download", d: "Ready to print and sign (with subscription)" },
    ] as { t: string; d: string }[],
  },
} as const;

export default async function ContractsHomePage({ searchParams }: Props) {
  const params = await searchParams;
  const locale = params?.lang ? resolveLocale(params.lang) : await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = T[locale];

  const templates = listTemplates();
  const pro = templates.filter((x) => x.group === "PRO");
  const inco = templates.filter((x) => x.group === "INCOTERMS");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-zinc-100" dir={dir}>
      {/* الهيرو */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{t.heroTitle}</h1>
        <p className="text-sm text-zinc-400 leading-7 max-w-3xl">
          {locale === "ar" ? (
            <>
              عقود مصاغة بعناية وفق{" "}
              <strong className="text-zinc-200">القانون المدني العراقي</strong>، تملأها بنموذج
              بسيط، تعاينها فوراً على الشاشة، ثم تنزّلها ملف PDF جاهزاً للتوقيع. ٩ عقود احترافية +
              ١١ عقد <strong className="text-zinc-200">Incoterms</strong> للتجارة الدولية.
            </>
          ) : (
            <>
              Contracts carefully drafted under the{" "}
              <strong className="text-zinc-200">Iraqi Civil Code</strong> — fill in a simple form,
              preview them instantly on screen, then download a signable PDF. 9 professional
              contracts + 11 <strong className="text-zinc-200">Incoterms</strong> contracts for
              international trade.
            </>
          )}
        </p>
      </div>

      {/* شريط القيمة */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {t.values.map((c) => (
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

      {/* عقود احترافية */}
      <h3 className="mb-3 text-sm font-bold text-amber-400">{t.proTitle}</h3>
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

      {/* Incoterms */}
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

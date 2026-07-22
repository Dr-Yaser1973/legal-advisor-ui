// app/(site)/contracts/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { listTemplates } from "@/lib/contracts/catalog";

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

export default async function ContractsHomePage() {
  const templates = listTemplates();
  const pro = templates.filter((t) => t.group === "PRO");
  const inco = templates.filter((t) => t.group === "INCOTERMS");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-zinc-100" dir="rtl">
      {/* الهيرو */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">
          نماذج عقود احترافية جاهزة — بالعربية والإنجليزية
        </h1>
        <p className="text-sm text-zinc-400 leading-7 max-w-3xl">
          عقود مصاغة بعناية وفق <strong className="text-zinc-200">القانون المدني العراقي</strong>،
          تملأها بنموذج بسيط، تعاينها فوراً على الشاشة، ثم تنزّلها ملف PDF جاهزاً للتوقيع.
          ٩ عقود احترافية + ١١ عقد <strong className="text-zinc-200">Incoterms</strong> للتجارة الدولية.
        </p>
      </div>

      {/* شريط القيمة */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { t: "ثنائي اللغة", d: "كل عقد بالعربية والإنجليزية" },
          { t: "وفق القانون العراقي", d: "بنود القانون المدني رقم ٤٠ لسنة ١٩٥١" },
          { t: "معاينة فورية مجانية", d: "شاهد عقدك يتشكّل وأنت تملأ" },
          { t: "تنزيل PDF", d: "جاهز للطباعة والتوقيع (بالاشتراك)" },
        ].map((c) => (
          <div key={c.t} className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
            <div className="text-sm font-semibold text-amber-300">{c.t}</div>
            <div className="mt-1 text-xs text-zinc-400 leading-6">{c.d}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">اختر نموذج العقد</h2>
        <Link className="text-sm text-emerald-300 hover:underline" href="/contracts/history">
          سجلّ عقودي ↗
        </Link>
      </div>

      {/* عقود احترافية */}
      <h3 className="mb-3 text-sm font-bold text-amber-400">عقود احترافية (PRO)</h3>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {pro.map((t) => (
          <Link
            key={t.slug}
            href={`/contracts/${t.slug}`}
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-800"
          >
            <div className="text-xs text-zinc-500">{t.lang.toUpperCase()}</div>
            <div className="mt-1 font-semibold">{t.title}</div>
          </Link>
        ))}
      </div>

      {/* Incoterms */}
      <h3 className="mt-8 mb-3 text-sm font-bold text-amber-400">
        عقود التجارة الدولية — Incoterms (١١)
      </h3>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {inco.map((t) => (
          <Link
            key={t.slug}
            href={`/contracts/${t.slug}`}
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-800"
          >
            <div className="text-xs text-zinc-500">{t.lang.toUpperCase()}</div>
            <div className="mt-1 font-semibold">{t.title}</div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-[11px] text-zinc-500 leading-6">
        ملاحظة: النماذج إرشادية للاستخدام العام. للحالات الخاصة يُنصح بمراجعة مختصّ قبل التوقيع.
      </p>
    </div>
  );
}

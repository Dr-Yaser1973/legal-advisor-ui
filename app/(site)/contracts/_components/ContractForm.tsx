 //app/(site)/contracts/_components/ContractForm.tsx
 "use client";

import { useEffect, useMemo, useState } from "react";
import PreviewPane from "./PreviewPane";

type Field = {
  key: string;
  label: string;
  required?: boolean;
  type?: "text" | "textarea" | "date" | "number" | "select";
  group?: string;
  options?: string[];
  placeholder?: string;
  hint?: string;
};

type TemplateResp = {
  ok: boolean;
  template: {
    slug: string;
    title: string;
    lang: "ar" | "en";
    group: "PRO" | "INCOTERMS";
    body: string;
    fields: Field[];
  };
};

export default function ContractForm({ templateSlug }: { templateSlug: string }) {
  const [tpl, setTpl] = useState<TemplateResp["template"] | null>(null);
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: number; pdfUrl: string } | null>(null);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [upgrade, setUpgrade] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/contracts/templates/${templateSlug}`);
      const j = (await r.json()) as TemplateResp;
      setTpl(j.template);
      setData({});
      setError("");
      setResult(null);
      setTouched({});
    })();
  }, [templateSlug]);

  const isRTL = tpl?.lang === "ar";

  // تجميع الحقول حسب group
  const groupedFields = useMemo(() => {
    const fields = tpl?.fields ?? [];
    const groups: Record<string, Field[]> = {};
    for (const f of fields) {
      const g = f.group || "الحقول";
      if (!groups[g]) groups[g] = [];
      groups[g].push(f);
    }
    return groups;
  }, [tpl]);

  // الحقول المطلوبة الناقصة
  const missingRequired = useMemo(() => {
    const fields = tpl?.fields ?? [];
    return fields.filter((f) => f.required && !data[f.key]?.trim());
  }, [tpl, data]);

  function updateField(k: string, v: string) {
    setData((p) => ({ ...p, [k]: v }));
  }

  async function generate() {
    // تحقق من الحقول المطلوبة
    if (missingRequired.length > 0) {
      setTouched(Object.fromEntries(missingRequired.map((f) => [f.key, true])));
      setError(
        isRTL
          ? `يرجى ملء الحقول المطلوبة (${missingRequired.length})`
          : `Please fill required fields (${missingRequired.length})`
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setUpgrade(false);
    try {
      const r = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: templateSlug, lang: tpl?.lang ?? "ar", data }),
      });
      const j = await r.json();
      if (!r.ok) {
        // FREE: المعاينة مجانية، وتنزيل PDF يتطلّب اشتراكاً → بطاقة ترقية ودّية
        if (j?.upgradeRequired) {
          setUpgrade(true);
          return;
        }
        throw new Error(j?.error || "Failed");
      }
      setResult({ id: j.id, pdfUrl: j.pdfUrl });
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  if (!tpl) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-amber-400" />
      </div>
    );
  }

  const filledCount = (tpl.fields ?? []).filter((f) => data[f.key]?.trim()).length;
  const totalCount = (tpl.fields ?? []).length;
  const progress = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

  function renderField(f: Field) {
    const showError = touched[f.key] && f.required && !data[f.key]?.trim();
    const baseClass = `w-full rounded-lg border bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-amber-400 ${
      showError ? "border-red-500" : "border-zinc-700"
    }`;

    return (
      <label key={f.key} className="grid gap-1.5">
        <span className="flex items-center gap-1 text-sm text-zinc-300">
          {f.label}
          {f.required ? <span className="text-red-400">*</span> : null}
        </span>

        {f.type === "textarea" ? (
          <textarea
            value={data[f.key] ?? ""}
            onChange={(e) => updateField(f.key, e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, [f.key]: true }))}
            className={baseClass}
            rows={3}
            placeholder={f.placeholder || f.label}
            dir={isRTL ? "rtl" : "ltr"}
          />
        ) : f.type === "select" ? (
          <select
            value={data[f.key] ?? ""}
            onChange={(e) => updateField(f.key, e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, [f.key]: true }))}
            className={baseClass}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="">{isRTL ? "— اختر —" : "— Select —"}</option>
            {(f.options ?? []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
            value={data[f.key] ?? ""}
            onChange={(e) => updateField(f.key, e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, [f.key]: true }))}
            className={baseClass}
            placeholder={f.placeholder || f.label}
            dir={isRTL ? "rtl" : "ltr"}
          />
        )}

        {f.hint ? <span className="text-xs text-zinc-500">{f.hint}</span> : null}
        {showError ? (
          <span className="text-xs text-red-400">
            {isRTL ? "هذا الحقل مطلوب" : "This field is required"}
          </span>
        ) : null}
      </label>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2" dir={isRTL ? "rtl" : "ltr"}>
      {/* عمود النموذج */}
      <div className="space-y-4">
        {/* شريط التقدم */}
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-400">
              {isRTL ? "اكتمال النموذج" : "Form completion"}
            </span>
            <span className="font-semibold text-amber-400">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-amber-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* الأقسام */}
        {Object.entries(groupedFields).map(([groupName, fields]) => (
          <div key={groupName} className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
            <h3 className="mb-3 border-b border-zinc-800 pb-2 text-sm font-bold text-amber-400">
              {groupName}
            </h3>
            <div className="grid gap-3">
              {fields.map(renderField)}
            </div>
          </div>
        ))}

        {error ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}

        {/* أزرار */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={generate}
            disabled={loading}
            className="flex-1 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-zinc-900 transition hover:bg-amber-300 disabled:opacity-60"
          >
            {loading
              ? (isRTL ? "جاري التوليد..." : "Generating...")
              : (isRTL ? "توليد العقد (PDF)" : "Generate PDF")}
          </button>
          {result?.pdfUrl ? (
            <>
              <a href={`/contracts/generated/${result.id}`} className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-200 transition hover:bg-zinc-800">
                {isRTL ? "عرض العقد" : "View"}
              </a>
              <a href={result.pdfUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-200 transition hover:bg-zinc-800">
                {isRTL ? "فتح PDF" : "Open PDF"}
              </a>
            </>
          ) : null}
       
        </div>

        <p className="mt-1 text-[11px] text-zinc-500 leading-6">
          المعاينة على اليسار مجانية · تنزيل نسخة PDF نظيفة يتطلّب اشتراكاً.
        </p>

        {upgrade ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <div className="mb-1 font-semibold text-amber-300">
              معاينتك جاهزة على اليسار — مجاناً ✓
            </div>
            <p className="leading-6 text-zinc-300">
              لتنزيل نسخة PDF نظيفة جاهزة للتوقيع، تحتاج اشتراكاً في باقة الأفراد أو أعلى.
            </p>
            <a
              href="https://wa.me/9647719183785?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%84%D8%AA%D9%86%D8%B2%D9%8A%D9%84%20%D8%A7%D9%84%D8%B9%D9%82%D9%88%D8%AF%20PDF"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500"
            >
              اشترك لتنزيل PDF (واتساب) ↗
            </a>
          </div>
        ) : null}
      </div>

      {/* عمود المعاينة */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <PreviewPane templateSlug={templateSlug} data={data} />
      </div>
    </div>
  );
}
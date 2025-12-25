 "use client";

import { useEffect, useMemo, useState } from "react";
import PreviewPane from "./PreviewPane";

type TemplateResp = {
  ok: boolean;
  template: {
    slug: string;
    title: string;
    lang: "ar" | "en";
    group: "PRO" | "INCOTERMS";
    body: string;
    fields: string[];
  };
};

export default function ContractForm({ templateSlug }: { templateSlug: string }) {
  const [tpl, setTpl] = useState<TemplateResp["template"] | null>(null);
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: number; pdfUrl: string } | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/contracts/templates/${templateSlug}`);
      const j = (await r.json()) as TemplateResp;
      setTpl(j.template);
      setError("");
      setResult(null);
    })();
  }, [templateSlug]);

  const orderedFields = useMemo(() => (tpl?.fields ?? []).sort(), [tpl]);

  function updateField(k: string, v: string) {
    setData((p) => ({ ...p, [k]: v }));
  }

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const r = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: templateSlug, lang: tpl?.lang ?? "ar", data }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed");
      setResult({ id: j.id, pdfUrl: j.pdfUrl });
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  if (!tpl) return <div>Loading...</div>;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
        <div className="mb-3 text-sm text-zinc-400">املأ الحقول ثم توليد PDF</div>

        <div className="grid gap-3">
          {orderedFields.map((f) => (
            <label key={f} className="grid gap-1">
              <span className="text-sm text-zinc-300">{f}</span>
              <input
                value={data[f] ?? ""}
                onChange={(e) => updateField(f, e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder={f}
              />
            </label>
          ))}
        </div>

        {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

        <div className="mt-4 flex gap-2">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {loading ? "..." : "Generate PDF"}
          </button>

          {result?.pdfUrl ? (
            <>
              <a
                href={`/contracts/generated/${result.id}`}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm"
              >
                عرض العقد
              </a>
              <a
                href={result.pdfUrl}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm"
                target="_blank"
                rel="noreferrer"
              >
                فتح PDF
              </a>
            </>
          ) : null}
        </div>
      </div>

      <PreviewPane templateSlug={templateSlug} data={data} />
    </div>
  );
}

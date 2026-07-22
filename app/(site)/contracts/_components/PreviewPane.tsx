"use client";

import { useEffect, useMemo, useState } from "react";

export default function PreviewPane({
  templateSlug,
  data,
}: {
  templateSlug: string;
  data: Record<string, string>;
}) {
  const [body, setBody] = useState<string>("");

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/contracts/templates/${templateSlug}`);
      const j = await r.json();
      setBody(j?.template?.body ?? "");
    })();
  }, [templateSlug]);

  const preview = useMemo(() => {
    let html = body || "";
    html = html.replace(/{{\s*([a-zA-Z0-9_.-]+)\s*}}/g, (_all, key: string) => {
      const v = (data[key] ?? "").toString();
      const safe = v
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
      return safe || `<span style="color:#999">[${key}]</span>`;
    });
    return html;
  }, [body, data]);

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span className="text-zinc-300 font-medium">معاينة العقد</span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300">
          مجانية
        </span>
      </div>
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: preview }} />
      </div>
    </div>
  );
}


"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "./_components/SearchBar";
import { Filters } from "./_components/Filters";
import { ResultCard } from "./_components/ResultCard";
import { highlightHtml } from "@/lib/library/highlight";

type Hit = {
  id: number;
  title: string;
  section: string;
  snippet: string;
  score: number;
};

export default function LibraryProPageClient() {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"hybrid" | "fts" | "simple">("hybrid");
  const [section, setSection] = useState<"ALL" | "LAW" | "FIQH" | "ACADEMIC_STUDY">("ALL");
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [error, setError] = useState<string | null>(null);

  const doSearch = async (query: string) => {
    const qq = (query || "").trim();
    setQ(qq);
    setError(null);

    if (!qq) {
      setHits([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/library/search?q=${encodeURIComponent(qq)}&section=${section}&mode=${mode}&take=30`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Search failed");
      setHits(data.hits || []);
    } catch (e: any) {
      setError(e?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const rendered = useMemo(() => {
    return hits.map((h) => ({
      ...h,
      snippetHtml: highlightHtml(h.snippet, q),
    }));
  }, [hits, q]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8" dir="rtl">
      <header className="mb-6">
        <h1 className="text-right text-3xl font-bold text-zinc-100">المكتبة القانونية الاحترافية</h1>
        <p className="mt-2 text-right text-sm leading-7 text-zinc-400">
          بحث ذكي داخل القوانين والفقه والدراسات — مع مقتطفات وعلاقات قانونية.
        </p>
      </header>

      <div className="space-y-4">
        <SearchBar onSearch={doSearch} />
        <Filters section={section} setSection={setSection} mode={mode} setMode={setMode} />

        {loading && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-right text-sm text-zinc-300">
            جاري البحث…
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-4 text-right text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && q && (
          <div className="text-right text-xs text-zinc-500">
            النتائج: {hits.length}
          </div>
        )}

        <div className="grid gap-4">
          {rendered.map((h) => (
            <ResultCard
              key={h.id}
              id={h.id}
              title={h.title}
              section={h.section}
              snippetHtml={h.snippetHtml}
              score={h.score}
            />
          ))}
        </div>

        {!loading && !error && q && hits.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-right text-sm text-zinc-300">
            لا توجد نتائج. جرّب كلمات مختلفة أو غيّر وضع البحث.
          </div>
        )}
      </div>
    </main>
  );
}


"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Item = {
  slug: string;
  title: string;
  lang: string;
  jurisdiction: string;
};

export default function QuickSearch({
  items,
  placeholder,
  buttonLabel,
  emptyLabel,
  langQS,
}: {
  items: Item[];
  placeholder: string;
  buttonLabel: string;
  emptyLabel: string;
  langQS: string;
}) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return items
      .filter((it) => it.title.toLowerCase().includes(term))
      .slice(0, 8);
  }, [q, items]);

  const open = q.trim().length > 0;

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="flex items-stretch gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-lg backdrop-blur">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          aria-label={placeholder}
        />
        <span className="hidden shrink-0 items-center rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-900 sm:inline-flex">
          {buttonLabel}
        </span>
      </div>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-zinc-400">{emptyLabel}</div>
          ) : (
            <ul className="max-h-80 overflow-auto py-1">
              {results.map((it) => (
                <li key={it.slug}>
                  <Link
                    href={`/contracts/${it.slug}${langQS}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-zinc-200 transition hover:bg-white/5"
                  >
                    <span className="truncate">{it.title}</span>
                    <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-[10px] uppercase text-zinc-400">
                      {it.lang}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({
  initial = "",
  onSearch,
}: {
  initial?: string;
  onSearch: (q: string) => void;
}) {
  const [q, setQ] = useState(initial);

  useEffect(() => setQ(initial), [initial]);

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
      <Search className="h-5 w-5 text-zinc-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch(q);
        }}
        placeholder="ابحث في القوانين والفقه والدراسات…"
        className="w-full bg-transparent text-right outline-none placeholder:text-zinc-500"
        dir="rtl"
      />
      <button
        onClick={() => onSearch(q)}
        className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:opacity-90"
      >
        بحث
      </button>
    </div>
  );
}


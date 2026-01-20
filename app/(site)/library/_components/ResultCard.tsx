"use client";

import Link from "next/link";

export function ResultCard({
  id,
  title,
  section,
  snippetHtml,
  score,
}: {
  id: number;
  title: string;
  section: string;
  snippetHtml: string;
  score: number;
}) {
  return (
    <Link
      href={`/library/${id}`}
      className="block rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-600"
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-right">
          <div className="text-sm text-zinc-400">{badge(section)}</div>
          <div className="mt-1 text-lg font-semibold text-zinc-100">{title}</div>
        </div>
        <div className="text-xs text-zinc-500">
          {Math.round(score * 100)}%
        </div>
      </div>

      <div
        className="mt-3 text-sm leading-7 text-zinc-300"
        dangerouslySetInnerHTML={{ __html: snippetHtml }}
      />
    </Link>
  );
}

function badge(section: string) {
  if (section === "LAW") return "قانون";
  if (section === "FIQH") return "فقه";
  if (section === "ACADEMIC_STUDY") return "دراسة أكاديمية";
  return section;
}


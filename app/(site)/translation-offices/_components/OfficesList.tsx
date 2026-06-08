// app/(site)/translation-offices/_components/OfficesList.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Office = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  image: string | null;
};

function initials(name: string | null, id: number) {
  if (!name) return `#${id}`;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return `#${id}`;
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

/* أيقونات SVG صغيرة */
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function OfficesList({ offices }: { offices: Office[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return offices;
    return offices.filter((o) => {
      const name = (o.name || "").toLowerCase();
      const loc = (o.location || "").toLowerCase();
      return name.includes(q) || loc.includes(q);
    });
  }, [offices, query]);

  return (
    <div className="space-y-6">
      {/* شريط البحث + العداد */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث باسم المكتب أو المدينة…"
            className="w-full rounded-xl border border-purple-500/25 bg-[#1e1133]/50 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-purple-300/40 outline-none transition focus:border-amber-400/50 focus:bg-[#1e1133]/80"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-300">
            <IconSearch />
          </span>
        </div>
        <div className="text-xs text-amber-300">{filtered.length} مكتب معتمد</div>
      </div>

      {/* الشبكة */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-500/20 bg-[#1e1133]/20 py-16 text-center">
          <p className="text-sm text-purple-200/70">
            {offices.length === 0
              ? "لا توجد مكاتب ترجمة معتمدة حالياً."
              : "لا توجد نتائج مطابقة لبحثك."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((office) => (
            <Link
              key={office.id}
              href={`/translation-offices/${office.id}`}
              className="group relative block overflow-hidden rounded-2xl border border-purple-500/20 bg-[#1e1133]/35 p-5 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-[#1e1133]/55"
            >
              {/* شريط ذهبي علوي عند المرور */}
              <div className="absolute inset-x-0 -top-px h-0.5 bg-gradient-to-l from-transparent via-amber-400 to-transparent opacity-0 transition group-hover:opacity-100" />

              <div className="flex items-start gap-3">
                {/* avatar */}
                {office.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={office.image}
                    alt={office.name || "مكتب ترجمة"}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-amber-400/30"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-bold text-white ring-1 ring-amber-400/30">
                    {initials(office.name, office.id)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-semibold">
                    {office.name || `مكتب ترجمة #${office.id}`}
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-400/12 px-2 py-0.5 text-[11px] text-amber-300">
                    <IconCheck /> معتمد
                  </span>
                </div>
              </div>

              {/* معلومات */}
              <div className="mt-4 space-y-1.5 text-xs text-purple-200/80">
                {office.location && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-purple-300">
                      <IconPin />
                    </span>
                    <span className="truncate">{office.location}</span>
                  </div>
                )}
                {office.phone && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-purple-300">
                      <IconPhone />
                    </span>
                    <span dir="ltr" className="truncate">
                      {office.phone}
                    </span>
                  </div>
                )}
                {office.email && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-purple-300">
                      <IconMail />
                    </span>
                    <span dir="ltr" className="truncate">
                      {office.email}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-purple-500/15 pt-3 text-sm text-amber-300">
                <span className="group-hover:underline">عرض التفاصيل</span>
                <span className="transition group-hover:-translate-x-1">←</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

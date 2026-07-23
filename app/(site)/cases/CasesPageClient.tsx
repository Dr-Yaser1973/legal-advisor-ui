"use client";
// app/(site)/cases/CasesPageClient.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase, Plus, Search, Calendar, MapPin, User2,
  CalendarClock, Paperclip, Users, ChevronLeft, ChevronRight, FolderOpen,
} from "lucide-react";
import { CASE_TYPES, CASE_STATUSES, caseStatusColor } from "@/lib/cases/options";

type CaseItem = {
  id: number;
  title: string;
  type: string;
  court: string;
  status: string;
  filingDate: string;
  closingDate?: string | null;
  assigned?: { id: number; name: string | null } | null;
  _count?: { events: number; documents: number; assignments: number };
};

type CasesResponse = {
  items: CaseItem[];
  total: number;
  page: number;
  pageSize: number;
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("ar-IQ", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function CasesPageClient() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<CasesResponse>({ items: [], total: 0, page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchCases(pageArg = 1) {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("page", String(pageArg));
      params.set("pageSize", String(data.pageSize || 10));
      if (q.trim()) params.set("q", q.trim());
      if (status) params.set("status", status);
      if (type) params.set("type", type);

      const res = await fetch(`/api/cases?${params.toString()}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        setError(errJson?.error || "فشل في جلب القضايا من الخادم.");
        return;
      }
      const json: CasesResponse = await res.json();
      setData(json);
      setPage(json.page);
    } catch {
      setError("حدث خطأ غير متوقع أثناء جلب البيانات.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
    fetchCases(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, type]);

  async function handlePageChange(nextPage: number) {
    if (nextPage < 1) return;
    const maxPage = Math.max(1, Math.ceil(data.total / data.pageSize));
    if (nextPage > maxPage) return;
    await fetchCases(nextPage);
  }

  const maxPage = Math.max(1, Math.ceil(data.total / data.pageSize));
  const hasFilters = Boolean(q || status || type);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ── الهيرو ── */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-600/20 via-zinc-900 to-blue-600/20 p-6">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">إدارة القضايا</h1>
                <p className="text-sm text-zinc-300 mt-0.5">
                  متابعة قضاياك ومواعيدها، وتحديثات موكّليك، في مكان واحد.
                </p>
              </div>
            </div>
            <Link
              href="/cases/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> قضية جديدة
            </Link>
          </div>
          <div className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2">
            <FolderOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-300">إجمالي القضايا:</span>
            <span className="text-sm font-bold text-white">{data.total}</span>
          </div>
        </header>

        {/* ── الفلاتر ── */}
        <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 grid md:grid-cols-3 gap-3">
          <div className="relative md:col-span-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="بحث بالعنوان أو المحكمة…"
              className="w-full ps-9 pe-3 py-2 rounded-xl border border-white/10 bg-zinc-950 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
            />
          </div>
          <select
            value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
          >
            <option value="">كل الحالات</option>
            {CASE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={type} onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
          >
            <option value="">كل الأنواع</option>
            {CASE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </section>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-100">{error}</div>
        )}

        {/* ── القائمة ── */}
        {loading && data.items.length === 0 ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 animate-pulse">
                <div className="h-5 w-1/2 bg-zinc-800 rounded mb-3" />
                <div className="h-3 w-3/4 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-10 text-center">
            <div className="text-4xl mb-3">📂</div>
            <h3 className="font-semibold mb-1">{hasFilters ? "لا نتائج مطابقة" : "لا توجد قضايا بعد"}</h3>
            <p className="text-sm text-zinc-400 mb-4">
              {hasFilters ? "جرّب تغيير معايير البحث." : "ابدأ بإضافة أول قضية لمتابعتها وإدارتها."}
            </p>
            {!hasFilters && (
              <Link href="/cases/new" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 transition">
                <Plus className="w-4 h-4" /> قضية جديدة
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {data.items.map((c) => (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className="group block rounded-2xl border border-white/10 bg-zinc-900/50 p-4 hover:border-emerald-400/50 hover:bg-zinc-900/80 transition"
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <h3 className="text-sm font-semibold group-hover:text-emerald-300 transition">
                    {c.title || `قضية رقم ${c.id}`}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-zinc-300">
                      {c.type}
                    </span>
                    <span className={"text-[11px] rounded-full border px-2.5 py-0.5 " + caseStatusColor(c.status)}>
                      {c.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.court || "-"}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(c.filingDate)}</span>
                  {c.assigned?.name && (
                    <span className="flex items-center gap-1"><User2 className="w-3 h-3" /> {c.assigned.name}</span>
                  )}
                  {c._count && (
                    <span className="flex items-center gap-3 ms-auto text-zinc-500">
                      <span className="flex items-center gap-1" title="مواعيد"><CalendarClock className="w-3 h-3" /> {c._count.events}</span>
                      <span className="flex items-center gap-1" title="مستندات"><Paperclip className="w-3 h-3" /> {c._count.documents}</span>
                      <span className="flex items-center gap-1" title="الفريق"><Users className="w-3 h-3" /> {c._count.assignments}</span>
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── التصفح ── */}
        {data.total > data.pageSize && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button" onClick={() => handlePageChange(page - 1)} disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs hover:bg-zinc-800/70 disabled:opacity-40"
            >
              <ChevronRight className="w-3 h-3" /> السابق
            </button>
            <span className="text-xs text-zinc-400">صفحة {page} من {maxPage}</span>
            <button
              type="button" onClick={() => handlePageChange(page + 1)} disabled={page >= maxPage || loading}
              className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs hover:bg-zinc-800/70 disabled:opacity-40"
            >
              التالي <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

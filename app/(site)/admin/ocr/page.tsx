 "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCcw,
  Filter,
  FileText,
  Image as ImageIcon,
  Loader2,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

// ================= Types =================
type OCRStatus = "NONE" | "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
type DocumentKind = "PDF" | "IMAGE";

export type Item = {
  id: number;
  title: string;
  filename: string | null;
  mimetype: string;
  size: number;
  kind: DocumentKind;
  isScanned: boolean;
  ocrStatus: OCRStatus;
  ocrLanguage: string | null;
  pageCount: number | null;
  source: string | null;
  checksum: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: number; name: string | null; email: string | null } | null;
};

export type ApiResponse = {
  ok: boolean;
  page: number;
  pageSize: number;
  total: number;
  pages: number;
  counts: Record<string, number>;
  items: Item[];
  error?: string;
};

// ================= Constants =================
const STATUS_OPTIONS: { value: "" | OCRStatus; label: string }[] = [
  { value: "", label: "كل الحالات" },
  { value: "NONE", label: "بدون OCR" },
  { value: "PENDING", label: "بالطابور" },
  { value: "PROCESSING", label: "قيد المعالجة" },
  { value: "COMPLETED", label: "مكتمل" },
  { value: "FAILED", label: "فشل" },
];

const KIND_OPTIONS: { value: "" | DocumentKind; label: string }[] = [
  { value: "", label: "كل الأنواع" },
  { value: "PDF", label: "PDF" },
  { value: "IMAGE", label: "صور" },
];

// ================= Helpers =================
function fmtSize(bytes: number) {
  if (!bytes && bytes !== 0) return "-";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

function badge(status: OCRStatus) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold";
  if (status === "COMPLETED")
    return base + " border-emerald-700/50 bg-emerald-950/30 text-emerald-200";
  if (status === "PROCESSING")
    return base + " border-sky-700/50 bg-sky-950/30 text-sky-200";
  if (status === "PENDING")
    return base + " border-yellow-700/50 bg-yellow-950/30 text-yellow-200";
  if (status === "FAILED")
    return base + " border-rose-700/50 bg-rose-950/30 text-rose-200";
  return base + " border-zinc-700 bg-zinc-950/40 text-zinc-300";
}

// ================= Main Page =================
export default function OcrAdminPage() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | OCRStatus>("");
  const [kind, setKind] = useState<"" | DocumentKind>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [data, setData] = useState<ApiResponse | null>(null);
  const pages = data?.pages || 1;

  // ========== Query String ==========
  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (status) sp.set("status", status);
    if (kind) sp.set("kind", kind);
    sp.set("page", String(page));
    sp.set("pageSize", String(pageSize));
    return sp.toString();
  }, [q, status, kind, page, pageSize]);

  // ========== Load ==========
  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/ocr/documents?${queryString}`, {
        cache: "no-store",
      });
      const json = (await res.json()) as ApiResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  // ========== Enqueue ==========
  async function enqueue(id: number, force = false) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/ocr/${id}/enqueue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "ar+en", force }),
      });
      await res.json().catch(() => null);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  // ========== Run Worker (Global) ==========
   async function runWorker(limit = 5) {
  if (!confirm("تشغيل OCR على المستندات الموجودة في الطابور؟")) return;

  try {
    const res = await fetch("/api/ocr/enqueue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ limit }),
    });

    const json = await res.json();

    if (!res.ok || !json.ok) {
      alert(json.error || "فشل تشغيل الطابور");
      return;
    }

    alert(`تم إرسال ${json.queued} مستند إلى الوركر`);
    await load();
  } catch (e) {
    alert("خطأ في الاتصال بخدمة OCR");
  }
}


  const counts = data?.counts || {};

  return (
    <main dir="rtl" className="min-h-screen bg-[#0b1220] text-zinc-100">
      {/* ================= Top bar ================= */}
      <div className="sticky top-0 z-40 border-b border-zinc-800 bg-[#0b1220]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 grid place-items-center">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold">لوحة OCR</div>
              <div className="text-[11px] text-zinc-400">
                إدارة المستندات المصوّرة والممسوحة — Queue / Retry / Stats
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => runWorker(5)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
              title="تشغيل OCR Worker على المستندات في الطابور"
            >
              <PlayCircle className="h-4 w-4" />
              تشغيل OCR
            </button>

            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm font-semibold hover:bg-zinc-900/40 transition"
            >
              <RefreshCcw className="h-4 w-4" />
              تحديث
            </button>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition"
            >
              رجوع للإدارة
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* ================= Stats ================= */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="بدون OCR" value={counts["NONE"] ?? 0} tone="zinc" />
          <StatCard title="بالطابور" value={counts["PENDING"] ?? 0} tone="yellow" />
          <StatCard title="قيد المعالجة" value={counts["PROCESSING"] ?? 0} tone="sky" />
          <StatCard title="مكتمل" value={counts["COMPLETED"] ?? 0} tone="emerald" />
          <StatCard title="فشل" value={counts["FAILED"] ?? 0} tone="rose" />
        </div>

        {/* ================= Filters ================= */}
        <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Filter className="h-4 w-4 text-emerald-300" />
              فلاتر وبحث
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  value={q}
                  onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                  }}
                  placeholder="بحث بالعنوان أو اسم الملف…"
                  className="w-full md:w-80 rounded-xl border border-zinc-800 bg-zinc-950 px-10 py-2 text-sm outline-none focus:border-emerald-700"
                />
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value as any);
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <select
                value={kind}
                onChange={(e) => {
                  setPage(1);
                  setKind(e.target.value as any);
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPage(1);
                  setPageSize(Number(e.target.value));
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
              >
                {[10, 15, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / صفحة
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ================= Table ================= */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800">
            <div className="hidden md:grid grid-cols-12 gap-2 bg-zinc-950 px-4 py-3 text-[12px] font-semibold text-zinc-300">
              <div className="col-span-4">المستند</div>
              <div className="col-span-2">النوع</div>
              <div className="col-span-2">الحالة</div>
              <div className="col-span-2">آخر تحديث</div>
              <div className="col-span-2 text-left">إجراءات</div>
            </div>

            <div className="divide-y divide-zinc-800 bg-zinc-950/40">
              {loading ? (
                <div className="px-4 py-10 text-center text-sm text-zinc-300">
                  <Loader2 className="h-5 w-5 animate-spin inline-block ml-2" />
                  تحميل…
                </div>
              ) : data?.ok === false ? (
                <div className="px-4 py-10 text-center text-sm text-rose-200">
                  {data.error || "حدث خطأ"}
                </div>
              ) : data?.items?.length ? (
                data.items.map((it) => (
                  <Row
                    key={it.id}
                    it={it}
                    busy={busyId === it.id}
                    onEnqueue={() => enqueue(it.id, false)}
                    onRetry={() => enqueue(it.id, true)}
                  />
                ))
              ) : (
                <div className="px-4 py-10 text-center text-sm text-zinc-300">
                  لا توجد نتائج.
                </div>
              )}
            </div>
          </div>

          {/* ================= Pagination ================= */}
          <div className="mt-4 flex items-center justify-between text-sm text-zinc-300">
            <div>
              المجموع: <span className="font-semibold text-zinc-100">{data?.total ?? 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 disabled:opacity-50"
              >
                السابق
              </button>
              <div className="text-xs text-zinc-400">
                صفحة <span className="text-zinc-100 font-semibold">{page}</span> من{" "}
                <span className="text-zinc-100 font-semibold">{pages}</span>
              </div>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          </div>
        </div>

        {/* ================= Hint ================= */}
        <div className="mt-4 text-[12px] text-zinc-400 leading-6">
          ملاحظة: زر <span className="text-zinc-100 font-semibold">إدخال للطابور</span> يضبط حالة OCR إلى
          PENDING. زر <span className="text-zinc-100 font-semibold">تشغيل OCR</span> يقوم بتشغيل العامل
          لاستخراج النص وتحديث الحالة إلى PROCESSING ثم COMPLETED.
        </div>
      </div>
    </main>
  );

  // ================= Row Component =================
  function Row({
    it,
    busy,
    onEnqueue,
    onRetry,
  }: {
    it: Item;
    busy: boolean;
    onEnqueue: () => void;
    onRetry: () => void;
  }) {
    const Icon = it.kind === "PDF" ? FileText : ImageIcon;
    const updated = new Date(it.updatedAt).toLocaleString("ar-IQ");

    return (
      <div className="px-4 py-4">
        {/* Mobile card */}
        <div className="md:hidden space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-10 w-10 rounded-2xl border border-zinc-800 bg-zinc-950/50 grid place-items-center">
                <Icon className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <div className="text-sm font-bold">{it.title}</div>
                <div className="text-[11px] text-zinc-400">
                  #{it.id} • {fmtSize(it.size)} • {it.filename || "بدون اسم ملف"}
                </div>
              </div>
            </div>
            <span className={badge(it.ocrStatus)}>{it.ocrStatus}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[12px] text-zinc-400">
            <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5">
              {it.kind}
            </span>
            <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5">
              lang: {it.ocrLanguage || "-"}
            </span>
            <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5">
              pages: {it.pageCount ?? "-"}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEnqueue}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
              إدخال للطابور
            </button>
            <button
              onClick={onRetry}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              Retry
            </button>
          </div>

          <div className="text-[11px] text-zinc-500">آخر تحديث: {updated}</div>
        </div>

        {/* Desktop row */}
        <div className="hidden md:grid grid-cols-12 items-center gap-2">
          <div className="col-span-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-zinc-800 bg-zinc-950/50 grid place-items-center">
              <Icon className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-sm font-bold">{it.title}</div>
              <div className="text-[11px] text-zinc-400">
                #{it.id} • {fmtSize(it.size)} • {it.filename || "بدون اسم"}
              </div>
            </div>
          </div>

          <div className="col-span-2 text-sm text-zinc-300">
            <div className="font-semibold">{it.kind}</div>
            <div className="text-[11px] text-zinc-400">{it.mimetype}</div>
          </div>

          <div className="col-span-2">
            <span className={badge(it.ocrStatus)}>{it.ocrStatus}</span>
            <div className="text-[11px] text-zinc-400 mt-1">
              lang: {it.ocrLanguage || "-"} • pages: {it.pageCount ?? "-"}
            </div>
          </div>

          <div className="col-span-2 text-[12px] text-zinc-400">{updated}</div>

          <div className="col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={onEnqueue}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
              Enqueue
            </button>
            <button
              onClick={onRetry}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm font-semibold hover:bg-zinc-900/40 disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ================= Stat Card =================
function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone: "zinc" | "yellow" | "sky" | "emerald" | "rose";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-700/40 bg-emerald-950/20 text-emerald-200"
      : tone === "sky"
      ? "border-sky-700/40 bg-sky-950/20 text-sky-200"
      : tone === "yellow"
      ? "border-yellow-700/40 bg-yellow-950/20 text-yellow-200"
      : tone === "rose"
      ? "border-rose-700/40 bg-rose-950/20 text-rose-200"
      : "border-zinc-800 bg-zinc-950/40 text-zinc-200";

  return (
    <div className={`rounded-3xl border p-4 ${toneClass}`}>
      <div className="text-[12px] font-semibold opacity-90">{title}</div>
      <div className="mt-2 text-3xl font-extrabold">{value}</div>
    </div>
  );
}

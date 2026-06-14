 // app/admin/consultations/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";

export const dynamic = "force-dynamic";

type OfferDetail = {
  providerName: string;
  fee: number;
  currency: string;
  note: string | null;
  status: string;
  statusLabel: string;
  createdAt: string;
  respondedAt: string | null;
};

type Row = {
  id: string;
  track: "AI" | "HUMAN" | "CONSULT_REQ" | "FIRM";
  trackLabel: string;
  title: string;
  status: string;
  statusLabel: string;
  clientName: string;
  clientEmail: string;
  handlerName: string | null;
  createdAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
  responseMs: number | null;
  slaBreached: boolean;
  offers: OfferDetail[];
};

type Stats = {
  aiTotal: number;
  humanPending: number;
  humanActive: number;
  firmPending: number;
  firmActive: number;
  last7Days: number;
  avgHumanResponseMs: number | null;
  avgFirmResponseMs: number | null;
};

const TRACKS = [
  { key: "ALL", label: "كل المسارات" },
  { key: "AI", label: "ذكية" },
  { key: "HUMAN", label: "محامٍ معتمد" },
  { key: "FIRM", label: "مكاتب/شركات" },
  { key: "CONSULT_REQ", label: "طلبات مباشرة" },
];

const DAYS_OPTS = [
  { key: "0", label: "كل الفترات" },
  { key: "1", label: "آخر 24 ساعة" },
  { key: "7", label: "آخر 7 أيام" },
  { key: "30", label: "آخر 30 يوم" },
];

const TRACK_COLORS: Record<string, string> = {
  AI: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  HUMAN: "bg-green-500/15 text-green-300 border-green-500/30",
  FIRM: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  CONSULT_REQ: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

// تنسيق مدّة بالعربية
function fmtDuration(ms: number | null): string {
  if (ms == null) return "—";
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins} دقيقة`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} ساعة`;
  const days = Math.round(hours / 24);
  return `${days} يوم`;
}

function fmtMoney(fee: number, currency: string): string {
  return `${fee.toLocaleString("ar-IQ")} ${currency}`;
}

export default function AdminConsultationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [track, setTrack] = useState("ALL");
  const [days, setDays] = useState("7");
  const [q, setQ] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ track, days, q, limit: "100" });
      const res = await fetch(`/api/admin/consultations?${params}`, {
        cache: "no-store",
      });
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      const data = await res.json();
      setRows(data.rows || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [track, days, q]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [autoRefresh, load]);

  function toggle(id: string) {
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
  }

  if (forbidden) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-right" dir="rtl">
        <h1 className="text-2xl font-bold mb-4">لوحة الاستشارات</h1>
        <p className="text-sm text-red-400">
          هذه الصفحة متاحة لمدير النظام (ADMIN) فقط.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-right" dir="rtl">
      <header className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">مراقبة الاستشارات</h1>
          <p className="text-sm text-zinc-400">
            عرض موحّد لكل مسارات الاستشارات مع العروض المقدّمة وأزمنة الاستجابة.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="accent-[#c9a84c]"
          />
          تحديث تلقائي (15 ث)
        </label>
      </header>

      {/* كروت الإحصائيات */}
      {stats && (
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard label="إجمالي الذكية" value={stats.aiTotal} accent="blue" />
          <StatCard
            label="محامٍ — بانتظار"
            value={stats.humanPending}
            accent="amber"
          />
          <StatCard
            label="مكاتب — بانتظار"
            value={stats.firmPending}
            accent="amber"
          />
          <StatCard
            label="آخر 7 أيام"
            value={stats.last7Days}
            accent="gold"
          />
          <StatCardText
            label="متوسط رد المحامي"
            value={fmtDuration(stats.avgHumanResponseMs)}
            accent="green"
          />
          <StatCardText
            label="متوسط رد المكاتب"
            value={fmtDuration(stats.avgFirmResponseMs)}
            accent="purple"
          />
        </div>
      )}

      {/* أدوات الفلترة */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-1">
          {TRACKS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTrack(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                track === t.key
                  ? "bg-[#c9a84c] text-black border-[#c9a84c] font-semibold"
                  : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <select
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200"
        >
          {DAYS_OPTS.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="بحث في العنوان/التفاصيل…"
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200 flex-1 min-w-[180px]"
        />

        <button
          onClick={load}
          className="px-4 py-1.5 rounded-lg text-xs bg-zinc-800 border border-zinc-600 text-zinc-100 hover:bg-zinc-700"
        >
          تحديث
        </button>
      </div>

      {/* الجدول */}
      <section className="border border-zinc-800 rounded-2xl bg-zinc-900/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">الاستشارات</h2>
          <p className="text-xs text-zinc-400">
            {loading ? "جارٍ التحميل…" : `${rows.length} نتيجة`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="py-2 text-right font-medium">المسار</th>
                <th className="py-2 text-right font-medium">العنوان</th>
                <th className="py-2 text-right font-medium">صاحب الاستشارة</th>
                <th className="py-2 text-right font-medium">المسؤول</th>
                <th className="py-2 text-right font-medium">الحالة</th>
                <th className="py-2 text-right font-medium">زمن الاستجابة</th>
                <th className="py-2 text-right font-medium">العروض</th>
                <th className="py-2 text-right font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <RowGroup
                  key={r.id}
                  row={r}
                  open={!!expanded[r.id]}
                  onToggle={() => toggle(r.id)}
                />
              ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-zinc-400 text-sm"
                  >
                    لا توجد استشارات مطابقة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function RowGroup({
  row: r,
  open,
  onToggle,
}: {
  row: Row;
  open: boolean;
  onToggle: () => void;
}) {
  const hasOffers = r.offers.length > 0;
  const minFee = hasOffers
    ? Math.min(...r.offers.map((o) => o.fee))
    : null;

  return (
    <>
      <tr
        className={`border-b border-zinc-900/70 ${
          r.slaBreached ? "bg-red-500/5" : ""
        }`}
      >
        <td className="py-2 align-top">
          <span
            className={`inline-block px-2 py-0.5 rounded-md text-[11px] border ${
              TRACK_COLORS[r.track] || ""
            }`}
          >
            {r.trackLabel}
          </span>
        </td>
        <td className="py-2 align-top max-w-xs">
          <div className="font-medium truncate">{r.title}</div>
        </td>
        <td className="py-2 align-top">
          <div className="text-sm">{r.clientName}</div>
          <div className="text-[11px] text-zinc-400">{r.clientEmail}</div>
        </td>
        <td className="py-2 align-top text-xs text-zinc-300">
          {r.handlerName || "—"}
        </td>
        <td className="py-2 align-top text-xs">
          <span className={r.slaBreached ? "text-red-400 font-semibold" : "text-zinc-200"}>
            {r.statusLabel}
          </span>
          {r.slaBreached && (
            <div className="text-[10px] text-red-400 mt-0.5">
              ⚠ تجاوز مهلة الاستجابة
            </div>
          )}
        </td>
        <td className="py-2 align-top text-xs text-zinc-300 whitespace-nowrap">
          {fmtDuration(r.responseMs)}
        </td>
        <td className="py-2 align-top text-xs">
          {hasOffers ? (
            <button
              onClick={onToggle}
              className="text-[#c9a84c] hover:underline"
            >
              {r.offers.length} عرض · من {fmtMoney(minFee!, r.offers[0].currency)}
              {open ? " ▲" : " ▼"}
            </button>
          ) : (
            <span className="text-zinc-500">—</span>
          )}
        </td>
        <td className="py-2 align-top text-xs text-zinc-400 whitespace-nowrap">
          {new Date(r.createdAt).toLocaleString("ar-IQ")}
        </td>
      </tr>

      {/* تفاصيل العروض الموسّعة */}
      {open && hasOffers && (
        <tr className="border-b border-zinc-900/70 bg-zinc-950/40">
          <td colSpan={8} className="py-3 px-4">
            <div className="space-y-2">
              {r.offers.map((o, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {o.providerName}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {o.statusLabel}
                      </span>
                    </div>
                    {o.note && (
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {o.note}
                      </p>
                    )}
                    <p className="text-[10px] text-zinc-500 mt-1">
                      قُدّم في {new Date(o.createdAt).toLocaleString("ar-IQ")}
                    </p>
                  </div>
                  <div className="text-left whitespace-nowrap">
                    <div className="text-[#c9a84c] font-bold text-sm">
                      {fmtMoney(o.fee, o.currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  accent = "gold",
}: {
  label: string;
  value: number;
  accent?: "blue" | "green" | "purple" | "amber" | "gold";
}) {
  const colors: Record<string, string> = {
    blue: "text-blue-300",
    green: "text-green-300",
    purple: "text-purple-300",
    amber: "text-amber-300",
    gold: "text-[#c9a84c]",
  };
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-right">
      <div className="text-xs text-zinc-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${colors[accent]}`}>{value}</div>
    </div>
  );
}

function StatCardText({
  label,
  value,
  accent = "gold",
}: {
  label: string;
  value: string;
  accent?: "blue" | "green" | "purple" | "amber" | "gold";
}) {
  const colors: Record<string, string> = {
    blue: "text-blue-300",
    green: "text-green-300",
    purple: "text-purple-300",
    amber: "text-amber-300",
    gold: "text-[#c9a84c]",
  };
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-right">
      <div className="text-xs text-zinc-400 mb-1">{label}</div>
      <div className={`text-lg font-bold ${colors[accent]}`}>{value}</div>
    </div>
  );
}

 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CaseItem = {
  id: number;
  title: string;
  type: string;
  court: string;
  status: string;
  filingDate: string; // ISO string from API
  closingDate?: string | null;
};

type CasesResponse = {
  items: CaseItem[];
  total: number;
  page: number;
  pageSize: number;
};

// يمكنك تعديل هذه القيم كما يناسبك
const STATUS_OPTIONS = [
  "مفتوحة",
  "قيد المتابعة",
  "محجوزة للحكم",
  "مغلقة",
];

const TYPE_OPTIONS = [
  "مدنية",
  "جزائية",
  "تجارية",
  "إدارية",
  "أحوال شخصية",
];

function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("ar-IQ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function CasesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<CasesResponse>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // حقول إنشاء قضية جديدة
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("");
  const [newCourt, setNewCourt] = useState("");
  const [newStatus, setNewStatus] = useState("مفتوحة");
  const [newFilingDate, setNewFilingDate] = useState(
    new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  );
  const [newNotes, setNewNotes] = useState("");

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
        console.error("failed to fetch cases");
        setError("فشل في جلب القضايا من الخادم.");
        setLoading(false);
        return;
      }

      const json: CasesResponse = await res.json();
      setData(json);
      setPage(json.page);
    } catch (e) {
      console.error(e);
      setError("حدث خطأ غير متوقع أثناء جلب البيانات.");
    } finally {
      setLoading(false);
    }
  }

  // جلب القضايا عند تغيير الفلاتر أو الصفحة
  useEffect(() => {
    fetchCases(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, type]);

  // لتغيير الصفحة من أزرار السابق/التالي
  async function handlePageChange(nextPage: number) {
    if (nextPage < 1) return;
    const maxPage = Math.max(1, Math.ceil(data.total / data.pageSize));
    if (nextPage > maxPage) return;
    await fetchCases(nextPage);
  }

  async function handleCreateCase(e: React.FormEvent) {
    e.preventDefault();

    if (!newTitle.trim() || !newDescription.trim() || !newType || !newCourt) {
      alert("يرجى تعبئة عنوان القضية، نوعها، المحكمة، ووصف مختصر.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const body = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        type: newType,
        court: newCourt.trim(),
        status: newStatus,
        filingDate: new Date(newFilingDate),
        closingDate: null,
        parties: [], // يمكنك لاحقًا جعلها قائمة بأطراف القضية الحقيقية
        notes: newNotes.trim() || null,
      };

      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        console.error("failed to create case", errJson);
        setError("فشل في إنشاء القضية الجديدة.");
        return;
      }

      // إعادة تحميل الصفحة الأولى بعد الإضافة
      setCreating(false);
      setNewTitle("");
      setNewDescription("");
      setNewType("");
      setNewCourt("");
      setNewStatus("مفتوحة");
      setNewFilingDate(new Date().toISOString().slice(0, 10));
      setNewNotes("");

      await fetchCases(1);
    } catch (e) {
      console.error(e);
      setError("حدث خطأ غير متوقع أثناء إنشاء القضية.");
    } finally {
      setLoading(false);
    }
  }

  const maxPage = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">إدارة القضايا</h1>
          <p className="text-sm text-zinc-400">
            هذه الصفحة مخصصة لمكاتب المحاماة والشركات لإدارة القضايا ومتابعة سيرها.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 transition"
        >
          {creating ? "إلغاء" : "إضافة قضية جديدة"}
        </button>
      </header>

      {/* فورم إنشاء قضية جديدة */}
      {creating && (
        <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">قضية جديدة</h2>
          <form onSubmit={handleCreateCase} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">عنوان القضية</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
                  placeholder="مثال: دعوى تعويض عن أضرار عقدية"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">المحكمة</label>
                <input
                  type="text"
                  value={newCourt}
                  onChange={(e) => setNewCourt(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
                  placeholder="مثال: محكمة بداءة الكرخ"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">نوع القضية</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
                >
                  <option value="">— اختر نوع القضية —</option>
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">حالة القضية</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">تاريخ تسجيل القضية</label>
                <input
                  type="date"
                  value={newFilingDate}
                  onChange={(e) => setNewFilingDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">ملاحظات داخلية (اختياري)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
                  placeholder="ملاحظات لا تظهر للمستفيدين"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">وصف مختصر للقضية</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full min-h-[90px] rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
                placeholder="وصف موجز لوقائع القضية والطلبات الأساسية..."
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-zinc-800/70 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-60 transition"
              >
                حفظ القضية
              </button>
            </div>
          </form>
        </section>
      )}

      {/* فلاتر البحث */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 md:p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-200">بحث وتصفية</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">بحث عام (العنوان / المحكمة / النوع)</label>
            <input
              type="text"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
              placeholder="اكتب كلمة مفتاحية..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">حالة القضية</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
            >
              <option value="">الكل</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">نوع القضية</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500/60"
            >
              <option value="">الكل</option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* رسائل الخطأ */}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      {/* قائمة القضايا */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            عدد القضايا:{" "}
            <span className="font-semibold text-zinc-100">{data.total}</span>
          </span>
          <span>
            صفحة {page} من {maxPage}
          </span>
        </div>

        {loading && data.items.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-400">
            يتم تحميل القضايا...
          </div>
        ) : data.items.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-400">
            لا توجد قضايا مطابقة لمعايير البحث الحالية.
          </div>
        ) : (
          <div className="grid gap-3">
            {data.items.map((c) => (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className="block rounded-2xl border border-white/10 bg-zinc-900/50 p-4 hover:bg-zinc-900/80 transition"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold">
                    {c.title || `قضية رقم ${c.id}`}
                  </h3>
                  <span className="text-[11px] rounded-full border border-emerald-500/40 px-2 py-0.5 text-emerald-200">
                    {c.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <span>المحكمة: {c.court || "-"}</span>
                  <span>الحالة: {c.status}</span>
                  <span>تاريخ التسجيل: {formatDate(c.filingDate)}</span>
                  {c.closingDate && (
                    <span>تاريخ الإغلاق: {formatDate(c.closingDate)}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* التصفح */}
        {data.total > data.pageSize && (
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="rounded-xl border border-white/10 px-3 py-1 text-xs hover:bg-zinc-800/70 disabled:opacity-40"
            >
              السابق
            </button>
            <span className="text-xs text-zinc-400">
              صفحة {page} من {maxPage}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= maxPage || loading}
              className="rounded-xl border border-white/10 px-3 py-1 text-xs hover:bg-zinc-800/70 disabled:opacity-40"
            >
              التالي
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

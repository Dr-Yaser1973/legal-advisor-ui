 // app/(site)/cases/new/NewCaseForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CASE_TYPES = ["مدني", "تجاري", "جنائي", "عمالي", "أحوال شخصية", "إداري", "أخرى"];
const CASE_STATUSES = ["مفتوحة", "قيد المتابعة", "محجوزة للحكم", "مغلقة"];

export default function NewCaseForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: CASE_TYPES[0],
    court: "",
    status: CASE_STATUSES[0],
    filingDate: "",
    closingDate: "",
    notes: "",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    setError(null);

    if (!form.title.trim() || !form.court.trim() || !form.filingDate) {
      setError("العنوان والمحكمة وتاريخ القيد حقول مطلوبة.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        court: form.court.trim(),
        status: form.status,
        filingDate: form.filingDate,
        closingDate: form.closingDate || null,
        notes: form.notes.trim() || null,
        parties: {},
      };

      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تعذّر إنشاء القضية.");
        return;
      }

      router.push(`/cases/${data.case.id}`);
    } catch (e: any) {
      setError(e.message || "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm " +
    "text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none";
  const labelClass = "block text-xs text-zinc-400 mb-1";

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div className="space-y-1">
        <Link href="/cases" className="text-xs text-zinc-400 hover:text-zinc-200 underline">
          ← الرجوع إلى قائمة القضايا
        </Link>
        <h1 className="text-2xl font-bold">إضافة قضية جديدة</h1>
        <p className="text-sm text-zinc-400">
          بعد الحفظ يمكنك تكليف موظفيك بالقضية من صفحتها.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 space-y-3">
        <h2 className="text-sm font-semibold">بيانات القضية</h2>

        <div>
          <label className={labelClass}>عنوان القضية *</label>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="مثال: نزاع تجاري — شركة الفجر"
          />
        </div>

        <div>
          <label className={labelClass}>وصف القضية</label>
          <textarea
            className={inputClass + " min-h-[100px]"}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="ملخص الوقائع والطلبات..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>نوع القضية</label>
            <select className={inputClass} value={form.type} onChange={(e) => update("type", e.target.value)}>
              {CASE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>حالة القضية</label>
            <select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
              {CASE_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>المحكمة *</label>
          <input
            className={inputClass}
            value={form.court}
            onChange={(e) => update("court", e.target.value)}
            placeholder="مثال: محكمة بغداد التجارية"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>تاريخ القيد *</label>
            <input
              type="date"
              className={inputClass}
              value={form.filingDate}
              onChange={(e) => update("filingDate", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>تاريخ الإغلاق (اختياري)</label>
            <input
              type="date"
              className={inputClass}
              value={form.closingDate}
              onChange={(e) => update("closingDate", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>ملاحظات داخلية</label>
          <textarea
            className={inputClass + " min-h-[70px]"}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="ملاحظات لا تظهر للموكل..."
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Link href="/cases" className="text-sm text-zinc-400 hover:text-zinc-200 px-4 py-2">
          إلغاء
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ القضية"}
        </button>
      </div>
    </main>
  );
}
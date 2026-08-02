"use client";

import { useEffect, useState } from "react";

type Banner = {
  id: number;
  enabled: boolean;
  sortOrder: number;
  href: string;
  external: boolean;
  emoji: string;
  gradient: string;
  titleAr: string;
  subtitleAr: string;
  ctaAr: string;
  titleEn: string;
  subtitleEn: string;
  ctaEn: string;
  impressions: number;
  clicks: number;
};

type Draft = Omit<Banner, "id" | "sortOrder" | "impressions" | "clicks">;

const GRADIENT_PRESETS: { label: string; value: string }[] = [
  { label: "زمرّي", value: "linear-gradient(135deg,#059669 0%,#0d9488 50%,#0891b2 100%)" },
  { label: "بنفسجي", value: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#9333ea 100%)" },
  { label: "أزرق داكن", value: "linear-gradient(135deg,#0b1f3a 0%,#1e3a8a 50%,#2563eb 100%)" },
  { label: "ذهبي", value: "linear-gradient(135deg,#b45309 0%,#d97706 50%,#f59e0b 100%)" },
  { label: "أحمر", value: "linear-gradient(135deg,#7f1d1d 0%,#b91c1c 50%,#ef4444 100%)" },
  { label: "رمادي", value: "linear-gradient(135deg,#111827 0%,#374151 50%,#6b7280 100%)" },
];

function emptyDraft(): Draft {
  return {
    enabled: true,
    href: "",
    external: false,
    emoji: "📣",
    gradient: GRADIENT_PRESETS[1].value,
    titleAr: "",
    subtitleAr: "",
    ctaAr: "اعرف المزيد",
    titleEn: "",
    subtitleEn: "",
    ctaEn: "Learn more",
  };
}

const inputCls =
  "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";

function Preview({ b }: { b: Draft }) {
  return (
    <div
      dir="rtl"
      className="relative overflow-hidden rounded-xl shadow"
      style={{ background: b.gradient }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-3xl">{b.emoji}</span>
        <div className="min-w-0 flex-1 text-white">
          <div className="text-sm font-extrabold leading-tight">
            {b.titleAr || "— العنوان —"}
          </div>
          {b.subtitleAr ? (
            <div className="mt-0.5 line-clamp-1 text-xs text-white/85">
              {b.subtitleAr}
            </div>
          ) : null}
        </div>
        <span className="shrink-0 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-zinc-900">
          {b.ctaAr || "زر"}
        </span>
      </div>
    </div>
  );
}

function BannerForm({
  initial,
  onSave,
  onCancel,
  busy,
}: {
  initial: Draft;
  onSave: (d: Draft) => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const [d, setD] = useState<Draft>(initial);
  const set = (patch: Partial<Draft>) => setD((p) => ({ ...p, ...patch }));

  return (
    <div className="space-y-4 rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <Preview b={d} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs text-zinc-400">العنوان (عربي) *</span>
          <input className={inputCls} value={d.titleAr} onChange={(e) => set({ titleAr: e.target.value })} />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-zinc-400">Title (English)</span>
          <input dir="ltr" className={inputCls} value={d.titleEn} onChange={(e) => set({ titleEn: e.target.value })} />
        </label>

        <label className="space-y-1">
          <span className="text-xs text-zinc-400">الوصف (عربي)</span>
          <input className={inputCls} value={d.subtitleAr} onChange={(e) => set({ subtitleAr: e.target.value })} />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-zinc-400">Subtitle (English)</span>
          <input dir="ltr" className={inputCls} value={d.subtitleEn} onChange={(e) => set({ subtitleEn: e.target.value })} />
        </label>

        <label className="space-y-1">
          <span className="text-xs text-zinc-400">نص الزر (عربي)</span>
          <input className={inputCls} value={d.ctaAr} onChange={(e) => set({ ctaAr: e.target.value })} />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-zinc-400">Button (English)</span>
          <input dir="ltr" className={inputCls} value={d.ctaEn} onChange={(e) => set({ ctaEn: e.target.value })} />
        </label>

        <label className="space-y-1">
          <span className="text-xs text-zinc-400">الرابط (href) *</span>
          <input dir="ltr" placeholder="/translate" className={inputCls} value={d.href} onChange={(e) => set({ href: e.target.value })} />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-zinc-400">الأيقونة (إيموجي)</span>
          <input dir="ltr" className={inputCls} value={d.emoji} onChange={(e) => set({ emoji: e.target.value })} />
        </label>
      </div>

      <div className="space-y-1">
        <span className="text-xs text-zinc-400">لون الخلفية</span>
        <div className="flex flex-wrap gap-2">
          {GRADIENT_PRESETS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => set({ gradient: g.value })}
              title={g.label}
              style={{ background: g.value }}
              className={`h-8 w-12 rounded-lg ring-2 ${
                d.gradient === g.value ? "ring-white" : "ring-transparent"
              }`}
            />
          ))}
        </div>
        <input dir="ltr" className={`${inputCls} mt-2 font-mono text-xs`} value={d.gradient} onChange={(e) => set({ gradient: e.target.value })} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={d.external} onChange={(e) => set({ external: e.target.checked })} />
          رابط خارجي (يفتح في تبويب جديد)
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={d.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
          مُفعّل
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => onSave(d)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {busy ? "جارٍ الحفظ…" : "حفظ"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}

export default function PromoBannersClient() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | "new" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/promo-banners", { cache: "no-store" });
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error || "تعذّر التحميل");
      setBanners(data.banners);
    } catch (e: any) {
      setError(e.message || "خطأ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createBanner(d: Draft) {
    setBusyId("new");
    try {
      const r = await fetch("/api/admin/promo-banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error || "تعذّر الإنشاء");
      setAdding(false);
      await load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function patchBanner(id: number, patch: Partial<Banner>) {
    const r = await fetch(`/api/admin/promo-banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await r.json();
    if (!r.ok || !data.ok) throw new Error(data.error || "تعذّر الحفظ");
    return data.banner as Banner;
  }

  async function saveEdit(id: number, d: Draft) {
    setBusyId(id);
    try {
      await patchBanner(id, d);
      setEditingId(null);
      await load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function toggleEnabled(b: Banner) {
    setBusyId(b.id);
    try {
      const updated = await patchBanner(b.id, { enabled: !b.enabled });
      setBanners((prev) => prev.map((x) => (x.id === b.id ? updated : x)));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function resetStats(b: Banner) {
    if (!confirm(`تصفير إحصاءات «${b.titleAr}»؟`)) return;
    setBusyId(b.id);
    try {
      const updated = await patchBanner(b.id, { resetStats: true } as any);
      setBanners((prev) => prev.map((x) => (x.id === b.id ? updated : x)));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function move(b: Banner, dir: -1 | 1) {
    const sorted = [...banners].sort((a, c) => a.sortOrder - c.sortOrder);
    const idx = sorted.findIndex((x) => x.id === b.id);
    const swapWith = sorted[idx + dir];
    if (!swapWith) return;
    setBusyId(b.id);
    try {
      await Promise.all([
        patchBanner(b.id, { sortOrder: swapWith.sortOrder }),
        patchBanner(swapWith.id, { sortOrder: b.sortOrder }),
      ]);
      await load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(b: Banner) {
    if (!confirm(`حذف الإعلان: «${b.titleAr}»؟`)) return;
    setBusyId(b.id);
    try {
      const r = await fetch(`/api/admin/promo-banners/${b.id}`, { method: "DELETE" });
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error || "تعذّر الحذف");
      await load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-zinc-400">جارٍ التحميل…</p>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* إضافة إعلان */}
      {adding ? (
        <BannerForm
          initial={emptyDraft()}
          busy={busyId === "new"}
          onSave={createBanner}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500"
        >
          + إضافة إعلان جديد
        </button>
      )}

      {banners.length === 0 && !adding ? (
        <p className="text-zinc-500">لا توجد إعلانات بعد.</p>
      ) : null}

      {/* القائمة */}
      <div className="space-y-4">
        {[...banners]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((b, i, arr) =>
            editingId === b.id ? (
              <BannerForm
                key={b.id}
                initial={b}
                busy={busyId === b.id}
                onSave={(d) => saveEdit(b.id, d)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                key={b.id}
                className={`rounded-xl border p-4 ${
                  b.enabled ? "border-zinc-800 bg-zinc-900" : "border-zinc-800 bg-zinc-900/40 opacity-60"
                }`}
              >
                <Preview b={b} />

                {/* إحصاءات الأداء */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-zinc-300" title="مرات الظهور">
                    👁 {b.impressions.toLocaleString("ar-EG")} ظهور
                  </span>
                  <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-zinc-300" title="النقرات">
                    🖱 {b.clicks.toLocaleString("ar-EG")} نقرة
                  </span>
                  <span
                    className="rounded-lg bg-indigo-600/20 px-2.5 py-1 font-medium text-indigo-300"
                    title="معدّل النقر = النقرات ÷ الظهور"
                  >
                    CTR{" "}
                    {b.impressions > 0
                      ? ((b.clicks / b.impressions) * 100).toFixed(1)
                      : "0.0"}
                    ٪
                  </span>
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => resetStats(b)}
                    className="rounded-lg border border-zinc-700 px-2.5 py-1 text-zinc-400 hover:bg-zinc-800"
                  >
                    تصفير
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => toggleEnabled(b)}
                    className={`rounded-lg px-3 py-1.5 font-medium ${
                      b.enabled
                        ? "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
                        : "bg-zinc-700/40 text-zinc-300 hover:bg-zinc-700/60"
                    }`}
                  >
                    {b.enabled ? "● مُفعّل" : "○ متوقّف"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => setEditingId(b.id)}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-200 hover:bg-zinc-800"
                  >
                    تعديل
                  </button>
                  <button
                    type="button"
                    disabled={busyId === b.id || i === 0}
                    onClick={() => move(b, -1)}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
                    title="تحريك لأعلى"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={busyId === b.id || i === arr.length - 1}
                    onClick={() => move(b, 1)}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
                    title="تحريك لأسفل"
                  >
                    ↓
                  </button>
                  <span className="text-xs text-zinc-500" dir="ltr">
                    {b.href}
                  </span>
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => remove(b)}
                    className="ms-auto rounded-lg bg-red-600/20 px-3 py-1.5 text-red-300 hover:bg-red-600/30"
                  >
                    حذف
                  </button>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
}

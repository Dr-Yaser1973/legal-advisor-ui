// app/admin/lawyer-approvals/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";

export const dynamic = "force-dynamic";

type Item = {
  userId: number;
  name: string;
  email: string;
  specialties: string | null;
  city: string | null;
  bio: string | null;
  pendingBio: string | null;
  currentAvatarUrl: string | null;
  pendingAvatarUrl: string | null;
  hasPendingBio: boolean;
  hasPendingAvatar: boolean;
};

type Stats = { total: number; bios: number; avatars: number };

export default function LawyerApprovalsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/lawyer-approvals", {
        cache: "no-store",
      });
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      const data = await res.json();
      setItems(data.items || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(
    userId: number,
    field: "bio" | "avatar",
    action: "approve" | "reject"
  ) {
    const key = `${userId}-${field}`;
    setBusy(key);
    try {
      const res = await fetch(`/api/admin/lawyer-approvals/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, action }),
      });
      if (res.ok) {
        await load(); // إعادة الجلب لتحديث القائمة
      } else {
        const d = await res.json();
        alert(d.error || "تعذّر تنفيذ القرار.");
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ غير متوقع.");
    } finally {
      setBusy(null);
    }
  }

  if (forbidden) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-right" dir="rtl">
        <h1 className="text-2xl font-bold mb-4">مراجعة تعديلات المحامين</h1>
        <p className="text-sm text-red-400">
          هذه الصفحة متاحة لمدير النظام (ADMIN) فقط.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right" dir="rtl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">مراجعة تعديلات المحامين</h1>
        <p className="text-sm text-zinc-400">
          التعديلات المعلّقة بانتظار موافقتك. كل عنصر يُراجع بشكل مستقل.
        </p>
      </header>

      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="طلبات معلّقة" value={stats.total} />
          <StatCard label="نبذات" value={stats.bios} />
          <StatCard label="صور" value={stats.avatars} />
        </div>
      )}

      {loading && (
        <p className="text-center text-zinc-400 py-8">جارٍ التحميل...</p>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-8 text-center text-sm text-zinc-400">
          لا توجد تعديلات معلّقة حالياً.
        </div>
      )}

      <div className="space-y-4">
        {items.map((it) => (
          <div
            key={it.userId}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          >
            {/* ترويسة المحامي */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
              <img
                src={it.currentAvatarUrl || "/default-lawyer.png"}
                alt={it.name}
                className="w-11 h-11 rounded-full object-cover border border-zinc-700"
              />
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-xs text-zinc-400">
                  {[it.specialties, it.city].filter(Boolean).join(" · ") ||
                    it.email}
                </div>
              </div>
            </div>

            {/* قسم النبذة */}
            {it.hasPendingBio && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">تعديل النبذة</span>
                  <span className="text-[11px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full">
                    معلّق
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <div className="border border-zinc-800 rounded-lg p-3">
                    <div className="text-[11px] text-zinc-500 mb-1">
                      الحالية (المعتمدة)
                    </div>
                    <div className="text-sm text-zinc-400 leading-relaxed">
                      {it.bio || "لا توجد نبذة سابقة."}
                    </div>
                  </div>
                  <div className="border border-emerald-500/40 bg-emerald-950/20 rounded-lg p-3">
                    <div className="text-[11px] text-emerald-400 mb-1">
                      الجديدة (المعلّقة)
                    </div>
                    <div className="text-sm text-emerald-100 leading-relaxed">
                      {it.pendingBio}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => decide(it.userId, "bio", "reject")}
                    disabled={busy === `${it.userId}-bio`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    رفض النبذة
                  </button>
                  <button
                    onClick={() => decide(it.userId, "bio", "approve")}
                    disabled={busy === `${it.userId}-bio`}
                    className="text-xs px-4 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {busy === `${it.userId}-bio`
                      ? "..."
                      : "اعتماد النبذة"}
                  </button>
                </div>
              </div>
            )}

            {/* قسم الصورة */}
            {it.hasPendingAvatar && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">تعديل الصورة</span>
                  <span className="text-[11px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full">
                    معلّق
                  </span>
                </div>
                <div className="flex items-center gap-5 mb-3">
                  <div className="text-center">
                    <img
                      src={it.currentAvatarUrl || "/default-lawyer.png"}
                      alt="الحالية"
                      className="w-16 h-16 rounded-full object-cover border border-zinc-700 mb-1"
                    />
                    <div className="text-[11px] text-zinc-500">الحالية</div>
                  </div>
                  <span className="text-zinc-600">←</span>
                  <div className="text-center">
                    <img
                      src={it.pendingAvatarUrl || "/default-lawyer.png"}
                      alt="المعلّقة"
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 mb-1"
                    />
                    <div className="text-[11px] text-emerald-400">
                      المعلّقة
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => decide(it.userId, "avatar", "reject")}
                    disabled={busy === `${it.userId}-avatar`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    رفض الصورة
                  </button>
                  <button
                    onClick={() => decide(it.userId, "avatar", "approve")}
                    disabled={busy === `${it.userId}-avatar`}
                    className="text-xs px-4 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {busy === `${it.userId}-avatar`
                      ? "..."
                      : "اعتماد الصورة"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
      <div className="text-xs text-zinc-400 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

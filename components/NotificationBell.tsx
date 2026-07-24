"use client";
// components/NotificationBell.tsx
// جرس الإشعارات: عدّاد غير المقروء + قائمة منسدلة + تعليم كمقروء.
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";

type Item = {
  id: number;
  title: string;
  body: string | null;
  readAt: string | null;
  createdAt: string;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "الآن";
  if (m < 60) return `قبل ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `قبل ${h} س`;
  const d = Math.floor(h / 24);
  if (d < 30) return `قبل ${d} ي`;
  return new Date(iso).toLocaleDateString("ar-IQ");
}

export default function NotificationBell() {
  const { status } = useSession();
  const [items, setItems] = useState<Item[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const d = await res.json();
      setItems(d.items || []);
      setUnread(d.unread || 0);
    } catch {
      /* تجاهل */
    }
  }, []);

  // تحميل أولي + استطلاع دوري (كل 60 ثانية) عند تسجيل الدخول
  useEffect(() => {
    if (status !== "authenticated") return;
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [status, load]);

  // إغلاق عند النقر خارج الصندوق
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function markAll() {
    setLoading(true);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
      setUnread(0);
    } finally {
      setLoading(false);
    }
  }

  async function openAndMark(id: number) {
    // تعليم إشعار واحد كمقروء عند النقر
    setItems((prev) =>
      prev.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: new Date().toISOString() } : n))
    );
    setUnread((u) => Math.max(0, u - 1));
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }

  // لا نعرض الجرس لغير المسجّلين
  if (status !== "authenticated") return null;

  return (
    <div className="relative" ref={boxRef} dir="rtl">
      <button
        onClick={() => { setOpen((v) => !v); if (!open) load(); }}
        className="relative rounded-full border border-zinc-700 p-1.5 text-zinc-300 hover:bg-zinc-800 transition"
        aria-label="الإشعارات"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -left-1 min-w-[16px] h-[16px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 max-w-[90vw] rounded-2xl border border-white/10 bg-zinc-950 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span className="text-sm font-semibold text-zinc-200">الإشعارات</span>
            {unread > 0 && (
              <button
                onClick={markAll}
                disabled={loading}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline disabled:opacity-50"
              >
                <Check className="w-3 h-3" /> تعليم الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-xs text-zinc-500">
                لا توجد إشعارات.
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openAndMark(n.id)}
                  className={`w-full text-right px-4 py-3 hover:bg-zinc-900/60 transition flex gap-2 ${
                    n.readAt ? "opacity-60" : ""
                  }`}
                >
                  {!n.readAt && (
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  )}
                  <span className={`flex-1 ${n.readAt ? "mr-3.5" : ""}`}>
                    <span className="block text-xs font-semibold text-zinc-200">{n.title}</span>
                    {n.body && (
                      <span className="block text-[11px] text-zinc-400 mt-0.5 line-clamp-2">
                        {n.body}
                      </span>
                    )}
                    <span className="block text-[10px] text-zinc-600 mt-1">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

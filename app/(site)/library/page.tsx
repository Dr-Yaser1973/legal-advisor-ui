 "use client";

import { useEffect, useState } from "react";
import LawCard from "./_components/LawCard";

/* =========================
   الأنواع
========================= */
type TabKey = "ALL" | "LAW" | "FIQH" | "ACADEMIC_STUDY";

type LawUnit = {
  id: number;
  title: string;
   category: "LAW" | "FIQH" | "ACADEMIC_STUDY";
   status: "PUBLISHED" | "DRAFT" | "ARCHIVED";

  pdfUrl?: string | null;
  hasText?: boolean;
  isScanned?: boolean;
  createdAt: string;
};

export default function LibraryPage() {
  const [docs, setDocs] = useState<LawUnit[]>([]);
  const [tab, setTab] = useState<TabKey>("ALL");
  const [loading, setLoading] = useState(true);

  /* =========================
     جلب البيانات
  ========================= */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/library", {
          cache: "no-store",
        });
        const json = await res.json();
        setDocs(Array.isArray(json?.docs) ? json.docs : []);
      } catch (e) {
        console.error("Library fetch error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* =========================
     التبويبات
  ========================= */
  const tabs: { key: TabKey; label: string }[] = [
    { key: "ALL", label: "الكل" },
    { key: "LAW", label: "قوانين" },
    { key: "FIQH", label: "كتب فقه" },
    { key: "ACADEMIC_STUDY", label: "دراسات أكاديمية" },
  ];

  const filtered =
    tab === "ALL"
      ? docs
      : docs.filter((d) => d.category === tab);

  return (
    <main className="p-6 space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold text-zinc-100">
        المكتبة القانونية
      </h1>

      {/* ================= التبويبات ================= */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        {tabs.map((t) => {
          const active = tab === t.key;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm transition border
                ${
                  active
                    ? "border-emerald-500 bg-emerald-900/30 text-emerald-300"
                    : "border-zinc-700 text-zinc-300 hover:border-emerald-500 hover:text-emerald-400"
                }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ================= المحتوى ================= */}
      {loading ? (
        <p className="text-center text-zinc-400">
          جارٍ تحميل المكتبة...
        </p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((unit) => (
            <LawCard key={unit.id} unit={unit} />
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-400">
          لا توجد مواد في هذا التصنيف
        </p>
      )}
    </main>
  );
}

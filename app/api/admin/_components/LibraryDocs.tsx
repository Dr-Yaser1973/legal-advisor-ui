 "use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Doc = {
  id: number;
  title: string;
  category: string;
  jurisdiction: string;
  year?: number | null;
  filePath?: string | null;
  createdAt: string;
};

export default function LibraryDocs({ isAdmin }: { isAdmin: boolean }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function load() {
    try {
      setLoading(true);
      // توقع أن API يعيد { docs: Doc[] }
      const res = await fetch("/api/library/list", { cache: "no-store" });
      const data = await res.json();
      setDocs(Array.isArray(data.docs) ? data.docs : []);
    } catch (e) {
      console.error(e);
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    const doc = docs.find((d) => d.id === id);
    const label = doc?.title || `#${id}`;
    if (!confirm(`هل تريد حذف المستند: ${label}؟\nلا يمكن التراجع عن هذه العملية.`)) return;

    setDeletingId(id);
    try {
      // واجهة حذف المكتبة (نوصي بـ DELETE وبودي JSON)
      const res = await fetch("/api/library/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId: id }),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "فشل الحذف");
      }

      // حدث الحالة محليًا ثم أنعش الصفحة
      setDocs((prev) => prev.filter((d) => d.id !== id));
      startTransition(() => router.refresh());
      alert("✓ تم حذف المستند بنجاح");
    } catch (e: any) {
      alert("حدث خطأ أثناء الحذف: " + (e?.message || "غير معروف"));
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="text-sm text-zinc-400">جاري التحميل…</div>;
  }

  if (!docs.length) {
    return <div className="text-sm text-zinc-400">لا توجد مستندات مرفوعة بعد</div>;
  }

  return (
    <div className="space-y-3">
      {docs.map((d) => (
        <div
          key={d.id}
          className="flex justify-between items-center border border-white/10 rounded-xl p-3 bg-zinc-900/40"
        >
          <div>
            <div className="font-medium">{d.title}</div>
            <div className="text-xs opacity-70">
              {d.category} • {d.jurisdiction} {d.year ? `• ${d.year}` : ""} •{" "}
              {new Date(d.createdAt).toLocaleDateString("ar-IQ")}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {d.filePath && (
              <a
                href={d.filePath}
                target="_blank"
                rel="noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-sm"
              >
                فتح PDF
              </a>
            )}
            <a
              href={`/library/${d.id}`}
              className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-sm"
              title="تفاصيل الوثيقة"
            >
              تفاصيل
            </a>

            {/* زر الحذف للأدمن فقط */}
            {isAdmin && (
              <button
                onClick={() => handleDelete(d.id)}
                disabled={deletingId === d.id || isPending}
                className="bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded-lg text-sm text-white disabled:opacity-60"
                title="حذف المستند"
              >
                {deletingId === d.id ? "جارِ الحذف…" : "حذف"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

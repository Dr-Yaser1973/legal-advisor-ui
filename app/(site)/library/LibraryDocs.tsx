 
 "use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Doc = {
  id: number;
  title: string | null;
  filename: string;
  size: number;
  createdAt: string;
};

// ✅ أضفنا isAdmin كخاصية اختيارية
export default function LibraryDocs({ isAdmin = false }: { isAdmin?: boolean }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/docs/list", { cache: "no-store" });
    const data = await res.json();
    setDocs(data.docs ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!isAdmin) return; // حارس إضافي في الواجهة
    const doc = docs.find(d => d.id === id);
    const label = doc?.title || doc?.filename || `#${id}`;
    if (!confirm(`هل تريد حذف المستند: ${label}؟\nلا يمكن التراجع عن هذه العملية.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/docs/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "فشل الحذف");

      setDocs(prev => prev.filter(d => d.id !== id));
      startTransition(() => router.refresh());
      alert("✓ تم حذف المستند بنجاح");
    } catch (e: any) {
      alert("حدث خطأ أثناء الحذف: " + e.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <div className="text-sm text-zinc-400">جارِ التحميل…</div>;
  if (!docs.length) return <div className="text-sm text-zinc-400">لا توجد مستندات مرفوعة بعد</div>;

  return (
    <ul className="space-y-2">
      {docs.map(doc => (
        <li
          key={doc.id}
          className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2"
        >
          <div className="min-w-0">
            <div className="truncate font-medium">{doc.title || doc.filename}</div>
            <div className="text-xs text-zinc-400">
              {new Date(doc.createdAt).toLocaleString()} • {(doc.size / (1024 * 1024)).toFixed(2)} MB
            </div>
          </div>

          {/* ✅ أظهر زر الحذف فقط للأدمن */}
          {isAdmin && (
            <button
              onClick={() => handleDelete(doc.id)}
              disabled={deletingId === doc.id || isPending}
              className="ml-3 inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              title="حذف المستند"
            >
              {deletingId === doc.id ? "جارِ الحذف…" : "حذف"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

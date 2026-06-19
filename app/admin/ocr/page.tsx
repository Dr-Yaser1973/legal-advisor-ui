 // app/admin/ocr/page.tsx
"use client";

import { useEffect, useState } from "react";
import OcrRunButton from "./_components/OcrRunButton";

type Doc = {
  id: number;
  title: string | null;
  filename: string | null;
  ocrStatus: "NONE" | "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
};

const STATUS_STYLES: Record<string, string> = {
  NONE: "bg-zinc-700 text-zinc-200",
  PENDING: "bg-blue-900 text-blue-300",
  PROCESSING: "bg-yellow-900 text-yellow-300",
  COMPLETED: "bg-emerald-900 text-emerald-300",
  FAILED: "bg-red-900 text-red-300",
};

export default function AdminOcrPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ocr/documents");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "فشل تحميل المستندات");
      setDocs(data.items || []);
    } catch (e: any) {
      setError(e?.message || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8 space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-red-500">
        لوحة إدارة OCR — نسخة جديدة
      </h1>

      <p className="text-sm text-zinc-400">
        إجمالي المستندات: {docs.length}
      </p>

      {error && (
        <div className="rounded-lg bg-red-950 border border-red-800 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-zinc-400">تحميل المستندات...</div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-x-auto">
           <table className="w-full text-sm text-right table-fixed">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="p-3 text-right w-16">ID</th>
                <th className="p-3 text-right">الملف</th>
                <th className="p-3 text-right w-32">الحالة</th>
                <th className="p-3 text-right w-48">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900/40"
                >
                  <td className="p-3 text-zinc-400">{doc.id}</td>
                  <td className="p-3 text-zinc-100">
                    {doc.title || doc.filename || "—"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        STATUS_STYLES[doc.ocrStatus] || STATUS_STYLES.NONE
                      }`}
                    >
                      {doc.ocrStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <OcrRunButton documentId={doc.id} onDone={load} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
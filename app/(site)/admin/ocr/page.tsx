 "use client";

import { useEffect, useState } from "react";
 import OcrRunButton from "./_components/OcrRunButton";


type Doc = {
  id: number;
  title: string | null;
  filename: string | null;
  ocrStatus: "NONE" | "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  kind: string;
  updatedAt: string;
};

export default function AdminOcrPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/ocr/documents");
    const data = await res.json();
    setDocs(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">
        لوحة إدارة OCR
      </h1>

      {loading ? (
        <div className="text-zinc-400">تحميل المستندات...</div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">الملف</th>
                <th className="p-3 text-left">الحالة</th>
                <th className="p-3 text-left">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900/40"
                >
                  <td className="p-3 text-zinc-400">
                    {doc.id}
                  </td>

                  <td className="p-3">
                    {doc.title || doc.filename}
                  </td>

                  <td className="p-3">
                    <StatusBadge status={doc.ocrStatus} />
                  </td>

                  <td className="p-3">
                     <OcrRunButton
  documentId={doc.id}
  onDone={load}
/>
  /
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

// ===============================
// Status Badge
// ===============================
function StatusBadge({ status }: { status: string }) {
  const map: any = {
    NONE: "bg-zinc-700 text-zinc-200",
    PENDING: "bg-blue-900 text-blue-300",
    PROCESSING: "bg-yellow-900 text-yellow-300",
    COMPLETED: "bg-emerald-900 text-emerald-300",
    FAILED: "bg-red-900 text-red-300",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

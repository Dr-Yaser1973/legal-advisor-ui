"use client";

import { useEffect, useState } from "react";
import PdfViewer from "./PdfViewer";

export default function PdfPreview({ docId }: { docId: number }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/library/${docId}/pdf`)
      .then((r) => r.json())
      .then((d) => {
        setUrl(d.url || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [docId]);

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-gray-400">
        جارِ تحميل المعاينة…
      </div>
    );
  }

  if (!url) {
    return (
      <div className="w-full p-4 text-center text-red-400 border rounded">
        لا يوجد ملف PDF لهذا القانون
      </div>
    );
  }

  return <PdfViewer src={url} />;
}


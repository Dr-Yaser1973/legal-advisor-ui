 "use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";

type Props = {
  documentId: number;
  onDone?: () => void;
};

export default function OcrRunButton({
  documentId,
  onDone,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function runOCR() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/ocr/enqueue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId, // 🔴 هذا مهم — API لا يقبل limit
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "فشل إرسال المهمة إلى محرك OCR");
      }

      setMsg("تم إرسال المستند إلى الطابور بنجاح");
      if (onDone) onDone();
    } catch (e: any) {
      setMsg(e.message || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={runOCR}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Play className="h-3 w-3" />
        )}
        تشغيل OCR
      </button>

      {msg && (
        <span className="text-xs text-zinc-400">
          {msg}
        </span>
      )}
    </div>
  );
}

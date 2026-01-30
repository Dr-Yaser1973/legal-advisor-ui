"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";

export default function OcrButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function runOCR() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/ocr/enqueue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 3 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تشغيل OCR");
      }

      setMsg(`تم إرسال ${data.queued} مستند إلى محرك OCR`);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={runOCR}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        تشغيل OCR
      </button>

      {msg && (
        <div className="text-sm text-zinc-300 bg-zinc-900 px-3 py-2 rounded-lg">
          {msg}
        </div>
      )}
    </div>
  );
}


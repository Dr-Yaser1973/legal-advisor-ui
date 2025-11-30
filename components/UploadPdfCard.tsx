
"use client";
import { useState, useRef } from "react";

export default function UploadPdfCard() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onUpload() {
    if (!file) { setStatus("❗️اختر ملف PDF أولاً"); return; }
    setBusy(true);
    setStatus("⏳ جاري الرفع والفهرسة...");
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (title) fd.append("title", title);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setStatus(`⚠️ خطأ: ${json.error || "فشل الرفع"}`);
      } else {
        setStatus(`✅ تم: المستند #${json.documentId} — المقاطع: ${json.chunks}`);
        setFile(null);
        setTitle("");
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch (e: any) {
      setStatus(`⚠️ استثناء: ${e.message || e.toString()}`);
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.includes("pdf")) {
      setFile(f);
      setStatus(`مُختار: ${f.name}`);
    } else {
      setStatus("❗️يرجى إسقاط ملف PDF فقط");
    }
  }

  return (
    <div className="max-w-xl w-full rounded-2xl shadow p-6 border bg-white/70 dark:bg-zinc-900/60">
      <h2 className="text-lg font-bold mb-4">رفع ملف PDF إلى المكتبة</h2>

      <label className="block text-sm mb-2">عنوان المستند (اختياري)</label>
      <input
        className="border rounded w-full p-2 mb-4 bg-white dark:bg-zinc-800"
        placeholder="مثال: الدستور العراقي 2005"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mb-3 bg-white dark:bg-zinc-800"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {file ? (
          <div className="text-sm">📄 {file.name}</div>
        ) : (
          <div className="text-sm text-zinc-600">
            اسحب وأفلت ملف PDF هنا أو انقر للاختيار
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (!f.type.includes("pdf")) { setStatus("❗️PDF فقط"); return; }
          setFile(f);
          setStatus(`مُختار: ${f.name}`);
        }}
      />

      <button
        onClick={onUpload}
        disabled={busy}
        className="mt-2 px-4 py-2 rounded-2xl bg-blue-600 text-white disabled:opacity-60"
      >
        {busy ? "جارِ الرفع..." : "رفع وفهرسة"}
      </button>

      {status && <p className="mt-3 text-sm">{status}</p>}

      <p className="mt-4 text-xs text-zinc-500">
        ملاحظة: يدعم PDF النصّي. للملفات المصوّرة نضيف OCR لاحقًا.
      </p>
    </div>
  );
}

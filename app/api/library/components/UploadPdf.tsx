
"use client";
import { useState } from "react";

export default function UploadPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  async function onUpload() {
    if (!file) { setStatus("اختر ملف PDF"); return; }
    setStatus("جاري الرفع والفهرسة...");
    const fd = new FormData();
    fd.append("file", file);
    if (title) fd.append("title", title);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) setStatus(`خطأ: ${json.error || "فشل"}`);
    else setStatus(`تم: المستند #${json.documentId} — عدد المقاطع ${json.chunks}`);
  }

  return (
    <div className="space-y-3">
      <input className="border rounded p-2 w-full" placeholder="عنوان المستند (اختياري)"
             value={title} onChange={(e)=>setTitle(e.target.value)} />
      <input type="file" accept="application/pdf"
             onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <button onClick={onUpload} className="px-4 py-2 rounded bg-blue-600 text-white">
        رفع وفهرسة
      </button>
      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}

 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AttachDocument({ caseId }: { caseId: number }) {
  const router = useRouter();
  const [documentId, setDocumentId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAttach(e: React.FormEvent) {
    e.preventDefault();
    const idNum = Number(documentId);
    if (!documentId || Number.isNaN(idNum) || idNum <= 0) {
      alert("يرجى إدخال رقم مستند صحيح (documentId) موجود في قاعدة البيانات.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/cases/${caseId}/attach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: idNum }),
      });

      if (!res.ok) {
        console.error("failed to attach document");
        alert("فشل في ربط المستند بالقضية.");
        return;
      }

      setDocumentId("");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("حدث خطأ غير متوقع أثناء ربط المستند.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleAttach}
      className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 flex flex-col gap-2 text-xs"
    >
      <h3 className="font-semibold text-sm mb-1">ربط مستند بالقضية</h3>
      <input
        type="number"
        min={1}
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
        placeholder="رقم المستند (documentId) في قاعدة البيانات"
        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-2 py-1.5 text-xs focus:outline-none focus:ring focus:ring-emerald-500/60"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium hover:bg-blue-500 disabled:opacity-60 transition"
      >
        ربط المستند
      </button>
      <p className="text-[10px] text-zinc-500">
        لاحقًا يمكن استبدال هذا الحقل بواجهة اختيار ملفات من مكتبة المستندات.
      </p>
    </form>
  );
}

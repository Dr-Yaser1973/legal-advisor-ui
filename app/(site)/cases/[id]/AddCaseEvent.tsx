 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddCaseEvent({ caseId }: { caseId: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      alert("يرجى إدخال عنوان الحدث (مثال: جلسة مرافعة، قرار، تأجيل...).");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/cases/${caseId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          note: note.trim() || null,
        }),
      });

      if (!res.ok) {
        console.error("failed to add event");
        alert("فشل في إضافة الحدث إلى القضية.");
        return;
      }

      setTitle("");
      setNote("");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("حدث خطأ غير متوقع أثناء إضافة الحدث.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 flex flex-col gap-2 text-xs"
    >
      <h3 className="font-semibold text-sm mb-1">إضافة حدث جديد</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="عنوان الحدث (جلسة، قرار، تبليغ...)"
        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-2 py-1.5 text-xs focus:outline-none focus:ring focus:ring-emerald-500/60"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="ملاحظات حول هذا الحدث (اختياري)..."
        className="w-full min-h-[60px] rounded-xl border border-white/10 bg-zinc-950 px-2 py-1.5 text-xs focus:outline-none focus:ring focus:ring-emerald-500/60"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium hover:bg-emerald-500 disabled:opacity-60 transition"
      >
        حفظ الحدث
      </button>
    </form>
  );
}

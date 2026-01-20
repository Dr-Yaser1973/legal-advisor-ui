 "use client";

import { useTransition } from "react";

export default function DeleteDocButton({
  id,
  soft = false,
}: {
  id: number;
  soft?: boolean;
}) {
  const [pending, start] = useTransition();

  function onDelete() {
    const msg = soft
      ? "هل أنت متأكد من أرشفة هذا القانون؟ يمكن استعادته لاحقًا."
      : "⚠️ هل أنت متأكد من الحذف النهائي؟ سيتم حذف القانون وجميع ملفاته وروابطه نهائيًا.";

    if (!confirm(msg)) return;

    start(async () => {
      const res = await fetch("/api/library/delete", {
        method: "DELETE", // ✅ الطريقة الصحيحة
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: id,     // ✅ الاسم الصحيح الذي يتوقعه الـ API
          soft,         // true = أرشفة / false = حذف نهائي
        }),
      });

      const json = await res.json().catch(() => ({} as any));

      if (!res.ok || !json.ok) {
        alert(json.error || "فشل حذف القانون.");
        return;
      }

      // نجاح الحذف
      window.location.reload();
    });
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="text-xs px-3 py-1 rounded-lg border border-red-500 text-red-300 hover:bg-red-900/30 disabled:opacity-60"
      title={soft ? "أرشفة القانون" : "حذف القانون نهائيًا"}
    >
      {soft ? "أرشفة" : "حذف"}
    </button>
  );
}

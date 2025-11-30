 "use client";

import { useTransition } from "react";

export default function DeleteDocButton({ id }: { id: number }) {
  const [pending, start] = useTransition();

  function onDelete() {
    if (!confirm("هل أنت متأكد من حذف هذا المصدر وجميع مواده؟")) return;

    start(async () => {
      const res = await fetch("/api/library/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // ✅ نرسل id في الـ body كما يتوقع الـ API
      });

      const json = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        alert(json.error || "فشل حذف المصدر.");
        return;
      }

      // نجاح الحذف
      // يمكنك استخدام router.refresh بدل reload لو أحببت، لكن reload أبسط
      window.location.reload();
    });
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="text-xs px-3 py-1 rounded-lg border border-red-500 text-red-300 hover:bg-red-900/30 disabled:opacity-60"
    >
      حذف
    </button>
  );
}

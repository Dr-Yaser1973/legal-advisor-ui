"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ReindexButton({ docId }: { docId: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleClick() {
    const confirmed = confirm("هل تريد إعادة فهرسة المواد لهذا المصدر؟");
    if (!confirmed) return;

    const res = await fetch("/api/library/reindex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docId,
        mode: "text+articles",
      }),
    });

    if (res.ok) {
      alert("تمت إعادة بناء المواد من النص / PDF.");
      // تحديث الصفحة بعد التنفيذ (اختياري)
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert("حدث خطأ أثناء إعادة الفهرسة.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs px-3 py-1 rounded-lg border border-emerald-500 text-emerald-300 hover:bg-emerald-900/30 disabled:opacity-50"
      disabled={isPending}
    >
      {isPending ? "جارٍ المعالجة..." : "إعادة فهرسة المواد"}
    </button>
  );
}


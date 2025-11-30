// app/admin/ApproveUserButton.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: number;
}

export function ApproveUserButton({ userId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleApprove = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}/approve`, {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
          setError(data.error || "تعذر تفعيل الحساب");
          return;
        }

        // إعادة تحميل بيانات الصفحة من السيرفر
        router.refresh();
      } catch (e) {
        console.error(e);
        setError("حدث خطأ غير متوقع");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleApprove}
        disabled={pending}
        className="px-3 py-1 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
      >
        {pending ? "جارٍ التفعيل..." : "تفعيل الحساب"}
      </button>
      {error && (
        <span className="text-[10px] text-red-400">{error}</span>
      )}
    </div>
  );
}


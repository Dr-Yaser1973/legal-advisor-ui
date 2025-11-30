 "use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  documentId: number | null;   // 👈 صار يقبل null أيضًا
  targetLang: "AR" | "EN";
}

export function RequestOfficialTranslationButton({
  documentId,
  targetLang,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleClick() {
    // 👈 تحقق من وجود documentId قبل الانتقال
    if (!documentId || documentId <= 0) {
      alert(
        "يجب أولًا رفع الملف المطلوب ترجمته واستخراج النص ليتم حفظه في النظام، ثم يمكنك الانتقال إلى صفحة مكاتب الترجمة المعتمدة."
      );
      return;
    }

    setLoading(true);

    const params = new URLSearchParams();
    params.set("doc", String(documentId));
    params.set("lang", targetLang);

    router.push(`/translation/offices?${params.toString()}`);
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-sm"
    >
      {loading
        ? "جارٍ فتح قائمة مكاتب الترجمة..."
        : "طلب ترجمة رسمية من مكتب ترجمة معتمد"}
    </button>
  );
}

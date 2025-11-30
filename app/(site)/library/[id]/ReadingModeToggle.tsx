"use client";

import { useEffect, useState } from "react";

export default function ReadingModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      document.body.classList.add("reading-mode");
    } else {
      document.body.classList.remove("reading-mode");
    }

    // تنظيف عند مغادرة الصفحة أو إلغاء التفعيل
    return () => {
      document.body.classList.remove("reading-mode");
    };
  }, [enabled]);

  return (
    <button
      type="button"
      onClick={() => setEnabled((v) => !v)}
      className="
        px-4 py-2 rounded-xl
        bg-emerald-600 hover:bg-emerald-700
        text-white text-sm
        whitespace-nowrap
      "
    >
      {enabled ? "إيقاف وضع القراءة" : "📖 وضع القراءة"}
    </button>
  );
}


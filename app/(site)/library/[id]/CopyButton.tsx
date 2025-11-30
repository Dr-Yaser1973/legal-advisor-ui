
// app/(site)/library/[id]/CopyButton.tsx
"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
    >
      {copied ? "تم النسخ ✅" : "نسخ النص الكامل 📋"}
    </button>
  );
}

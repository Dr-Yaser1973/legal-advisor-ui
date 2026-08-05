"use client";

// app/(site)/blog/[slug]/ShareButtons.tsx
// أزرار مشاركة المقال على وسائل التواصل الاجتماعي.
// الوضع الكامل (full) يُستخدم داخل صفحة المقال، والوضع المضغوط (compact) داخل بطاقات القائمة.
import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";

export default function ShareButtons({
  url,
  title,
  compact = false,
}: {
  url: string;
  title: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const e = encodeURIComponent;

  const platforms = [
    {
      name: "واتساب",
      href: `https://wa.me/?text=${e(`${title} ${url}`)}`,
      color: "hover:bg-emerald-900/40 hover:text-emerald-300",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${e(title)}&url=${e(url)}`,
      color: "hover:bg-zinc-700 hover:text-white",
    },
    {
      name: "فيسبوك",
      href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}`,
      color: "hover:bg-blue-900/40 hover:text-blue-300",
    },
    {
      name: "لينكدإن",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}`,
      color: "hover:bg-sky-900/40 hover:text-sky-300",
    },
    {
      name: "تليجرام",
      href: `https://t.me/share/url?url=${e(url)}&text=${e(title)}`,
      color: "hover:bg-cyan-900/40 hover:text-cyan-300",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* بعض المتصفحات تمنع النسخ بدون HTTPS */
    }
  }

  // ============ الوضع المضغوط (بطاقات القائمة) ============
  if (compact) {
    // في القائمة نكتفي بمنصّات قليلة + نسخ الرابط لتبقى البطاقة نظيفة
    const compactSet = platforms.filter((p) =>
      ["واتساب", "X", "تليجرام"].includes(p.name)
    );
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-zinc-500 ml-1">شارك:</span>
        {compactSet.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(ev) => ev.stopPropagation()}
            className={`text-[11px] px-2 py-1 rounded-full transition bg-zinc-800/70 text-zinc-400 ${p.color}`}
          >
            {p.name}
          </a>
        ))}
        <button
          type="button"
          onClick={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            copyLink();
          }}
          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full transition bg-zinc-800/70 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          aria-label="نسخ الرابط"
        >
          {copied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
          {copied ? "نُسخ" : "نسخ"}
        </button>
      </div>
    );
  }

  // ============ الوضع الكامل (صفحة المقال) ============
  return (
    <div className="mt-8 pt-6 border-t border-zinc-800">
      <div className="flex items-center gap-2 mb-3 text-sm text-zinc-400">
        <Share2 className="w-4 h-4" />
        <span>شارك المقال</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full transition ${p.color}`}
          >
            {p.name}
          </a>
        ))}

        <button
          type="button"
          onClick={copyLink}
          className="flex items-center gap-1 text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full transition hover:bg-zinc-700 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" /> تم النسخ
            </>
          ) : (
            <>
              <Link2 className="w-3.5 h-3.5" /> نسخ الرابط
            </>
          )}
        </button>
      </div>
    </div>
  );
}

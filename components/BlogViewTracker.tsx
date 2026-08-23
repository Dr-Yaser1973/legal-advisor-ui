// components/BlogViewTracker.tsx
"use client";

import { useEffect } from "react";

// يسجّل مشاهدة مقال واحدة لكل جلسة متصفّح (لكل slug على حدة).
// خفيف: beacon واحد fire-and-forget، لا يعرض شيئاً.
export default function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;

    const key = `__bv_${slug}`;
    try {
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");
    } catch {
      // بعض المتصفّحات الخاصة قد تمنع sessionStorage — نتابع بلا حماية التكرار
    }

    const url = `/api/blog/posts/${encodeURIComponent(slug)}/view`;
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url);
        return;
      }
    } catch {
      /* fallback أدناه */
    }
    fetch(url, { method: "POST", keepalive: true }).catch(() => {});
  }, [slug]);

  return null;
}

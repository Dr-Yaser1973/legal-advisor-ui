// components/VisitTracker.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// يسجّل زيارة واحدة لكل جلسة متصفّح مع مصدرها (Referrer + UTM).
// خفيف جداً: طلب واحد fire-and-forget، لا يعيد التصيير ولا يعرض شيئاً.
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // لا نتتبّع الأدمن/الدخول
    if (/^\/(admin|login|register)/.test(pathname || "")) return;

    // مرّة واحدة لكل جلسة
    try {
      if (sessionStorage.getItem("__vt") === "1") return;
      sessionStorage.setItem("__vt", "1");
    } catch {
      // في بعض المتصفّحات الخاصة قد يفشل sessionStorage — نتابع بلا حماية التكرار
    }

    const params = new URLSearchParams(window.location.search);
    const payload = {
      referrer: document.referrer || null,
      path: window.location.pathname || "/",
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    };

    const body = JSON.stringify(payload);
    // sendBeacon أفضل: لا يتأخّر ولا يُلغى عند مغادرة الصفحة
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track/visit", new Blob([body], { type: "application/json" }));
        return;
      }
    } catch {
      /* fallback أدناه */
    }
    fetch("/api/track/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
    // نريده مرّة واحدة فقط عند أول تحميل للجلسة
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

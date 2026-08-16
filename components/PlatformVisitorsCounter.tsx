// components/PlatformVisitorsCounter.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { getCommon } from "@/lib/i18n";
import { DEFAULT_LOCALE, dirFor, type Locale } from "@/lib/i18n/config";

export default function PlatformVisitorsCounter({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const [target, setTarget] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  // جلب الرقم الحقيقي + تحديث دوري كل 30 ثانية
  useEffect(() => {
    let active = true;

    async function fetchViews() {
      try {
        const res = await fetch("/api/library/views");
        const data = await res.json();
        if (active && data?.ok) setTarget(data.totalViews);
      } catch {
        /* صامت */
      }
    }

    fetchViews();
    const interval = setInterval(fetchViews, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // أنيميشن العدّ التصاعدي عند تغيّر الهدف
  useEffect(() => {
    if (target === null) return;
    const start = display;
    const end = target;
    if (start === end) return;

    const duration = 1200;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // تباطؤ ناعم في النهاية
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const c = getCommon(locale);

  if (target === null) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-zinc-300">
        <span className="animate-pulse">{c.actions.loading}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-center gap-1" dir={dirFor(locale)}>
      <span className="text-4xl font-bold tabular-nums text-emerald-400">
        {/* الأرقام الهندية (٥,٥٤٧) للعربية فقط — الإنجليزية تستخدم 5,547 */}
        {display.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
      </span>
      <span className="text-sm text-zinc-300">{c.stats.visitors}</span>
    </div>
  );
}

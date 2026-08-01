"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { promoBanners } from "@/data/promoBanners";

const ROTATE_MS = 5000;

export default function PromoBanner({
  lang = "ar",
  className = "",
}: {
  lang?: "ar" | "en";
  className?: string;
}) {
  const items = useMemo(() => promoBanners.filter((b) => b.enabled), []);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // تبديل تلقائي بين الشرائح (يتوقف عند المرور بالماوس أو مع تقليل الحركة)
  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [items.length, paused]);

  // إعادة الفهرس لحدوده لو قلّ عدد الإعلانات بعد التعديل
  useEffect(() => {
    if (index > items.length - 1) setIndex(0);
  }, [items.length, index]);

  if (items.length === 0) return null;

  return (
    <div
      dir={dir}
      className={`relative w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={lang === "ar" ? "إعلانات المنصة" : "Platform promotions"}
    >
      <div className="relative min-h-[92px] sm:min-h-[104px]">
        {items.map((b, i) => {
          const c = b[lang];
          const active = i === index;
          return (
            <Link
              key={b.id}
              href={b.href}
              target={b.external ? "_blank" : undefined}
              rel={b.external ? "noopener noreferrer" : undefined}
              aria-hidden={!active}
              tabIndex={active ? 0 : -1}
              style={{ background: b.gradient }}
              className={`group absolute inset-0 flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-8 sm:py-5 transition-opacity duration-700 ease-in-out ${
                active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* لمعة ضوئية متحركة تمرّ عبر البطاقة */}
              <span className="promo-sheen pointer-events-none absolute inset-0" aria-hidden />

              <span className="promo-float shrink-0 text-3xl sm:text-4xl drop-shadow-sm">
                {b.emoji}
              </span>

              <div className="min-w-0 flex-1 text-white">
                <div className="text-sm sm:text-xl font-extrabold leading-tight drop-shadow-sm">
                  {c.title}
                </div>
                <div className="mt-0.5 hidden text-xs text-white/85 line-clamp-1 sm:block sm:text-sm">
                  {c.subtitle}
                </div>
              </div>

              <span className="promo-glow inline-flex shrink-0 items-center gap-1 rounded-xl bg-white/95 px-3 py-2 text-xs font-bold text-zinc-900 shadow transition-transform group-hover:scale-105 sm:px-4 sm:text-sm">
                {c.cta}
                <span className="transition-transform group-hover:-translate-x-1">
                  {dir === "rtl" ? "←" : "→"}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* نقاط التنقّل */}
      {items.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
          {items.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={
                (lang === "ar" ? "إعلان " : "Slide ") + (i + 1)
              }
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

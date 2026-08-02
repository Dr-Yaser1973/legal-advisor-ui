"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { promoBanners as fallbackConfig } from "@/data/promoBanners";
import { trackPromo } from "@/lib/trackPromo";

const ROTATE_MS = 5000;

type Slide = {
  id: string | number;
  href: string;
  external?: boolean;
  emoji: string;
  gradient: string;
  ar: { title: string; subtitle: string; cta: string };
  en: { title: string; subtitle: string; cta: string };
};

// شكل السجل القادم من /api/promo-banners (حقول مسطّحة)
type ApiBanner = {
  id: number;
  href: string;
  external: boolean;
  emoji: string;
  gradient: string;
  titleAr: string;
  subtitleAr: string;
  ctaAr: string;
  titleEn: string;
  subtitleEn: string;
  ctaEn: string;
};

function fromApi(b: ApiBanner): Slide {
  return {
    id: b.id,
    href: b.href,
    external: b.external,
    emoji: b.emoji,
    gradient: b.gradient,
    ar: { title: b.titleAr, subtitle: b.subtitleAr, cta: b.ctaAr },
    en: {
      title: b.titleEn || b.titleAr,
      subtitle: b.subtitleEn || b.subtitleAr,
      cta: b.ctaEn || b.ctaAr,
    },
  };
}

// احتياط: قائمة الملف الثابت (تُستخدم لو فشل الجلب من القاعدة)
const FALLBACK: Slide[] = fallbackConfig
  .filter((b) => b.enabled)
  .map((b) => ({
    id: b.id,
    href: b.href,
    external: b.external,
    emoji: b.emoji,
    gradient: b.gradient,
    ar: b.ar,
    en: b.en,
  }));

export default function PromoBanner({
  lang = "ar",
  className = "",
}: {
  lang?: "ar" | "en";
  className?: string;
}) {
  const [items, setItems] = useState<Slide[]>(FALLBACK);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // جلب الإعلانات الحيّة من القاعدة
  useEffect(() => {
    let alive = true;
    fetch("/api/promo-banners", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive || !data?.ok || !Array.isArray(data.banners)) return;
        const slides = (data.banners as ApiBanner[]).map(fromApi);
        if (slides.length > 0) {
          setItems(slides);
          setIndex(0);
        } else {
          setItems([]); // لا إعلانات مفعّلة → أخفِ الشريط
        }
      })
      .catch(() => {
        /* نُبقي الاحتياط */
      });
    return () => {
      alive = false;
    };
  }, []);

  // تبديل تلقائي (يتوقف عند المرور بالماوس أو مع تقليل الحركة)
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

  // إبقاء الفهرس ضمن الحدود
  const safeIndex = useMemo(
    () => (items.length ? index % items.length : 0),
    [index, items.length]
  );

  // تسجيل ظهور الشريحة النشطة (مرّة واحدة لكل إعلان في هذا التحميل)
  const seen = useRef<Set<number>>(new Set());
  useEffect(() => {
    const b = items[safeIndex];
    if (!b) return;
    const nid = Number(b.id);
    if (Number.isFinite(nid) && !seen.current.has(nid)) {
      seen.current.add(nid);
      trackPromo(nid, "impression");
    }
  }, [safeIndex, items]);

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
          const active = i === safeIndex;
          return (
            <Link
              key={b.id}
              href={b.href}
              target={b.external ? "_blank" : undefined}
              rel={b.external ? "noopener noreferrer" : undefined}
              onClick={() => {
                const nid = Number(b.id);
                if (Number.isFinite(nid)) trackPromo(nid, "click");
              }}
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
                {c.subtitle ? (
                  <div className="mt-0.5 hidden text-xs text-white/85 line-clamp-1 sm:block sm:text-sm">
                    {c.subtitle}
                  </div>
                ) : null}
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
              aria-label={(lang === "ar" ? "إعلان " : "Slide ") + (i + 1)}
              aria-current={i === safeIndex}
              className={`h-1.5 rounded-full transition-all ${
                i === safeIndex
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

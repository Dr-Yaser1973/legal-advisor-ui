"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

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

const ROTATE_MS = 5500;

// بطاقة الهيرو الطولية: تتناوب بين بطاقة الخدمات والإعلانات.
export default function HeroShowcase({
  lang = "ar",
  services,
}: {
  lang?: "ar" | "en";
  services: ReactNode;
}) {
  const [ads, setAds] = useState<ApiBanner[]>([]);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    let alive = true;
    fetch("/api/promo-banners", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.ok && Array.isArray(d.banners)) setAds(d.banners);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // اللوحة 0 = الخدمات، ثم إعلان لكل عنصر
  const total = 1 + ads.length;

  useEffect(() => {
    if (total <= 1 || paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setI((p) => (p + 1) % total), ROTATE_MS);
    return () => clearInterval(id);
  }, [total, paused]);

  const safe = total ? i % total : 0;

  function text(b: ApiBanner) {
    return lang === "ar"
      ? { title: b.titleAr, subtitle: b.subtitleAr, cta: b.ctaAr }
      : {
          title: b.titleEn || b.titleAr,
          subtitle: b.subtitleEn || b.subtitleAr,
          cta: b.ctaEn || b.ctaAr,
        };
  }

  const ad = safe > 0 ? ads[safe - 1] : null;

  return (
    <div
      dir={dir}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div key={safe} className="hero-fade">
        {ad ? (
          (() => {
            const c = text(ad);
            return (
              <Link
                href={ad.href}
                target={ad.external ? "_blank" : undefined}
                rel={ad.external ? "noopener noreferrer" : undefined}
                style={{ background: ad.gradient }}
                className="group relative flex min-h-[420px] flex-col justify-center gap-4 overflow-hidden rounded-3xl border border-white/10 p-8 text-white shadow-lg"
              >
                <span className="promo-sheen pointer-events-none absolute inset-0" aria-hidden />
                <span
                  className="absolute top-3 inline-flex rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold ring-1 ring-white/25"
                  style={{ [dir === "rtl" ? "right" : "left"]: "0.75rem" } as any}
                >
                  {lang === "ar" ? "إعلان" : "Ad"}
                </span>

                <span className="promo-float text-5xl drop-shadow-sm">{ad.emoji}</span>
                <div className="text-2xl font-extrabold leading-snug drop-shadow-sm">
                  {c.title}
                </div>
                {c.subtitle ? (
                  <div className="max-w-[26ch] text-sm leading-7 text-white/90">
                    {c.subtitle}
                  </div>
                ) : null}
                <span className="promo-glow mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-white/95 px-5 py-2.5 text-sm font-bold text-zinc-900 transition-transform group-hover:scale-105">
                  {c.cta}
                  <span className="transition-transform group-hover:-translate-x-1">
                    {dir === "rtl" ? "←" : "→"}
                  </span>
                </span>
              </Link>
            );
          })()
        ) : (
          services
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {Array.from({ length: total }).map((_, k) => (
            <button
              key={k}
              type="button"
              onClick={() => setI(k)}
              aria-current={k === safe}
              aria-label={
                k === 0
                  ? lang === "ar"
                    ? "الخدمات الأساسية"
                    : "Core services"
                  : (lang === "ar" ? "إعلان " : "Ad ") + k
              }
              className={`h-1.5 rounded-full transition-all ${
                k === safe ? "w-6 bg-amber-400" : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

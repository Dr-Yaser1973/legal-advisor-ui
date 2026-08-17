// app/page.tsx
// Server Component: النصوص تُصيَّر على الخادم باللغة الصحيحة،
// والأجزاء التفاعلية معزولة في مكوّنات عميل صغيرة.

import Link from "next/link";
import {
  BookOpen,
  FileText,
  Languages,
  MessageSquare,
  Briefcase,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Scale,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";

import PlatformVisitorsCounter from "@/components/PlatformVisitorsCounter";
import AuthButton from "@/components/AuthButton";
import HeroShowcase from "@/components/HeroShowcase";
import HomeAuthCtas from "@/components/home/HomeAuthCtas";
import HomeMobileCta from "@/components/home/HomeMobileCta";

import { getLocale } from "@/lib/i18n/server";
import { getCommon, getHome } from "@/lib/i18n";
import { LOCALE_PARAM, isRtl, type Locale } from "@/lib/i18n/config";

type BadgeColor = "emerald" | "amber" | "blue" | "purple";

type Service = {
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: BadgeColor;
  highlight?: boolean;
};

export default async function HomePage() {
  const locale = await getLocale();
  const rtl = isRtl(locale);
  const t = getHome(locale);
  const c = getCommon(locale);

  const Arrow = rtl ? ChevronLeft : ChevronRight;

  const services: Service[] = [
    {
      ...t.services.library,
      href: "/library",
      icon: BookOpen,
      badge: t.badges.public,
      badgeColor: "emerald",
    },
    {
      ...t.services.consultations,
      href: "/consultations",
      icon: MessageSquare,
      badge: t.badges.accountRequired,
      badgeColor: "amber",
    },
    {
      ...t.services.translate,
      href: "/translate",
      icon: Languages,
      badge: t.badges.accountRequired,
      badgeColor: "amber",
    },
    {
      ...t.services.contracts,
      href: "/contracts",
      icon: FileText,
      badge: t.badges.noAi,
      badgeColor: "blue",
      highlight: true,
    },
    {
      ...t.services.cases,
      href: "/cases",
      icon: Briefcase,
      badge: t.badges.firms,
      badgeColor: "purple",
    },
    {
      ...t.services.smartLawyer,
      href: "/smart-lawyer",
      icon: Sparkles,
      badge: t.badges.firms,
      badgeColor: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-[60] focus:rounded-lg focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-zinc-900"
      >
        {c.a11y.skipToContent}
      </a>

      {/* TOP BAR (Official) */}
      <div className="border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <Scale className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <span className="font-semibold text-zinc-100">{c.portal}</span>
            <span className="opacity-40">•</span>
            <span className="hidden sm:inline">{c.topNote}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 text-xs text-zinc-300 sm:flex">
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span>{c.a11y.language}</span>
            </div>

            <LocaleSwitch locale={locale} label={c.a11y.languageSwitcher} />
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href={homeHref(locale)} className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-zinc-900/50">
              <Scale className="h-5 w-5 text-amber-300" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold sm:text-base">{c.brand}</div>
              <div className="text-xs text-zinc-300">{c.portalAlt}</div>
            </div>
          </Link>

          <nav
            aria-label={c.a11y.mainNav}
            className="hidden items-center gap-5 text-sm text-zinc-300 md:flex"
          >
            <Link className="transition hover:text-white" href="/library">
              {c.nav.library}
            </Link>
            <Link className="transition hover:text-white" href="/contracts">
              {c.nav.contracts}
            </Link>
            <Link className="transition hover:text-white" href="/translate">
              {c.nav.translate}
            </Link>
            <Link className="transition hover:text-white" href="/consultations">
              {c.nav.consultations}
            </Link>
            <Link className="transition hover:text-white" href="/how-to-use">
              {c.nav.howToUse}
            </Link>
            <Link className="transition hover:text-white" href="/pricing">
              {c.nav.pricing}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <AuthButton locale={locale} />
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-25" aria-hidden="true">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-8 md:pt-16 md:pb-12">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div className="text-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200">
                  <BadgeCheck
                    className="h-4 w-4 text-amber-300"
                    aria-hidden="true"
                  />
                  <span>{c.topNote}</span>
                </div>

                <h1 className="mt-4 text-2xl font-extrabold leading-[1.2] sm:text-3xl md:text-5xl">
                  {t.heroTitle}
                </h1>

                <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base md:text-lg">
                  {t.heroSubtitle}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/library"
                    className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-900 transition hover:bg-amber-300"
                  >
                    {t.heroPrimary}
                    <Arrow className="ms-2 h-4 w-4" aria-hidden="true" />
                  </Link>

                  <Link
                    href="/translate"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400"
                  >
                    <Languages className="me-2 h-4 w-4" aria-hidden="true" />
                    {t.heroTranslate}
                  </Link>

                  <HomeAuthCtas
                    rtl={rtl}
                    registerLabel={c.actions.register}
                    signInLabel={c.actions.signIn}
                    consultationsLabel={c.nav.consultations}
                  />
                </div>

                {/* Trust strip */}
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                  <TrustPill
                    text={t.trust[0].title}
                    icon={<ShieldCheck className="h-4 w-4" />}
                  />
                  <TrustPill
                    text={t.trust[1].title}
                    icon={<BadgeCheck className="h-4 w-4" />}
                  />
                  <TrustPill
                    text={t.trust[2].title}
                    icon={<Sparkles className="h-4 w-4" />}
                  />
                </div>

                {/* عدّاد زوّار المنصّة */}
                <div className="mt-6 flex justify-center md:justify-start">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 px-6 py-4">
                    <PlatformVisitorsCounter locale={locale} />
                  </div>
                </div>
              </div>

              {/* بطاقة طولية تتناوب بين الخدمات والإعلانات */}
              <HeroShowcase
                lang={locale}
                services={
                  <div className="flex min-h-[420px] flex-col rounded-3xl border border-white/10 bg-zinc-900/40 p-5">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3">
                      <div className="text-sm font-bold">
                        {t.quickActionsTitle}
                      </div>
                      <div className="text-xs text-zinc-300">Portal</div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-zinc-300">
                      {t.quickActionsHint}
                    </p>

                    <div className="mt-4 grid gap-3">
                      {services.slice(0, 3).map((s) => (
                        <QuickRow
                          key={s.href}
                          title={s.title}
                          desc={s.desc}
                          Icon={s.icon}
                          href={s.href}
                          Arrow={Arrow}
                        />
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/50 p-4">
                      <div className="text-xs text-zinc-300">
                        {t.quickExampleLabel}
                      </div>
                      <div className="mt-2 text-sm leading-7 text-zinc-200">
                        {t.quickExample}
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </section>

        {/* SERVICES DIRECTORY */}
        <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="text-start">
            <h2 className="text-xl font-extrabold md:text-2xl">
              {t.servicesTitle}
            </h2>
            <p className="mt-2 text-sm text-zinc-300 md:text-base">
              {t.servicesSubtitle}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard
                key={s.href}
                title={s.title}
                desc={s.desc}
                href={s.href}
                Icon={s.icon}
                Arrow={Arrow}
                openLabel={c.actions.openService}
                badge={s.badge}
                badgeColor={s.badgeColor}
                highlight={s.highlight}
              />
            ))}
          </div>
        </section>

        {/* GUIDE BANNER */}
        <section className="mx-auto max-w-6xl px-4 pb-2">
          <Link
            href="/how-to-use"
            className="block rounded-3xl border border-amber-400/30 bg-gradient-to-bl from-amber-400/10 to-zinc-900/40 p-6 transition hover:from-amber-400/15"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-amber-400/30 bg-zinc-950/40 p-3">
                  <BadgeCheck
                    className="h-6 w-6 text-amber-300"
                    aria-hidden="true"
                  />
                </div>
                <div className="text-start">
                  <div className="text-base font-extrabold md:text-lg">
                    {t.guideBannerTitle}
                  </div>
                  <div className="mt-1 text-sm text-zinc-300">
                    {t.guideBannerDesc}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-zinc-900">
                {t.guideBannerBtn}
                <Arrow className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-zinc-300 md:flex-row">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <span>
              © {new Date().getFullYear()} {c.brand} — {c.footer.rights}
            </span>
          </div>

          <nav aria-label={c.a11y.footerNav} className="flex flex-wrap gap-3">
            <Link className="transition hover:text-zinc-100" href="/about">
              {c.footer.about}
            </Link>
            <span className="opacity-30" aria-hidden="true">
              •
            </span>
            <Link className="transition hover:text-zinc-100" href="/how-to-use">
              {c.footer.howToUse}
            </Link>
            <span className="opacity-30" aria-hidden="true">
              •
            </span>
            <Link className="transition hover:text-zinc-100" href="/privacy">
              {c.footer.privacy}
            </Link>
            <span className="opacity-30" aria-hidden="true">
              •
            </span>
            <Link className="transition hover:text-zinc-100" href="/terms">
              {c.footer.terms}
            </Link>
            <span className="opacity-30" aria-hidden="true">
              •
            </span>
            <Link className="transition hover:text-zinc-100" href="/disclaimer">
              {c.footer.disclaimer}
            </Link>
          </nav>
        </div>
      </footer>

      <HomeMobileCta
        libraryLabel={t.mobileCta}
        signInLabel={c.actions.signInShort}
      />

      {/* مساحة للشريط اللاصق على الموبايل */}
      <div className="h-20 md:hidden" />
    </div>
  );
}

/* =======================
   Helpers
======================= */

function homeHref(locale: Locale) {
  return locale === "ar" ? "/" : `/?${LOCALE_PARAM}=${locale}`;
}

/* =======================
   UI Components
======================= */

/**
 * مبدّل اللغة: روابط حقيقية بدل onClick — يعمل بلا JS،
 * ويجعل النسخة الإنجليزية قابلة للفهرسة والمشاركة.
 */
function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const base =
    "px-3 py-1 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300";
  const active = "bg-zinc-100 text-zinc-900 font-semibold";
  const idle = "text-zinc-200 hover:text-white";

  return (
    <div
      role="group"
      aria-label={label}
      className="flex rounded-full border border-white/10 bg-zinc-900/60 p-1 text-xs"
    >
      <Link
        href={`/?${LOCALE_PARAM}=ar`}
        hrefLang="ar"
        lang="ar"
        aria-current={locale === "ar" ? "true" : undefined}
        className={`${base} ${locale === "ar" ? active : idle}`}
      >
        العربية
      </Link>
      <Link
        href={`/?${LOCALE_PARAM}=en`}
        hrefLang="en"
        lang="en"
        aria-current={locale === "en" ? "true" : undefined}
        className={`${base} ${locale === "en" ? active : idle}`}
      >
        EN
      </Link>
    </div>
  );
}

function TrustPill({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-200">
      <span className="text-amber-300" aria-hidden="true">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

function QuickRow({
  title,
  desc,
  Icon,
  href,
  Arrow,
}: {
  title: string;
  desc: string;
  Icon: React.ElementType;
  href: string;
  Arrow: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-zinc-950/50 p-4 transition hover:bg-zinc-950/70"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-white/10 bg-zinc-900/40 p-2">
          <Icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-zinc-100">{title}</div>
          <div className="mt-1 text-xs leading-6 text-zinc-300">{desc}</div>
        </div>
        <Arrow
          className="mt-2 h-4 w-4 text-zinc-400 group-hover:text-zinc-200"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

function ServiceCard({
  title,
  desc,
  href,
  Icon,
  Arrow,
  openLabel,
  badge,
  badgeColor,
  highlight = false,
}: {
  title: string;
  desc: string;
  href: string;
  Icon: React.ElementType;
  Arrow: React.ElementType;
  openLabel: string;
  badge: string;
  badgeColor: BadgeColor;
  highlight?: boolean;
}) {
  const badgeStyles: Record<BadgeColor, string> = {
    emerald: "text-emerald-200 bg-emerald-500/15",
    amber: "text-amber-200 bg-amber-400/15",
    blue: "text-blue-200 bg-blue-500/15",
    purple: "text-purple-200 bg-purple-500/15",
  };

  return (
    <Link
      href={href}
      className={`group rounded-3xl border bg-zinc-900/40 p-5 transition hover:bg-zinc-900/60 ${
        highlight ? "border-amber-400/30" : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-2">
          <Icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs ${badgeStyles[badgeColor]}`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-3 text-base font-extrabold">{title}</div>
      <div className="mt-2 text-sm leading-7 text-zinc-300">{desc}</div>

      <div className="mt-4 inline-flex items-center text-sm font-bold text-amber-200">
        {openLabel}
        <Arrow className="ms-2 h-4 w-4" aria-hidden="true" />
      </div>
    </Link>
  );
}


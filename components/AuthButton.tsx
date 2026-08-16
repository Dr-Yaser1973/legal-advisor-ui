 // components/AuthButton.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { getCommon } from "@/lib/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/**
 * `locale` اختياري ويعود للعربية افتراضياً، حتى تبقى الاستخدامات القائمة
 * (مثل app/(site)/layout.tsx) تعمل بلا تعديل.
 */
export default function AuthButton({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const { data: session, status } = useSession();
  const t = getCommon(locale).actions;

  // أثناء التحميل فقط نعرض نص بسيط
  if (status === "loading") {
    return (
      <button
        className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
        disabled
      >
        {t.loading}
      </button>
    );
  }

  // لو المستخدم ليس مسجلاً
  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-full border border-emerald-500/70 px-3 py-1 text-xs text-emerald-300 transition hover:bg-emerald-500/10 sm:text-sm"
        >
          {t.signIn}
        </Link>
        <Link
          href="/register"
          className="hidden rounded-full border border-zinc-600 px-3 py-1 text-xs text-zinc-200 transition hover:bg-zinc-800 sm:inline-block sm:text-sm"
        >
          {t.register}
        </Link>
      </div>
    );
  }

  // لو المستخدم مسجَّل دخول
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <span className="hidden text-zinc-300 sm:inline">
        {t.greeting} {session.user.name || session.user.email}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-full border border-red-500/70 px-3 py-1 text-xs text-red-300 transition hover:bg-red-500/10 sm:text-sm"
      >
        {t.signOut}
      </button>
    </div>
  );
}

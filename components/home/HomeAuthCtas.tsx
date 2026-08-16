"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * أزرار الهيرو المرتبطة بحالة الجلسة فقط.
 * معزولة في مكوّن عميل صغير حتى تبقى بقية الصفحة الرئيسية Server Component.
 */
export default function HomeAuthCtas({
  rtl,
  registerLabel,
  signInLabel,
  consultationsLabel,
}: {
  rtl: boolean;
  registerLabel: string;
  signInLabel: string;
  consultationsLabel: string;
}) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const Arrow = rtl ? ChevronLeft : ChevronRight;

  if (isLoggedIn) {
    return (
      <Link
        href="/consultations"
        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-900/50 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-900"
      >
        {consultationsLabel}
        <Arrow className="ms-2 h-4 w-4" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/register"
        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-900/50 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-900"
      >
        {registerLabel}
        <Arrow className="ms-2 h-4 w-4" aria-hidden="true" />
      </Link>

      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
      >
        {signInLabel}
        <Arrow className="ms-2 h-4 w-4" aria-hidden="true" />
      </Link>
    </>
  );
}

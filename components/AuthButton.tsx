 // components/AuthButton.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  // أثناء التحميل فقط نعرض نص بسيط
  if (status === "loading") {
    return (
      <button
        className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
        disabled
      >
        جارٍ التحميل...
      </button>
    );
  }

  // لو المستخدم ليس مسجلاً
  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-full border border-emerald-500/70 px-3 py-1 text-xs sm:text-sm text-emerald-300 hover:bg-emerald-500/10 transition"
        >
          تسجيل الدخول
        </Link>
        <Link
          href="/register"
          className="hidden sm:inline-block rounded-full border border-zinc-600 px-3 py-1 text-xs sm:text-sm text-zinc-200 hover:bg-zinc-800 transition"
        >
          إنشاء حساب
        </Link>
      </div>
    );
  }

  // لو المستخدم مسجَّل دخول
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <span className="hidden sm:inline text-zinc-300">
        أهلاً، {session.user.name || session.user.email}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-full border border-red-500/70 px-3 py-1 text-xs sm:text-sm text-red-300 hover:bg-red-500/10 transition"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}

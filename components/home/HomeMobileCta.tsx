"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { BookOpen } from "lucide-react";

/** شريط الإجراء اللاصق أسفل الشاشة على الموبايل. */
export default function HomeMobileCta({
  libraryLabel,
  signInLabel,
}: {
  libraryLabel: string;
  signInLabel: string;
}) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 px-4 md:hidden">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-zinc-900/70 p-2 shadow-lg backdrop-blur">
        <div className="flex gap-2">
          <Link
            href="/library"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-amber-400 py-3 text-sm font-extrabold text-zinc-900"
          >
            <BookOpen className="me-2 h-5 w-5" aria-hidden="true" />
            {libraryLabel}
          </Link>

          {!isLoggedIn && (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm font-semibold text-zinc-100"
            >
              {signInLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

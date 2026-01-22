 // app/login/page.tsx
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export const dynamic = "force-dynamic"; // منع الـ prerender الإجباري

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return <LoginForm />;
}
<div className="mt-4">
  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-zinc-700" />
    <span className="text-xs text-zinc-400">أو</span>
    <div className="h-px flex-1 bg-zinc-700" />
  </div>

  <button
    type="button"
    onClick={() => signIn("google", { callbackUrl: "/" })}
    className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
  >
    <FcGoogle className="h-5 w-5" />
    <span>تسجيل الدخول عبر Google</span>
    <span className="text-xs text-zinc-400 hidden sm:inline">
      Sign in with Google
    </span>
  </button>
</div>

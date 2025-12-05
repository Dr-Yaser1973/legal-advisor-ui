"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (!res) {
        setErrorMsg("لم يتم استلام استجابة من خادم الدخول.");
        return;
      }

      if (res.error) {
        console.error("LOGIN_ERROR", res.error);
        setErrorMsg(res.error || "بيانات الدخول غير صحيحة.");
        return;
      }

      router.push(res.url || callbackUrl);
    } catch (err) {
      console.error("LOGIN_FETCH_ERROR", err);
      setErrorMsg("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 text-right"
      >
        <h1 className="text-xl font-semibold text-center mb-2">
          تسجيل الدخول
        </h1>

        {errorMsg && (
          <div className="text-sm text-red-400 bg-red-900/30 border border-red-700/60 rounded-md px-3 py-2">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm">البريد الإلكتروني</label>
          <input
            className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-amber-500/70"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm">كلمة المرور</label>
          <input
            type="password"
            className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-amber-500/70"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 text-sm transition disabled:opacity-60"
        >
          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}


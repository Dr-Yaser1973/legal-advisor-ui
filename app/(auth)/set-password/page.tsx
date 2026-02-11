"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit() {
    setError(null);

    if (!token) {
      setError("الرابط غير صالح.");
      return;
    }

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
      return;
    }

    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل تعيين كلمة المرور.");
        return;
      }

      setSuccess(true);

      // تحويل بعد 2 ثانية إلى تسجيل الدخول
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (e) {
      setError("حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-4 text-right">

        <h1 className="text-xl font-bold">تعيين كلمة المرور</h1>
        <p className="text-sm text-zinc-400">
          مرحبًا بك 👋  
          يرجى تعيين كلمة مرور لحساب مكتب الترجمة.
        </p>

        {!token && (
          <div className="text-sm text-red-400">
            الرابط غير صالح أو ناقص.
          </div>
        )}

        {success ? (
          <div className="text-sm text-emerald-400">
            ✅ تم تعيين كلمة المرور بنجاح  
            سيتم تحويلك إلى تسجيل الدخول…
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm mb-1">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-white/10 p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-white/10 p-2 text-sm"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400">{error}</div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-2 text-sm font-medium"
            >
              {loading ? "جارٍ الحفظ..." : "تعيين كلمة المرور"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}


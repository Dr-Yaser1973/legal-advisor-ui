 // app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) return;
        const session = await res.json();
        const role = session?.user?.role;
        if (role) redirectByRole(role, router);
      } catch {}
    })();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (!res || res.error) {
      alert("بيانات الدخول غير صحيحة");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;
    redirectByRole(role, router);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-center mb-4 text-white">
          تسجيل الدخول
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-zinc-300">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-zinc-300">
              كلمة المرور
            </label>
            <input
              type="password"
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-600 hover:bg-emerald-700 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "جارٍ التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

function redirectByRole(
  role: string | undefined,
  router: ReturnType<typeof useRouter>
) {
  switch (role) {
    case "ADMIN":
      router.push("/admin");
      break;
    case "LAWYER":
      router.push("/lawyers/my-consults");
      break;
    case "TRANSLATION_OFFICE":
      router.push("/translation-office/requests");
      break;
    case "COMPANY":
      router.push("/cases");
      break;
    case "CLIENT":
    default:
      router.push("/");
      break;
  }
}

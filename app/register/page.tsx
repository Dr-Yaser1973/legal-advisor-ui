 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
        }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // تجاهل خطأ JSON لو الرد غير متوقع
      }

      if (!res.ok || !json?.ok) {
        console.error("REGISTER_FAIL", res.status, json);
        alert(
          json?.message ||
            `حدث خطأ أثناء التسجيل. (حالة الخادم: ${res.status})`,
        );
        return;
      }

      alert("تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.");
      router.push("/login");
    } catch (err) {
      console.error(err);
      setErrorMsg("حدث خطأ أثناء التسجيل.");
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
          إنشاء حساب جديد
        </h1>

        {errorMsg && (
          <div className="text-sm text-red-400 bg-red-900/30 border border-red-700/60 rounded-md px-3 py-2">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm">الاسم الكامل</label>
          <input
            className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-amber-500/70"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm">البريد الإلكتروني</label>
          <input
            type="email"
            className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-amber-500/70"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm">رقم الهاتف (اختياري)</label>
          <input
            className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-amber-500/70"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
          {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
        </button>
      </form>
    </div>
  );
}

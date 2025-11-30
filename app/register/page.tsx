 // app/register/page.tsx
"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

 const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.error || "حدث خطأ أثناء التسجيل");
      setLoading(false);
      return;
    }

    // نجاح التسجيل
    setDone(true);
  } catch (err) {
    console.error("Failed to call /api/register", err);
    alert("تعذر الاتصال بالخادم. تأكد أن السيرفر يعمل وأعد المحاولة.");
    setLoading(false);
  }
};


  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-white mb-2">
            تم إنشاء الحساب بنجاح
          </h1>
          <p className="text-sm text-zinc-300 mb-4">
            يمكنك الآن تسجيل الدخول باستخدام بريدك وكلمة المرور.
          </p>
          <a
            href="/login"
            className="inline-block rounded-md bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm text-white"
          >
            الذهاب لصفحة الدخول
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-center mb-4 text-white">
          إنشاء حساب جديد
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-zinc-300">
              الاسم الكامل
            </label>
            <input
              name="name"
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-zinc-300">
              البريد الإلكتروني
            </label>
            <input
              name="email"
              type="email"
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-zinc-300">
              رقم الهاتف (اختياري)
            </label>
            <input
              name="phone"
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
              value={form.phone}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-zinc-300">
              كلمة المرور
            </label>
            <input
              name="password"
              type="password"
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-600 hover:bg-emerald-700 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>
      </div>
    </div>
  );
}

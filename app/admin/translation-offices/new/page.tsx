 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTranslationOfficePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/translation-offices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data?.error || "فشل إنشاء المكتب");
      return;
    }

    // ✅ نجاح → رجوع إلى القائمة
    router.push("/translation-offices");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-xl mx-auto px-4 py-10 text-right space-y-5">
        <h1 className="text-2xl font-bold">إضافة مكتب ترجمة</h1>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm">
            {error}
          </div>
        )}

        <input
          className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3"
          placeholder="اسم المكتب"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3"
          placeholder="رقم الهاتف"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3"
          placeholder="موقع المكتب / العنوان"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 p-3 disabled:opacity-60"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ المكتب"}
        </button>
      </div>
    </main>
  );
}

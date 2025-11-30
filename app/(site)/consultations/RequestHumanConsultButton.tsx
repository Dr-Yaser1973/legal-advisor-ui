// app/(site)/consultations/RequestHumanConsultButton.tsx
"use client";

import { useState } from "react";

interface Props {
  consultationId?: number; // رقم الاستشارة الآلية المرتبطة (اختياري)
}

export default function RequestHumanConsultButton({ consultationId }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preferredSpecialization, setPreferredSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/human-consults", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId,
          title,
          description,
          preferredSpecialization,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء إرسال الطلب.");
      } else {
        setMessage(data.message || "تم إرسال طلب الاستشارة بنجاح.");
        setTitle("");
        setDescription("");
        setPreferredSpecialization("");
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      setError("تعذر الاتصال بالخادم، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border border-zinc-700/60 rounded-xl p-4 bg-zinc-900/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-lg px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 transition"
      >
        {open ? "إلغاء" : "طلب استشارة من محامٍ بشري"}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-right">
          <div>
            <label className="block mb-1 text-sm">عنوان مختصر للاستشارة</label>
            <input
              type="text"
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: استشارة حول عقد إيجار تجاري"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">التخصص القانوني المفضل (اختياري)</label>
            <input
              type="text"
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
              value={preferredSpecialization}
              onChange={(e) => setPreferredSpecialization(e.target.value)}
              placeholder="مثال: دستوري، تجاري، شركات..."
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">وصف مختصر للمشكلة</label>
            <textarea
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm min-h-[90px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اشرح بإيجاز الوقائع القانونية التي تريد استشارة محامٍ حولها..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? "جاري الإرسال..." : "إرسال الطلب إلى المحامين"}
          </button>

          {message && <p className="text-sm text-emerald-400 mt-2">{message}</p>}
          {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
        </form>
      )}

      <p className="mt-3 text-xs text-zinc-400">
        سيتم عرض طلبك على المحامين المسجلين في المنصة، وعند قبول أحدهم سيتم فتح غرفة محادثة خاصة بينك وبينه
        مع إشعار المدير (ADMIN).
      </p>
    </div>
  );
}


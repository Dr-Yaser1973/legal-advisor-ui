"use client";

import { useState } from "react";

export default function ConsultationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [humanLawyer, setHumanLawyer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !description) {
      setError("يجب ملء العنوان ووصف الاستشارة.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, humanLawyer }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "فشل إرسال الاستشارة.");
        return;
      }

      if (humanLawyer && json.humanRequestId) {
        setSuccess(
          "تم إرسال طلب الاستشارة إلى المحامين. سيتم ربطك بمحامٍ عند قبول الطلب.",
        );
      } else {
        setSuccess("تم إرسال الاستشارة بنجاح.");
      }

      setTitle("");
      setDescription("");
      setHumanLawyer(false);
    } catch (err: any) {
      setError(err?.message ?? "خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-800 rounded-2xl bg-zinc-900/80 p-4 space-y-3"
    >
      <h2 className="text-lg font-semibold mb-1">طلب استشارة قانونية</h2>

      <div>
        <label className="block text-xs mb-1">عنوان الاستشارة</label>
        <input
          className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs mb-1">وصف الحالة القانونية</label>
        <textarea
          className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="humanLawyer"
          type="checkbox"
          className="h-4 w-4"
          checked={humanLawyer}
          onChange={(e) => setHumanLawyer(e.target.checked)}
        />
        <label htmlFor="humanLawyer" className="text-xs text-zinc-200">
          أطلب استشارة من محامٍ بشري (سيتم عرض طلبك على المحامين المتاحين).
        </label>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-emerald-400">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "جارٍ الإرسال..." : "إرسال الاستشارة"}
      </button>
    </form>
  );
}


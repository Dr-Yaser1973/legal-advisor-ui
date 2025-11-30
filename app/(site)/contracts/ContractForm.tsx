"use client";

import { useState } from "react";

type Template = {
  id: number;
  slug: string;
  title: string;
  language: string;
};

export default function ContractForm({ templates }: { templates: Template[] }) {
  const [templateId, setTemplateId] = useState<string>("");
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [subject, setSubject] = useState("");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!templateId || !partyA || !partyB || !subject) {
      setError("يجب ملء جميع الحقول الإلزامية.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: Number(templateId),
          partyA,
          partyB,
          subject,
          extra,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "فشل توليد العقد.");
        return;
      }

      setSuccess(
        "تم توليد العقد بنجاح. يمكنك تحميل ملف الـ PDF من صفحة العقود المولدة.",
      );
    } catch (err: any) {
      setError(err?.message ?? "خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-800 rounded-2xl bg-zinc-900/80 p-4 space-y-4"
    >
      {/* اختيار القالب */}
      <div>
        <label className="block text-xs mb-1">اختيار قالب العقد</label>
        <select
          className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
        >
          <option value="">اختر قالب العقد</option>
          {templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.title}
            </option>
          ))}
        </select>
        {templates.length === 0 && (
          <p className="text-xs text-yellow-400 mt-1">
            لا توجد قوالب عقود في قاعدة البيانات. تأكد من تشغيل أمر seed.
          </p>
        )}
      </div>

      {/* بيانات الأطراف */}
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1">الطرف الأول</label>
          <input
            className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
            value={partyA}
            onChange={(e) => setPartyA(e.target.value)}
            placeholder="اسم الطرف الأول / الشركة..."
          />
        </div>
        <div>
          <label className="block text-xs mb-1">الطرف الثاني</label>
          <input
            className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
            value={partyB}
            onChange={(e) => setPartyB(e.target.value)}
            placeholder="اسم الطرف الثاني..."
          />
        </div>
      </div>

      <div>
        <label className="block text-xs mb-1">موضوع العقد</label>
        <input
          className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="مثال: تشغيل نظام المستشار القانوني لصالح الجهة..."
        />
      </div>

      <div>
        <label className="block text-xs mb-1">
          تفاصيل إضافية (اختياري – لتوجيه الذكاء الاصطناعي)
        </label>
        <textarea
          className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
          rows={4}
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="اكتب شروطاً خاصة، قيوداً زمنية، طريقة الدفع، أو أي تفاصيل إضافية..."
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-emerald-400">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-6 py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "جارٍ توليد العقد..." : "توليد العقد"}
      </button>
    </form>
  );
}


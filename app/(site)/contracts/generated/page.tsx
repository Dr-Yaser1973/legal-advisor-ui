 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ContractTemplate {
  id: number;
  title: string;
}

export default function ContractsPage() {
  // 🔹 قوالب العقود من قاعدة البيانات
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  // 🔹 حقول النموذج
  const [templateId, setTemplateId] = useState<string>("");
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");

  // 🔹 حالة التوليد
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<number | null>(null);

  // 🔹 تحميل قوالب العقود من API (تعديل المسار حسب مشروعك)
  async function loadTemplates() {
    setTemplatesLoading(true);
    setTemplatesError(null);
    try {
      // 👈 غيّر المسار هنا إذا كان عندك API مختلف للقوالب
      const res = await fetch("/api/contracts/templates");
      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }
      const data = await res.json();

      // نتوقع شكل مثل: { items: [ { id, title }, ...] }
      setTemplates(data.items || []);
    } catch (e) {
      console.error(e);
      setTemplatesError("فشل تحميل قوالب العقود. تأكد من أن API القوالب يعمل.");
    } finally {
      setTemplatesLoading(false);
    }
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  // 🔹 إرسال النموذج لتوليد العقد
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    setGeneratedId(null);

    try {
      if (!templateId) {
        setError("يرجى اختيار قالب عقد أولاً.");
        setSubmitting(false);
        return;
      }

      // 👈 غيّر المسار هنا إذا كان API التوليد مختلف
      const res = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: Number(templateId),
          partyA,
          partyB,
          subject,
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      const data = await res.json();

      if (!data.id) {
        throw new Error("لم يتم إرجاع رقم العقد المولَّد من الـ API (id مفقود).");
      }

      setGeneratedId(data.id);
      setSuccessMessage(
        "تم توليد العقد بنجاح! يمكنك تحميله الآن أو من صفحة العقود المولَّدة."
      );
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "حدث خطأ أثناء توليد العقد. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-right space-y-6">
      {/* العنوان والوصف */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">توليد عقد جديد</h1>
        <p className="text-sm text-zinc-400">
          اختر قالب العقد، ثم أدخل بيانات الأطراف وموضوع العقد، وسيتم توليد عقد
          جاهز مع إمكانية تنزيله بصيغة PDF.
        </p>
      </div>

      {/* زر الانتقال إلى العقود المولدة */}
      <div className="flex justify-end">
        <Link
          href="/contracts/generated"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-800 transition"
        >
          📂 عرض العقود المولَّدة
        </Link>
      </div>

      {/* رسائل أخطاء قوالب العقود */}
      {templatesError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {templatesError}
        </div>
      )}

      {/* رسائل خطأ/نجاح التوليد */}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-200 space-y-3">
          <p>{successMessage}</p>

          {/* ✅ هنا يظهر زر تحميل العقد مباشرة بعد التوليد */}
          {generatedId && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <a
                href={`/api/contracts/generated/${generatedId}/pdf`}
                className="inline-flex items-center rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700 transition"
              >
                تحميل العقد PDF
              </a>

              <Link
                href="/contracts/generated"
                className="inline-flex items-center rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 transition"
              >
                الانتقال إلى صفحة العقود المولَّدة
              </Link>
            </div>
          )}
        </div>
      )}

      {/* نموذج توليد العقد */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-6"
      >
        {/* اختيار قالب العقد */}
        <div>
          <label className="block mb-1 text-sm text-zinc-300">
            قالب العقد
          </label>
          <select
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            <option value="">
              {templatesLoading
                ? "جارٍ تحميل قوالب العقود..."
                : "اختيار قالب العقود"}
            </option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* الطرف الأول */}
        <div>
          <label className="block mb-1 text-sm text-zinc-300">
            الطرف الأول (الجهة أو الشخص)
          </label>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={partyA}
            onChange={(e) => setPartyA(e.target.value)}
            placeholder="مثال: الشركة (أ) ويمثلها ..."
            required
          />
        </div>

        {/* الطرف الثاني */}
        <div>
          <label className="block mb-1 text-sm text-zinc-300">
            الطرف الثاني (الجهة أو الشخص)
          </label>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={partyB}
            onChange={(e) => setPartyB(e.target.value)}
            placeholder="مثال: الشخص (ب) أو الشركة (ب)"
            required
          />
        </div>

        {/* موضوع العقد */}
        <div>
          <label className="block mb-1 text-sm text-zinc-300">
            موضوع العقد
          </label>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="مثال: تقديم خدمات استشارية قانونية ..."
            required
          />
        </div>

        {/* ملاحظات إضافية */}
        <div>
          <label className="block mb-1 text-sm text-zinc-300">
            ملاحظات / شروط خاصة (اختياري)
          </label>
          <textarea
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 h-24 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أي شروط خاصة أو ملاحظات إضافية ترغب بإدراجها في العقد..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || templatesLoading}
            className="rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-6 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 transition disabled:opacity-50"
          >
            {submitting ? "جارٍ توليد العقد..." : "توليد العقد"}
          </button>
        </div>
      </form>
    </div>
  );
}

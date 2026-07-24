/**
 * مكوّن إضافة حدث جديد لقضية — نموذج نظام الرقيب
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * **المسؤولية:**
 * جمع بيانات الحدث من المستخدم (عنوان، نوع، تاريخ، موقع، فترة التذكير)
 * ثم إرسالها إلى POST /api/cases/[id]/events
 *
 * **سير العمل:**
 * 1. المستخدم يملأ النموذج
 * 2. عند الإرسال: تحويل التاريخ المحلي إلى ISO8601
 * 3. إرسال POST مع remindBefore (بالدقائق)
 * 4. الخادم يحسب notifyAt = date - (remindBefore * 60_000 ms)
 * 5. بعد النجاح: تحديث الصفحة (router.refresh)
 *
 * **ملاحظات مهمة:**
 * - remindBefore بالدقائق، ليس الساعات
 *   60 = ساعة واحدة
 *   1440 = يوم واحد (24 * 60)
 *   10080 = أسبوع واحد (7 * 24 * 60)
 * - يجب أن تطابق EVENT_TYPES CaseEventType enum من schema.prisma
 * - datetime-local يُحفظ في المناطق الزمنية المحلية للمستخدم
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/// أنواع الأحداث المدعومة
/// يجب أن تطابق CaseEventType enum في prisma/schema.prisma
/// (تُرسل بنفس القيم للخادم)
const EVENT_TYPES: { value: string; label: string }[] = [
  { value: "HEARING", label: "جلسة" },
  { value: "DEADLINE", label: "موعد نهائي" },
  { value: "MEETING", label: "اجتماع موكّل" },
  { value: "TASK", label: "مهمة داخلية" },
  { value: "VERDICT", label: "حكم" },
  { value: "APPEAL", label: "طعن" },
  { value: "OTHER", label: "أخرى" },
];

/// خيارات فترة التذكير بالدقائق
/// ⚠️ CRITICAL: هذه بالدقائق، ليس الساعات!
/// الخادم سيحسب: notifyAt = date - (value * 60_000 milliseconds)
const REMIND_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "بلا تذكير" },
  { value: 60, label: "قبل ساعة" },           // 60 دقيقة = 1 ساعة
  { value: 1440, label: "قبل يوم" },          // 1440 دقيقة = 24 ساعة = 1 يوم
  { value: 2880, label: "قبل يومين" },        // 2880 دقيقة = 48 ساعة = 2 يوم
  { value: 10080, label: "قبل أسبوع" },       // 10080 دقيقة = 7 * 1440
];

/**
 * مكوّن النموذج
 * @param caseId - معرّف القضية المرتبطة
 */
export function AddCaseEvent({ caseId }: { caseId: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("HEARING");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [remindBefore, setRemindBefore] = useState(1440);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  /// معالج الإرسال الرئيسي
  /// 1. التحقّق من البيانات
  /// 2. تحويل التاريخ المحلي إلى ISO8601
  /// 3. إرسال POST إلى /api/cases/[id]/events
  /// 4. تحديث الصفحة عند النجاح
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    // التحقّق من المدخلات
    if (!title.trim()) {
      setErr("يرجى إدخال عنوان الحدث.");
      return;
    }
    if (!date) {
      setErr("يرجى تحديد تاريخ ووقت الحدث.");
      return;
    }

    try {
      setLoading(true);

      // ⚠️ تحويل التاريخ المحلي (من datetime-local) إلى ISO8601
      // datetime-local يعطي: "2026-08-15T10:00"
      // new Date().toISOString() يحوّله لـ: "2026-08-15T10:00:00.000Z"
      const res = await fetch(`/api/cases/${caseId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          type,
          date: new Date(date).toISOString(),  // يجب أن يكون ISO8601 للخادم
          location: location.trim() || null,
          remindBefore,  // بالدقائق! الخادم سيحسب notifyAt منه
          note: note.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error || "فشل إضافة الحدث.");
        return;
      }

      // تنظيف النموذج بعد النجاح
      setTitle("");
      setType("HEARING");
      setDate("");
      setLocation("");
      setRemindBefore(1440); // الافتراضي: تذكير يوم واحد
      setNote("");

      // تحديث الصفحة لإظهار الحدث الجديد
      router.refresh();
    } catch {
      setErr("حدث خطأ غير متوقع أثناء إضافة الحدث.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-zinc-950 px-2 py-1.5 text-xs focus:outline-none focus:ring focus:ring-emerald-500/60";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 flex flex-col gap-2 text-xs"
    >
      <h3 className="font-semibold text-sm mb-1">إضافة حدث / موعد</h3>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="عنوان الحدث (جلسة مرافعة، تبليغ…)"
        className={field}
      />

      <div className="grid grid-cols-2 gap-2">
        <select value={type} onChange={(e) => setType(e.target.value)} className={field}>
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={field}
        />
      </div>

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="المكان (اسم المحكمة/القاعة…) — اختياري"
        className={field}
      />

      <label className="flex items-center gap-2 text-[11px] text-zinc-400">
        <span className="shrink-0">🔔 التذكير:</span>
        <select value={remindBefore} onChange={(e) => setRemindBefore(Number(e.target.value))} className={field}>
          {REMIND_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="ملاحظات حول هذا الحدث (اختياري)…"
        className={`${field} min-h-[54px]`}
      />

      {err && <p className="text-[11px] text-red-300">{err}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium hover:bg-emerald-500 disabled:opacity-60 transition"
      >
        {loading ? "جارٍ الحفظ…" : "حفظ الحدث"}
      </button>
    </form>
  );
}

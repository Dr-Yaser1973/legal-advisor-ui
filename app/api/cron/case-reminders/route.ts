/**
 * GET /api/cron/case-reminders
 *
 * نظام تذكيرات القضايا — «الرقيب»
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * **المسؤولية:**
 * يُستدعى تلقائياً من Vercel Cron (انظر vercel.json) يومياً الساعة 03:00 UTC
 * يبحث عن جميع أحداث القضايا التي موعد تذكيرها حان (notifyAt <= NOW())
 * ثم يُرسل Push Notification لصاحب القضية والمحامين المكلّفين
 *
 * **الأمان:**
 * محميّ بـ CRON_SECRET (متغيّر بيئي). Vercel يُضيف Authorization: Bearer <CRON_SECRET>
 * الوصول الغير مصرّح يُرجع 401
 *
 * **الخطوات:**
 * 1. البحث عن CaseEvent حيث:
 *    - notified = false (لم يُبلّغ بعد)
 *    - notifyAt <= NOW() (الموعد المحسوب حان)
 *    (null تُستثنى تلقائياً لأن null <= NOW() دائماً false)
 * 2. لكل حدث، جمع المستقبلات:
 *    - صاحب القضية (case.userId)
 *    - كل محامٍ مكلّف (case.assignments[].userId)
 * 3. صياغة رسالة:
 *    - العنوان: "🔔 تذكير: [نوع الحدث] — [اسم القضية]"
 *    - الجسم: "[عنوان الحدث] بتاريخ [التاريخ المنسّق]"
 * 4. إرسال Push Notification عبر notifyUser (داخلي + mobile)
 * 5. تعيين notified = true (منع التكرار)
 *
 * **ملاحظات:**
 * - الحد الأقصى 100 حدث لكل تنفيذ (take: 100)
 * - Promise.allSettled: لا توقف عند فشل إشعار واحد
 * - AR locale: التواريخ بصيغة عربية (ar-IQ)
 *
 * **استكشاف الأخطاء:**
 * - لا تذكيرات ترسل؟ تحقّق من:
 *   1. وجود CRON_SECRET في Vercel env
 *   2. وجود CaseEvent.notifyAt ليس null
 *   3. Hobby plan = يومي فقط (Pro plan = كل ساعة)
 *   4. قاعدة البيانات: SELECT * FROM "CaseEvent" WHERE notified=false
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/// خريطة ترجمة أنواع الأحداث إلى العربية
/// يُستخدم في عنوان الإشعار
/// يجب تطابقها مع CaseEventType enum في schema.prisma
const TYPE_LABEL: Record<string, string> = {
  HEARING: "جلسة",
  DEADLINE: "موعد نهائي",
  MEETING: "اجتماع موكّل",
  TASK: "مهمة",
  VERDICT: "حكم",
  APPEAL: "طعن",
  OTHER: "حدث",
};

/// وظيفة البحث والإرسال الرئيسية
async function runReminders() {
  const now = new Date();

  // ⚠️ استعلام حرج: البحث عن الأحداث المستحقّة
  // - notified = false: لم يُبلّغ بعد
  // - notifyAt <= now: الموعد المحسوب حان (null يُستثنى تلقائياً)
  // مثال:
  //   إذا notifyAt = 2026-08-14T10:00 و now = 2026-08-14T11:00
  //   النتيجة: true (يجب الإرسال)
  const due = await prisma.caseEvent.findMany({
    where: { notified: false, notifyAt: { lte: now } },
    include: {
      case: {
        select: {
          id: true,
          title: true,
          userId: true,
          // جلب المحامين المكلّفين
          assignments: { select: { userId: true } },
        },
      },
    },
    orderBy: { notifyAt: "asc" },
    take: 100, // حد آمن لتجنب overload
  });

  let sent = 0;
  for (const ev of due) {
    // جمع المستقبلات (Set لتجنب التكرار)
    const recipients = new Set<number>();
    if (ev.case?.userId) recipients.add(ev.case.userId); // صاحب القضية
    for (const a of ev.case?.assignments ?? []) recipients.add(a.userId); // المكلّفون

    // صياغة الإشعار
    const label = TYPE_LABEL[ev.type] ?? "حدث"; // نوع الحدث بالعربية
    const when = new Date(ev.date).toLocaleString("ar-IQ", {
      dateStyle: "medium",
      timeStyle: "short",
    }); // تاريخ الحدث الفعلي بصيغة عربية
    const title = `🔔 تذكير: ${label} — ${ev.case?.title || `قضية #${ev.caseId}`}`;
    const body = `${ev.title} بتاريخ ${when}${ev.location ? ` — ${ev.location}` : ""}`;

    // إرسال الإشعار لكل المستقبلات
    // Promise.allSettled: لا توقف عند فشل واحد
    await Promise.allSettled(
      [...recipients].map((userId) =>
        notifyUser({
          userId,
          title,
          body,
          pushData: { type: "case_reminder", caseId: ev.caseId, eventId: ev.id },
        })
      )
    );

    // تعيين notified = true لمنع التكرار في الـ Cron القادمة
    await prisma.caseEvent.update({
      where: { id: ev.id },
      data: { notified: true },
    });
    sent++;
  }

  return { processed: due.length, sent };
}

export async function GET(req: Request) {
  // التحقّق من CRON_SECRET
  // Vercel يضيف هذه الترويسة تلقائياً من متغيّرات البيئة
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    console.error("case-reminders cron error:", e);
    return NextResponse.json({ ok: false, error: e?.message || "فشل" }, { status: 500 });
  }
}

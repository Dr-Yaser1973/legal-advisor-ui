/**
 * POST /api/cases/[id]/events
 *
 * إضافة حدث جديد لقضية مع حساب موعد التذكير تلقائياً
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * **المسؤولية:**
 * ينشئ CaseEvent جديد ويحسب موعد التذكير (notifyAt) بناءً على remindBefore
 *
 * **الطلب (Request Body):**
 * {
 *   title: string                          // عنوان الحدث (إلزامي)
 *   type?: "HEARING" | "DEADLINE" | ...   // نوع الحدث (اختياري، افتراضي: OTHER)
 *   date: string (ISO8601)                 // تاريخ ووقت الحدث (مثل "2026-08-15T10:00:00Z")
 *   location?: string                      // موقع الحدث (اختياري)
 *   remindBefore: number (minutes)         // فترة التذكير بالدقائق (إلزامي)
 *   note?: string                          // ملاحظات داخلية (اختياري)
 * }
 *
 * **حسابات المنطق (الجزء الحرج):**
 * ────────────────────────────────────────
 *
 * 1. remindBefore = 0 (بلا تذكير)
 *    → notifyAt = null
 *    → Cron لن تبحث عنه (null لا يُقارن)
 *
 * 2. remindBefore > 0 (مع تذكير)
 *    → notifyAt = new Date(date.getTime() - remindBefore * 60_000)
 *    → 60_000 ms = 1 دقيقة = 60 ثانية
 *
 * **مثال عملي:**
 * ───────────
 * الإدخال:
 *   date = "2026-08-15T10:00:00Z"
 *   remindBefore = 1440 (دقيقة)
 *
 * الحسابات:
 *   1440 دقيقة = 24 ساعة = 1 يوم
 *   1440 * 60_000 = 86,400,000 ms
 *   notifyAt = 2026-08-15T10:00:00Z - 86,400,000 ms
 *   notifyAt = 2026-08-14T10:00:00Z
 *
 * النتيجة:
 *   Cron ستُرسل تذكيراً في 2026-08-14 10:00 UTC
 *   أي: يوم واحد قبل الحدث الفعلي
 *
 * **خيارات remindBefore الشائعة:**
 * ──────────────────────────────
 * 0       = بلا تذكير
 * 60      = ساعة واحدة (60 * 1 دقيقة)
 * 1440    = يوم واحد (60 * 24 دقيقة)
 * 2880    = يومان (60 * 24 * 2 دقيقة)
 * 10080   = أسبوع (60 * 24 * 7 دقيقة)
 *
 * **الاستجابة:**
 * { ok: true } — بنجاح
 * { error: "..." } — فشل (400/401/500)
 *
 * **الصلاحيات:**
 * يجب أن يكون المستخدم:
 * - صاحب القضية (USER_OWNED_CASES) و WRITE access
 * - أو محامياً مكلّفاً بـ WRITE access
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCaseAccess } from "@/lib/auth/guards";
import { CaseEventType } from "@prisma/client";

export const runtime = "nodejs";

// قائمة الأنواع الصالحة (من Prisma enum)
const VALID_TYPES = Object.values(CaseEventType) as string[];

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caseId = Number(id);
    if (!Number.isFinite(caseId)) {
      return NextResponse.json({ error: "معرّف القضية غير صالح." }, { status: 400 });
    }

    // التحقّق من الصلاحيات
    const auth = await requireCaseAccess(caseId);
    if (!auth.ok) return auth.res;

    // تحليل Body
    const body = (await req.json().catch(() => ({}))) as {
      title?: string;
      note?: string;
      type?: string;
      date?: string;
      location?: string;
      remindBefore?: number | string;
    };

    // التحقّق والتنظيف
    const title = (body.title || "").trim();
    const note = (body.note || "").trim();
    const location = (body.location || "").trim();

    if (!title) {
      return NextResponse.json({ error: "عنوان الحدث مطلوب." }, { status: 400 });
    }

    // نوع الحدث (مع fallback آمن إلى OTHER)
    const type = VALID_TYPES.includes(String(body.type))
      ? (body.type as CaseEventType)
      : CaseEventType.OTHER;

    // التاريخ (افتراضي: الآن إذا لم يُحدّد)
    const date = body.date ? new Date(body.date) : new Date();
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "تاريخ الحدث غير صالح." }, { status: 400 });
    }

    // ⚠️ الحساب الحرج: notifyAt
    // remindBefore بالدقائق (دقيقة واحدة = 60_000 ميلي ثانية)
    const remindBefore = Number(body.remindBefore) || 0;
    const notifyAt =
      remindBefore > 0
        ? new Date(date.getTime() - remindBefore * 60_000)  // date - (دقائق)
        : null; // بلا تذكير

    const createdBy = auth.user?.id ? Number(auth.user.id) : null;

    // إنشاء الحدث
    await prisma.caseEvent.create({
      data: {
        caseId,
        title,
        note: note || null,
        type,
        location: location || null,
        date,        // التاريخ الفعلي للحدث
        notifyAt,    // موعد إرسال التذكير (محسوب تلقائياً)
        createdBy,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("case event error:", e);
    return NextResponse.json({ error: e?.message || "فشل إضافة حدث." }, { status: 500 });
  }
}
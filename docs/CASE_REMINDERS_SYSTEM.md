# نظام تذكيرات القضايا — «الرقيب»

## 🎯 النظرة العامة

**الرقيب** هو نظام تذكيرات تلقائي يُرسل إشعارات بـ Push Notification للمحامين والعملاء قبل الأحداث المهمة في القضايا (جلسات، مواعيد نهائية، إلخ).

---

## 🏗️ المعمارية

```
المستخدم ← يملأ نموذج → AddCaseEvent.tsx
    ↓
  POST /api/cases/[id]/events
    ↓
  API يحسب: notifyAt = date - (remindBefore * 60 ثانية)
    ↓
  CaseEvent محفوظ في قاعدة البيانات
    ↓
  [انتظار يومي]
    ↓
  Vercel Cron: GET /api/cron/case-reminders
    ↓
  البحث: SELECT * WHERE notified=false AND notifyAt <= NOW()
    ↓
  إرسال Push Notification
    ↓
  تعيين: notified = true
```

---

## 📋 المكونات الرئيسية

### 1️⃣ نموذج البيانات: `CaseEvent`
**الملف:** `prisma/schema.prisma`

```prisma
model CaseEvent {
  id        Int           @id @default(autoincrement())
  caseId    Int           // معرّف القضية
  title     String        // عنوان الحدث
  date      DateTime      // التاريخ الفعلي للحدث
  type      CaseEventType // HEARING, DEADLINE, MEETING, TASK, VERDICT, APPEAL, OTHER
  location  String?       // موقع الحدث
  notifyAt  DateTime?     // موعد التذكير (محسوب تلقائياً)
  notified  Boolean       // هل تمّ الإرسال؟
}
```

#### الحساب الحرج:
```
notifyAt = date - (remindBefore * 60_000 milliseconds)
```

**مثال:**
```
date = 2026-08-15T10:00:00Z
remindBefore = 1440 دقيقة (= 1 يوم)
notifyAt = 2026-08-14T10:00:00Z
```

---

### 2️⃣ مكوّن الواجهة: `AddCaseEvent`
**الملف:** `app/(site)/cases/[id]/AddCaseEvent.tsx`

**المدخلات:**
- `title`: عنوان الحدث (إلزامي)
- `type`: نوع الحدث (HEARING, DEADLINE, ...)
- `date`: تاريخ ووقت الحدث
- `location`: الموقع (اختياري)
- `remindBefore`: فترة التذكير **بالدقائق** (إلزامي)
- `note`: ملاحظات داخلية (اختياري)

**الخيارات الافتراضية:**
```javascript
REMIND_OPTIONS = [
  { value: 0, label: "بلا تذكير" },
  { value: 60, label: "قبل ساعة" },        // 60 دقيقة
  { value: 1440, label: "قبل يوم" },       // 24 * 60 دقيقة
  { value: 2880, label: "قبل يومين" },     // 48 * 60 دقيقة
  { value: 10080, label: "قبل أسبوع" },    // 7 * 24 * 60 دقيقة
]
```

---

### 3️⃣ API: إضافة الحدث
**الملف:** `app/api/cases/[id]/events/route.ts`

**الطلب:**
```bash
POST /api/cases/[id]/events
Content-Type: application/json

{
  "title": "جلسة الاستئناف",
  "type": "HEARING",
  "date": "2026-08-15T10:00:00Z",
  "location": "قاعة المحكمة رقم 5",
  "remindBefore": 1440,
  "note": "جلسة حاسمة"
}
```

**الاستجابة:**
```json
{ "ok": true }
```

**الخوارزمية:**
1. التحقّق من الصلاحيات (requireCaseAccess)
2. التحقّق من البيانات
3. حساب notifyAt:
   ```javascript
   notifyAt = remindBefore > 0
     ? new Date(date.getTime() - remindBefore * 60_000)
     : null
   ```
4. إنشاء CaseEvent

---

### 4️⃣ Cron Job: إرسال التذكيرات
**الملف:** `app/api/cron/case-reminders/route.ts`

**الاستدعاء:**
```bash
GET /api/cron/case-reminders
Authorization: Bearer <CRON_SECRET>
```

**الخطوات:**
1. البحث عن الأحداث المستحقّة:
   ```sql
   SELECT * FROM "CaseEvent"
   WHERE notified = false
   AND notifyAt <= NOW()
   LIMIT 100
   ```

2. لكل حدث:
   - جمع المستقبلات (صاحب القضية + المكلّفون)
   - صياغة رسالة:
     ```
     العنوان: "🔔 تذكير: جلسة — قضية رقم #123"
     الجسم: "جلسة الاستئناف بتاريخ 15 أغسطس 2026"
     ```
   - إرسال Push Notification
   - تعيين notified = true

---

### 5️⃣ جدولة Cron: Vercel
**الملف:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/case-reminders",
      "schedule": "0 3 * * *"  // يومياً الساعة 03:00 UTC
    }
  ]
}
```

**صيغة الجدول (cron syntax):**
```
0 3 * * *
│ │ │ │ └─ يوم الأسبوع (0-6)
│ │ │ └─── الشهر (1-12)
│ │ └───── يوم الشهر (1-31)
│ └─────── الساعة (0-23)
└───────── الدقيقة (0-59)

صيغ شائعة:
- "0 3 * * *"  = كل يوم الساعة 3 صباحاً
- "0 * * * *"  = كل ساعة (Pro plan فقط)
- "*/30 * * * *" = كل 30 دقيقة (Pro plan فقط)
```

---

## 🔧 الإعداد والتكوين

### متطلبات البيئة:

```bash
# في Vercel Environment Variables:
CRON_SECRET=your_secret_here  # قيمة عشوائية قوية
DIRECT_URL=postgresql://...   # للهجرات (في .env محلي)
DATABASE_URL=postgresql://... # مع pooler (في Vercel)
```

### خطوات الإعداد:

1. **أضف CRON_SECRET إلى Vercel:**
   - Dashboard → Project Settings → Environment Variables
   - أضف: `CRON_SECRET=<قيمة عشوائية>`

2. **تأكّد من وجود vercel.json:**
   ```bash
   cat vercel.json  # يجب أن يحتوي على crons section
   ```

3. **اختبر محلياً (اختياري):**
   ```bash
   # إنشاء متغيّر محلي
   export CRON_SECRET="test-secret"
   
   # اختبر الـ API
   curl -H "Authorization: Bearer test-secret" \
        http://localhost:3000/api/cron/case-reminders
   ```

---

## 📊 جداول مرجعية

### CaseEventType (أنواع الأحداث)

| النوع | الوصف | مثال |
|-------|-------|------|
| HEARING | جلسة قضائية | "جلسة أمام محكمة الاستئناف" |
| DEADLINE | موعد نهائي | "آخر موعد لتقديم المستندات" |
| MEETING | اجتماع مع الموكّل | "اجتماع مع العميل لمراجعة الحالة" |
| TASK | مهمة داخلية | "صياغة دعوى جديدة" |
| VERDICT | صدور حكم | "صدور حكم الاستئناف" |
| APPEAL | تقديم طعن | "تاريخ تقديم الطعن" |
| OTHER | أحداث أخرى | أي شيء آخر |

### فترات التذكير الشائعة

| الدقائق | الساعات | الأيام | الملصق |
|---------|---------|--------|---------|
| 0 | 0 | 0 | بلا تذكير |
| 60 | 1 | - | قبل ساعة |
| 1440 | 24 | 1 | قبل يوم |
| 2880 | 48 | 2 | قبل يومين |
| 10080 | 168 | 7 | قبل أسبوع |

---

## 🐛 استكشاف الأخطاء

### المشكلة: لا تذكيرات ترسل

**الفحوصات:**

1. **CRON_SECRET موجود؟**
   ```bash
   # في Vercel dashboard
   Settings → Environment Variables → ابحث عن CRON_SECRET
   ```

2. **جدول Cron مفعّل؟**
   ```bash
   # في Dashboard Vercel
   Deployments → [deployment] → Functions → case-reminders
   ```

3. **توجد أحداث مستحقّة؟**
   ```sql
   -- في قاعدة البيانات:
   SELECT * FROM "CaseEvent"
   WHERE notified = false
   AND notifyAt <= NOW()
   LIMIT 5;
   ```

4. **Hobby vs Pro plan:**
   - Hobby (مجاني): كرون يومي فقط
   - Pro: كرون كل ساعة (عدّل schedule إذا ترقّيت)

5. **شغّل تجربة يدوية:**
   ```bash
   curl -X GET \
     -H "Authorization: Bearer <CRON_SECRET>" \
     https://yoursite.com/api/cron/case-reminders
   
   # يجب أن ترى: { "ok": true, "processed": N, "sent": M }
   ```

### المشكلة: التذكير ترسل مرات متعدّدة

**الحل:**
- تحقّق من أن `notified` يُعيّن إلى `true` بعد الإرسال
- تأكّد من عدم تشغيل Cron مرات متعدّدة

### المشكلة: التواريخ غير صحيحة

**ملاحظة:** الجدول Cron يعمل في منطقة زمنية UTC
- المكون يستخدم: `datetime-local` (المنطقة المحلية للمستخدم)
- يُحوّل إلى ISO8601 عند الإرسال
- الخادم يخزّنه بـ UTC

---

## 📚 ملفات ذات صلة

```
legal-advisor-ui/
├── prisma/
│   └── schema.prisma              # ← CaseEvent و CaseEventType
├── app/api/
│   ├── cases/[id]/events/
│   │   └── route.ts               # ← POST handler (حساب notifyAt)
│   └── cron/
│       └── case-reminders/
│           └── route.ts           # ← GET handler (إرسال التذكيرات)
├── app/(site)/cases/[id]/
│   └── AddCaseEvent.tsx           # ← مكوّن الواجهة
├── lib/
│   └── notify.ts                  # ← دالة إرسال الإشعارات
├── vercel.json                    # ← جدولة Cron
└── docs/
    └── CASE_REMINDERS_SYSTEM.md   # ← هذا الملف
```

---

## ✅ قائمة المراجعة: إطلاق الإنتاج

- [ ] CRON_SECRET في Vercel Environment Variables
- [ ] vercel.json يحتوي على crons section
- [ ] تجربة إضافة حدث محلياً
- [ ] تأكّد من `notifyAt` محسوب صحيح
- [ ] اختبر Cron يدوياً (curl مع CRON_SECRET)
- [ ] راقب Vercel logs أول 24 ساعة
- [ ] اختبر مع Hobby plan أولاً (كرون يومي)

---

## 📞 أسئلة شائعة

**س: لماذا remindBefore بالدقائق وليس الساعات؟**
> ج: لأن Cron تعمل كل دقيقة، والدقائق أكثر دقّة. يمكنك حساب: الساعات × 60 = دقائق

**س: هل يمكن تغيير وقت Cron؟**
> ج: نعم، عدّل `schedule` في vercel.json. الافتراضي "0 3 * * *" = 03:00 UTC يومياً

**س: ماذا لو فشل إرسال إشعار واحد؟**
> ج: `Promise.allSettled` تتابع الإشعارات الأخرى (لا توقف عند فشل واحد)

**س: هل تُرسل تذكيرات للأحداث القديمة؟**
> ج: نعم، إذا `notifyAt <= NOW()` و `notified = false`

---

## 🔗 المراجع

- Vercel Cron: https://vercel.com/docs/cron-jobs
- Prisma: https://www.prisma.io/docs/
- NextAuth: https://next-auth.js.org/

---

**آخر تحديث:** 24 يوليو 2026
**الحالة:** موثّق بالكامل

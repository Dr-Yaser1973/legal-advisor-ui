 "use client";
// app/(auth)/register/page.tsx — نسخة موحدة (desktop + mobile)

import { useState } from "react";
import Link from "next/link";
import {
  User, Briefcase, Building2, Languages, ChevronRight,
  CheckCircle2, Scale, ArrowRight,
} from "lucide-react";

// ─── أنواع ───────────────────────────────────────────────────────────────────
type Role = "CLIENT" | "LAWYER" | "LAW_FIRM" | "TRANSLATION_OFFICE" | "COMPANY";
type Step = 1 | 2 | 3;

interface FormData {
  // مشترك
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  // CLIENT
  fullName: string;
  // LAWYER
  barNumber: string;
  officeAddress: string;
  // LAW_FIRM / TRANSLATION_OFFICE / COMPANY
  orgName: string;
  businessType: string;
  // TRANSLATION_OFFICE
  translationLangs: string;
}

// ─── تعريف الأدوار ────────────────────────────────────────────────────────────
const ROLES: {
  key: Role;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}[] = [
  {
    key: "CLIENT",
    icon: <User className="w-5 h-5" />,
    title: "مستخدم عادي",
    desc: "تصفح المكتبة، إنشاء العقود وطلب الاستشارات",
  },
  {
    key: "LAWYER",
    icon: <Briefcase className="w-5 h-5" />,
    title: "محامٍ",
    desc: "استقبل الاستشارات ووسّع حضورك المهني",
    badge: "يتطلب مراجعة",
  },
  {
    key: "LAW_FIRM",
    icon: <Building2 className="w-5 h-5" />,
    title: "مكتب محاماة",
    desc: "سجّل مكتبك وابدأ استقبال العملاء عبر المنصة",
    badge: "يتطلب مراجعة",
  },
  {
    key: "TRANSLATION_OFFICE",
    icon: <Languages className="w-5 h-5" />,
    title: "مكتب ترجمة",
    desc: "استقبل طلبات الترجمة القانونية المتخصصة",
    badge: "يتطلب مراجعة",
  },
  {
    key: "COMPANY",
    icon: <Building2 className="w-5 h-5" />,
    title: "شركة",
    desc: "إدارة القضايا والعقود المؤسسية",
    badge: "يتطلب مراجعة",
  },
];

const BUSINESS_TYPES = [
  "تجارة عامة", "مقاولات وإنشاءات", "استيراد وتصدير",
  "خدمات مالية", "تكنولوجيا", "رعاية صحية",
  "عقارات", "نقل ولوجستيات", "تعليم", "أخرى",
];

const TRANSLATION_LANG_PAIRS = [
  "عربي ↔ إنجليزي", "عربي ↔ فرنسي", "عربي ↔ ألماني",
  "عربي ↔ فارسي", "عربي ↔ تركي", "متعدد اللغات",
];

// ─── الصفحة الرئيسية ─────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep]       = useState<Step>(1);
  const [role, setRole]       = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [form, setForm] = useState<FormData>({
    email: "", password: "", confirmPassword: "", phone: "",
    fullName: "", barNumber: "", officeAddress: "",
    orgName: "", businessType: "", translationLangs: "",
  });

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function selectRole(r: Role) {
    setRole(r);
    setStep(2);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("كلمة المرور غير متطابقة."); return;
    }
    if (form.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل."); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email:          form.email,
          password:       form.password,
          fullName:       form.fullName  || null,
          phone:          form.phone     || null,
          barNumber:      form.barNumber || null,
          officeAddress:  form.officeAddress || null,
          orgName:        form.orgName   || null,
          businessType:   form.businessType  || null,
          translationLangs: form.translationLangs || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message || "حدث خطأ أثناء التسجيل."); return;
      }

      setIsPending(!!data.pending);
      setStep(3);
    } catch {
      setError("حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  // ─── CSS classes مشتركة ──────────────────────────────────────────────────
  const inputCls =
    "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm " +
    "text-zinc-100 placeholder:text-zinc-500 focus:outline-none " +
    "focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition";
  const labelCls = "block text-xs text-zinc-400 mb-1.5 font-medium";

  const roleInfo = ROLES.find((r) => r.key === role);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-10"
      dir="rtl"
    >
      <div className="w-full max-w-md space-y-6">

        {/* الشعار والعنوان */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center">
            <Scale className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold">المستشار القانوني الذكي</h1>
          <p className="text-sm text-zinc-400">إنشاء حساب جديد</p>
        </div>

        {/* مؤشر الخطوات */}
        <div className="flex items-center justify-center gap-2 text-xs" aria-label="مؤشر التقدم">
          {["اختيار النوع", "البيانات", "تأكيد"].map((label, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  step > idx + 1
                    ? "bg-emerald-600 text-white"
                    : step === idx + 1
                    ? "bg-amber-500 text-black"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {step > idx + 1 ? "✓" : idx + 1}
              </div>
              <span className={step === idx + 1 ? "text-zinc-200" : "text-zinc-600"}>
                {label}
              </span>
              {idx < 2 && <div className="w-5 h-px bg-zinc-700 mx-0.5" />}
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            الخطوة 1 — اختيار نوع الحساب
        ══════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400 text-center">اختر نوع حسابك</p>

            {ROLES.map((r) => (
              <button
                key={r.key}
                onClick={() => selectRole(r.key)}
                className="w-full flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-right hover:border-emerald-600/60 hover:bg-zinc-900/80 transition group"
              >
                <div className="rounded-xl bg-zinc-800 p-2.5 text-emerald-400 flex-shrink-0 group-hover:bg-zinc-700 transition">
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{r.title}</span>
                    {r.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {r.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 truncate">{r.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
              </button>
            ))}

            <p className="text-center text-xs text-zinc-500 pt-2">
              لديك حساب؟{" "}
              <Link href="/login" className="text-emerald-400 hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            الخطوة 2 — استمارة التسجيل
        ══════════════════════════════════════════════════════════ */}
        {step === 2 && role && (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* زر العودة */}
            <button
              type="button"
              onClick={() => { setStep(1); setError(null); }}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
              تغيير نوع الحساب
            </button>

            {/* بادج نوع الحساب */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-400 flex items-center gap-2">
              <span className="text-zinc-500">نوع الحساب:</span>
              <span className="text-emerald-300 font-semibold">{roleInfo?.title}</span>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* ── CLIENT ── */}
            {role === "CLIENT" && (
              <>
                <div>
                  <label className={labelCls}>الاسم الكامل (اختياري)</label>
                  <input className={inputCls} placeholder="اسمك الكامل" value={form.fullName} onChange={set("fullName")} />
                </div>
                <div>
                  <label className={labelCls}>رقم الهاتف (اختياري)</label>
                  <input className={inputCls} placeholder="+964 7xx xxx xxxx" value={form.phone} onChange={set("phone")} />
                </div>
              </>
            )}

            {/* ── LAWYER ── */}
            {role === "LAWYER" && (
              <>
                <div>
                  <label className={labelCls}>اسم المحامي الكامل *</label>
                  <input className={inputCls} placeholder="الاسم الثلاثي" value={form.fullName} onChange={set("fullName")} required />
                </div>
                <div>
                  <label className={labelCls}>رقم هوية نقابة المحامين *</label>
                  <input className={inputCls} placeholder="رقم الهوية النقابية" value={form.barNumber} onChange={set("barNumber")} required />
                </div>
                <div>
                  <label className={labelCls}>رقم هاتف العمل *</label>
                  <input className={inputCls} placeholder="+964 7xx xxx xxxx" value={form.phone} onChange={set("phone")} required />
                </div>
                <div>
                  <label className={labelCls}>عنوان مكتب العمل *</label>
                  <input className={inputCls} placeholder="المدينة، الحي، اسم المبنى" value={form.officeAddress} onChange={set("officeAddress")} required />
                </div>
                <PendingNotice />
              </>
            )}

            {/* ── LAW_FIRM ── */}
            {role === "LAW_FIRM" && (
              <>
                <div>
                  <label className={labelCls}>اسم مكتب المحاماة *</label>
                  <input className={inputCls} placeholder="الاسم الرسمي للمكتب" value={form.orgName} onChange={set("orgName")} required />
                </div>
                <div>
                  <label className={labelCls}>اسم المسؤول *</label>
                  <input className={inputCls} placeholder="اسم الشخص المسؤول" value={form.fullName} onChange={set("fullName")} required />
                </div>
                <div>
                  <label className={labelCls}>رقم الهاتف *</label>
                  <input className={inputCls} placeholder="+964 7xx xxx xxxx" value={form.phone} onChange={set("phone")} required />
                </div>
                <div>
                  <label className={labelCls}>عنوان المقر الرئيسي *</label>
                  <input className={inputCls} placeholder="المدينة، الحي، اسم المبنى" value={form.officeAddress} onChange={set("officeAddress")} required />
                </div>
                <PendingNotice />
              </>
            )}

            {/* ── TRANSLATION_OFFICE ── */}
            {role === "TRANSLATION_OFFICE" && (
              <>
                <div>
                  <label className={labelCls}>اسم مكتب الترجمة *</label>
                  <input className={inputCls} placeholder="الاسم الرسمي للمكتب" value={form.orgName} onChange={set("orgName")} required />
                </div>
                <div>
                  <label className={labelCls}>اسم المسؤول *</label>
                  <input className={inputCls} placeholder="اسم الشخص المسؤول" value={form.fullName} onChange={set("fullName")} required />
                </div>
                <div>
                  <label className={labelCls}>رقم الهاتف *</label>
                  <input className={inputCls} placeholder="+964 7xx xxx xxxx" value={form.phone} onChange={set("phone")} required />
                </div>
                <div>
                  <label className={labelCls}>عنوان المكتب *</label>
                  <input className={inputCls} placeholder="المدينة، الحي، اسم المبنى" value={form.officeAddress} onChange={set("officeAddress")} required />
                </div>
                <div>
                  <label className={labelCls}>اللغات المتخصصة *</label>
                  <select className={inputCls} value={form.translationLangs} onChange={set("translationLangs")} required>
                    <option value="">-- اختر اللغات --</option>
                    {TRANSLATION_LANG_PAIRS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <PendingNotice />
              </>
            )}

            {/* ── COMPANY ── */}
            {role === "COMPANY" && (
              <>
                <div>
                  <label className={labelCls}>اسم الشركة *</label>
                  <input className={inputCls} placeholder="الاسم الرسمي للشركة" value={form.orgName} onChange={set("orgName")} required />
                </div>
                <div>
                  <label className={labelCls}>اسم المسؤول القانوني *</label>
                  <input className={inputCls} placeholder="اسم الشخص المسؤول" value={form.fullName} onChange={set("fullName")} required />
                </div>
                <div>
                  <label className={labelCls}>رقم الهاتف *</label>
                  <input className={inputCls} placeholder="+964 7xx xxx xxxx" value={form.phone} onChange={set("phone")} required />
                </div>
                <div>
                  <label className={labelCls}>عنوان الشركة *</label>
                  <input className={inputCls} placeholder="المدينة، الحي، اسم المبنى" value={form.officeAddress} onChange={set("officeAddress")} required />
                </div>
                <div>
                  <label className={labelCls}>نوع النشاط التجاري *</label>
                  <select className={inputCls} value={form.businessType} onChange={set("businessType")} required>
                    <option value="">-- اختر نوع النشاط --</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <PendingNotice />
              </>
            )}

            {/* ── بيانات مشتركة (بريد + كلمة مرور) ── */}
            <div className="border-t border-zinc-800 pt-4 space-y-3">
              <div>
                <label className={labelCls}>البريد الإلكتروني *</label>
                <input
                  type="email"
                  className={inputCls}
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={labelCls}>كلمة المرور *</label>
                <input
                  type="password"
                  className={inputCls}
                  placeholder="6 أحرف على الأقل"
                  value={form.password}
                  onChange={set("password")}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className={labelCls}>تأكيد كلمة المرور *</label>
                <input
                  type="password"
                  className={inputCls}
                  placeholder="أعد كتابة كلمة المرور"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 py-3.5 text-sm font-bold text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "جارٍ إرسال الطلب..." : "إرسال طلب التسجيل"}
            </button>

            <p className="text-center text-xs text-zinc-500">
              لديك حساب؟{" "}
              <Link href="/login" className="text-emerald-400 hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════
            الخطوة 3 — تأكيد
        ══════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="text-center space-y-4 py-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400" />
            </div>

            {isPending ? (
              <>
                <h2 className="text-lg font-bold text-white">تم إرسال طلب التسجيل</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  سيتم مراجعة بياناتك من قِبل فريق الإدارة.<br />
                  ستصلك رسالة على بريدك الإلكتروني عند تفعيل الحساب.
                </p>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
                  ⏳ وقت المراجعة المعتاد: 24–48 ساعة
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white">تم إنشاء الحساب بنجاح</h2>
                <p className="text-sm text-zinc-400">يمكنك تسجيل الدخول الآن.</p>
              </>
            )}

            <Link
              href="/login"
              className="inline-block w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-3 text-sm font-semibold text-white transition"
            >
              الانتقال لتسجيل الدخول
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── مكوّن تنبيه المراجعة ─────────────────────────────────────────────────────
function PendingNotice() {
  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
      ⚠️ سيتم مراجعة بياناتك من قِبل الإدارة قبل تفعيل الحساب.
    </div>
  );
}

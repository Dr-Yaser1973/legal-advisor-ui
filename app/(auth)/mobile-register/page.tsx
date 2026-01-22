"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { User, Briefcase, Building2, Languages } from "lucide-react";

type Role = "CLIENT" | "LAWYER" | "COMPANY" | "TRANSLATION_OFFICE";

export default function MobileRegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<Role | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectRole = (r: Role) => {
    setRole(r);
    setStep(2);
  };

  const submit = async () => {
    if (!email || !password || !role) {
      setError("يرجى إدخال جميع الحقول");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // تسجيل عبر Credentials (سيعمل كـ Register + Login حسب API عندك)
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        role,
        callbackUrl: "/",
      });

      if (res?.error) {
        setError("فشل إنشاء الحساب أو تسجيل الدخول");
      } else {
        setStep(3);
        setTimeout(() => router.push("/"), 1200);
      }
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100"
    >
      {/* رأس الصفحة */}
      <div className="border-b border-zinc-800 px-5 py-4 text-center">
        <h1 className="text-lg font-semibold">إنشاء حساب</h1>
        <p className="mt-1 text-xs text-zinc-400">
          المستشار القانوني الذكي
        </p>
      </div>

      {/* المحتوى */}
      <div className="flex-1 px-5 py-6">
        {/* الخطوة 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="mb-3 text-sm font-medium text-zinc-300">
              اختر نوع الحساب
            </h2>

            <RoleCard
              icon={<User className="h-5 w-5" />}
              title="مستخدم عادي"
              desc="تصفح المكتبة، إنشاء العقود وطلب الاستشارات"
              onClick={() => selectRole("CLIENT")}
            />

            <RoleCard
              icon={<Briefcase className="h-5 w-5" />}
              title="محامي"
              desc="استقبل الاستشارات ووسّع حضورك المهني"
              onClick={() => selectRole("LAWYER")}
            />

            <RoleCard
              icon={<Building2 className="h-5 w-5" />}
              title="شركة"
              desc="إدارة القضايا والعقود المؤسسية"
              onClick={() => selectRole("COMPANY")}
            />

            <RoleCard
              icon={<Languages className="h-5 w-5" />}
              title="مكتب ترجمة"
              desc="استقبل طلبات الترجمة القانونية"
              onClick={() => selectRole("TRANSLATION_OFFICE")}
            />

            <div className="pt-4 text-center">
              <Link
                href="/"
                className="text-xs text-zinc-400 underline"
              >
                تصفح المنصة كضيف
              </Link>
            </div>
          </div>
        )}

        {/* الخطوة 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-sm font-medium text-zinc-300">
              أدخل بيانات الدخول
            </h2>

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm outline-none focus:border-emerald-600"
              />

              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm outline-none focus:border-emerald-600"
              />
            </div>

            <div className="text-xs text-zinc-400">
              بإنشاء الحساب، أنت توافق على{" "}
              <Link href="/terms" className="underline">
                شروط الاستخدام
              </Link>{" "}
              و{" "}
              <Link href="/privacy" className="underline">
                سياسة الخصوصية
              </Link>
            </div>
          </div>
        )}

        {/* الخطوة 3 */}
        {step === 3 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-emerald-900/30 p-4 text-emerald-400">
              ✔
            </div>
            <h2 className="text-lg font-semibold">
              تم إنشاء الحساب بنجاح
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              سيتم تحويلك إلى المنصة الآن
            </p>
          </div>
        )}
      </div>

      {/* زر ثابت أسفل الشاشة */}
      {step === 2 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950 p-3">
          <button
            disabled={loading}
            onClick={submit}
            className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white disabled:opacity-50"
          >
            {loading ? "جارٍ المعالجة..." : "إنشاء الحساب والدخول"}
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================
   كارد اختيار الدور
========================= */
function RoleCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-right transition hover:border-emerald-700 hover:bg-zinc-900/80"
    >
      <div className="rounded-lg bg-zinc-800 p-2 text-emerald-400">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs text-zinc-400">
          {desc}
        </div>
      </div>
    </button>
  );
}


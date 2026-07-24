"use client";
// components/admin/AddAccountForm.tsx
// نموذج إضافة حساب يدوياً (شركة/مكتب ترجمة/محامٍ) — قابل للطيّ.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

type Role = "COMPANY" | "TRANSLATION_OFFICE" | "LAWYER" | "LAW_FIRM";

// نقطة النهاية المناسبة لكل دور
const ENDPOINT: Record<Role, string> = {
  COMPANY: "/api/admin/companies",
  TRANSLATION_OFFICE: "/api/admin/translation-offices",
  LAWYER: "/api/admin/lawyers",
  LAW_FIRM: "/api/admin/firms",
};

const NAME_LABEL: Record<Role, string> = {
  COMPANY: "اسم الشركة",
  TRANSLATION_OFFICE: "اسم المكتب",
  LAWYER: "اسم المحامي",
  LAW_FIRM: "اسم المكتب",
};

// مسار الإنشاء لكل دور يقبل شكل حقول مختلف — نطابقه هنا
function buildPayload(role: Role, form: { name: string; email: string; phone: string; location: string }) {
  if (role === "LAW_FIRM") {
    // مسار firms ينشئ مؤسسة كاملة ويتطلّب orgName
    return {
      orgName: form.name,
      contactName: form.name,
      email: form.email,
      phone: form.phone,
      city: form.location,
    };
  }
  // بقية الأدوار: {name, email, phone, location}
  return form;
}

export default function AddAccountForm({
  role,
  title,
}: {
  role: Role;
  title: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setError(null);
    setOk(null);
    if (!form.name.trim() || !form.email.trim()) {
      setError("الاسم والبريد الإلكتروني مطلوبان.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(ENDPOINT[role], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(role, form)),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) { setError(d?.error || "تعذّر الإنشاء."); return; }
      setOk("✓ تم الإنشاء وإرسال رابط التفعيل.");
      setForm({ name: "", email: "", phone: "", location: "" });
      router.refresh();
    } catch {
      setError("حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring focus:ring-emerald-500/40";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-sm font-medium"
      >
        <Plus className="w-4 h-4" /> {title}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
        <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-300">
          {error}
        </div>
      )}
      {ok && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-300">
          {ok}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <input className={field} placeholder={NAME_LABEL[role]} value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input className={field} placeholder="البريد الإلكتروني" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input className={field} placeholder="رقم الهاتف (اختياري)" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input className={field} placeholder="الموقع / العنوان (اختياري)" value={form.location} onChange={(e) => set("location", e.target.value)} />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "جارٍ الحفظ…" : "إنشاء وإرسال دعوة"}
      </button>
    </div>
  );
}

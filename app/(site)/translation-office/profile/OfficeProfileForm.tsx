// app/(site)/translation-office/profile/OfficeProfileForm.tsx
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  name: string;
  phone: string;
  location: string;
  bio: string;
  image: string | null;
};

const MAX_BIO = 600;
const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "مك";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

export default function OfficeProfileForm({
  initial,
  publicHref,
}: {
  initial: Initial;
  publicHref: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [location, setLocation] = useState(initial.location);
  const [bio, setBio] = useState(initial.bio);

  const [preview, setPreview] = useState<string | null>(initial.image);
  const [file, setFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  function pickFile(f: File | null) {
    setMsg(null);
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      setMsg({ type: "err", text: "صيغة غير مدعومة (JPG, PNG, WEBP, SVG)" });
      return;
    }
    if (f.size > MAX_SIZE) {
      setMsg({ type: "err", text: "حجم الشعار كبير (الحد الأقصى 2MB)" });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("phone", phone);
      fd.append("location", location);
      fd.append("bio", bio);
      if (file) fd.append("file", file);

      const res = await fetch("/api/translation-office/profile", {
        method: "POST",
        body: fd,
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg({ type: "err", text: json?.error || "تعذر حفظ الملف التعريفي" });
      } else {
        setMsg({ type: "ok", text: "تم حفظ الملف التعريفي بنجاح ✓" });
        setFile(null);
        if (json?.office?.image) setPreview(json.office.image);
        router.refresh();
      }
    } catch {
      setMsg({ type: "err", text: "حدث خطأ في الاتصال. حاول مرة أخرى." });
    } finally {
      setSaving(false);
    }
  }

  const bioLeft = MAX_BIO - bio.length;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-3xl border border-purple-500/20 bg-[#1e1133]/35 p-6 sm:p-8"
    >
      {/* الشعار */}
      <section className="space-y-3">
        <label className="block text-sm font-semibold text-purple-100">
          شعار المكتب
        </label>
        <div className="flex items-center gap-5">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="شعار المكتب"
              className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-amber-400/40"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 text-2xl font-bold text-white ring-2 ring-amber-400/40">
              {initials(name)}
            </div>
          )}

          <div className="space-y-1.5">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#1e1133]/60 px-4 py-2 text-sm text-white transition hover:border-amber-400/50"
            >
              اختيار صورة / شعار
            </button>
            <p className="text-[11px] text-purple-200/60">
              JPG أو PNG أو WEBP أو SVG — بحد أقصى 2MB. يُفضّل شكل مربع.
            </p>
          </div>
        </div>
      </section>

      {/* النبذة */}
      <section className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-semibold text-purple-100">
          نبذة مختصرة عن المكتب
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO))}
          rows={5}
          placeholder="مثال: مكتب ترجمة قانونية معتمد منذ 2010، متخصص في ترجمة العقود والوثائق الرسمية بين العربية والإنجليزية…"
          className="w-full resize-y rounded-xl border border-purple-500/25 bg-[#1e1133]/50 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-purple-300/40 outline-none transition focus:border-amber-400/50 focus:bg-[#1e1133]/80"
        />
        <div className="text-left text-[11px] text-purple-200/60">
          {bioLeft} حرف متبقٍ
        </div>
      </section>

      {/* بيانات التواصل */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="اسم المكتب">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المكتب"
            className="w-full rounded-xl border border-purple-500/25 bg-[#1e1133]/50 px-4 py-2.5 text-sm text-white placeholder:text-purple-300/40 outline-none transition focus:border-amber-400/50 focus:bg-[#1e1133]/80"
          />
        </Field>
        <Field label="المدينة / العنوان">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="مثال: بغداد – الكرادة"
            className="w-full rounded-xl border border-purple-500/25 bg-[#1e1133]/50 px-4 py-2.5 text-sm text-white placeholder:text-purple-300/40 outline-none transition focus:border-amber-400/50 focus:bg-[#1e1133]/80"
          />
        </Field>
        <Field label="رقم الهاتف">
          <input
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+964…"
            className="w-full rounded-xl border border-purple-500/25 bg-[#1e1133]/50 px-4 py-2.5 text-right text-sm text-white placeholder:text-purple-300/40 outline-none transition focus:border-amber-400/50 focus:bg-[#1e1133]/80"
          />
        </Field>
      </section>

      {/* رسالة الحالة */}
      {msg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            msg.type === "ok"
              ? "bg-emerald-500/12 text-emerald-300"
              : "bg-red-500/12 text-red-300"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* أزرار */}
      <div className="flex flex-wrap items-center gap-3 border-t border-purple-500/15 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-amber-700 to-amber-500 px-6 py-2.5 text-sm font-medium text-amber-950 transition hover:from-amber-600 hover:to-amber-400 disabled:opacity-60"
        >
          {saving ? "جارٍ الحفظ…" : "حفظ الملف التعريفي"}
        </button>
        <Link
          href={publicHref}
          className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 px-5 py-2.5 text-sm text-purple-200 transition hover:border-amber-400/40 hover:text-white"
        >
          معاينة الصفحة العامة
          <span>←</span>
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-purple-300">{label}</label>
      {children}
    </div>
  );
}

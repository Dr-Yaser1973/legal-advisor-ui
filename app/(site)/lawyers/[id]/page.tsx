 // app/(site)/lawyers/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";

type Lawyer = {
  id: number; fullName: string; email: string | null; avatarUrl: string | null;
  bio: string; specialization: string; phone: string; location: string;
  rating: number; consultFee: number | null; consultCurrency: string;
  officeAddress: string;
};

 export default function LawyerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const currentUser = (session?.user as any);
  const isOwner = Number(currentUser?.id) === Number(id);
  const isAdmin = currentUser?.role === "ADMIN";

  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);

  // ── حالة النبذة ──
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const [bioLoading, setBioLoading] = useState(false);
  const [bioMsg, setBioMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ── حالة الصورة ──
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/lawyers/${id}`)
      .then((r) => r.json())
      .then((d) => { setLawyer(d.lawyer); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function submitBio() {
    if (!bioText.trim()) return;
    setBioLoading(true); setBioMsg(null);
    const res = await fetch(`/api/lawyers/${id}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: bioText }),
    });
    const json = await res.json();
    setBioLoading(false);
    if (res.ok) {
      setBioMsg({ type: "ok", text: json.message });
      setEditingBio(false);
    } else {
      setBioMsg({ type: "err", text: json.error });
    }
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setAvatarLoading(true); setAvatarMsg(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/lawyers/${id}/profile`, {
      method: "POST", body: form,
    });
    const json = await res.json();
    setAvatarLoading(false);
    if (res.ok) setAvatarMsg({ type: "ok", text: json.message });
    else setAvatarMsg({ type: "err", text: json.error });
  }

  if (loading) return <p className="p-6 text-zinc-400">جاري التحميل...</p>;
  if (!lawyer) return <p className="p-6 text-red-400">المحامي غير موجود.</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6 text-right" dir="rtl">

      {/* رأس الصفحة */}
      <header className="flex items-center gap-4">
        <div className="relative">
          <img
            src={lawyer.avatarUrl || "/default-lawyer.png"}
            alt={lawyer.fullName}
            className="w-24 h-24 rounded-full object-cover border border-zinc-700/60"
          />
          {/* زر رفع الصورة للمحامي */}
          {isOwner && (
            <label className="absolute bottom-0 left-0 bg-zinc-800 border border-zinc-600 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition" title="تغيير الصورة">
              {avatarLoading ? "⏳" : "📷"}
              <input type="file" hidden accept="image/*" onChange={uploadAvatar} />
            </label>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{lawyer.fullName}</h1>
          <div className="text-sm text-zinc-300">{lawyer.specialization} • {lawyer.location}</div>
          <div className="text-sm text-yellow-400 mt-1">⭐ {lawyer.rating.toFixed(1)}</div>
        </div>
      </header>

      {/* رسالة الصورة */}
      {avatarMsg && (
        <p className={`text-sm rounded-lg px-3 py-2 border ${avatarMsg.type === "ok" ? "text-emerald-300 border-emerald-500/40 bg-emerald-950/30" : "text-red-300 border-red-500/40 bg-red-950/30"}`}>
          {avatarMsg.text}
        </p>
      )}

      {/* النبذة */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-white">نبذة عن المحامي</h2>
          {isOwner && !editingBio && (
            <button
              onClick={() => { setEditingBio(true); setBioText(lawyer.bio || ""); setBioMsg(null); }}
              className="text-xs px-3 py-1 rounded-lg border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 transition"
            >
              ✏️ تعديل النبذة
            </button>
          )}
        </div>

        {editingBio ? (
          <div className="space-y-2">
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              rows={5}
              maxLength={1000}
              placeholder="اكتب نبذة تعريفية عنك (20-1000 حرف)..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{bioText.length}/1000</span>
              <div className="flex gap-2">
                <button onClick={() => { setEditingBio(false); setBioMsg(null); }} className="text-xs px-3 py-1 rounded-lg border border-zinc-600 text-zinc-400 hover:bg-zinc-800 transition">
                  إلغاء
                </button>
                <button onClick={submitBio} disabled={bioLoading || bioText.trim().length < 20} className="text-xs px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50">
                  {bioLoading ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm text-zinc-100">
            {lawyer.bio || (isOwner ? "لم تكتب نبذة بعد — اضغط تعديل النبذة لإضافتها." : "لا توجد نبذة.")}
          </p>
        )}

        {bioMsg && (
          <p className={`text-sm rounded-lg px-3 py-2 border ${bioMsg.type === "ok" ? "text-emerald-300 border-emerald-500/40 bg-emerald-950/30" : "text-red-300 border-red-500/40 bg-red-950/30"}`}>
            {bioMsg.text}
          </p>
        )}

        {/* تنبيه للمحامي */}
        {isOwner && (
          <p className="text-xs text-zinc-500 border border-zinc-700/50 rounded-lg px-3 py-2 bg-zinc-900/40">
            ℹ️ النبذة والصورة التي ترسلها ستظهر للزوار فقط بعد مراجعة وموافقة الإدارة.
          </p>
        )}
      </section>

      {/* معلومات إضافية */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {lawyer.consultFee && (
          <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
            <div className="text-zinc-400">أجرة الاستشارة</div>
            <div className="font-semibold text-zinc-100">{lawyer.consultFee} {lawyer.consultCurrency}</div>
          </div>
        )}
        {lawyer.email && (
          <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
            <div className="text-zinc-400">البريد الإلكتروني</div>
            <div className="font-semibold text-zinc-100 break-words">{lawyer.email}</div>
          </div>
        )}
        {lawyer.phone && (
          <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
            <div className="text-zinc-400">رقم الهاتف</div>
            <div className="font-semibold text-zinc-100">{lawyer.phone}</div>
          </div>
        )}
        {lawyer.officeAddress && (
          <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
            <div className="text-zinc-400">عنوان المكتب</div>
            <div className="font-semibold text-zinc-100">{lawyer.officeAddress}</div>
          </div>
        )}
      </section>

      {/* تنبيه الاستشارة */}
      <section className="border border-blue-500/40 rounded-lg p-4 bg-blue-500/5 text-sm text-zinc-100">
        <p>
          يتم طلب الاستشارة عبر{" "}
          <Link href="/consultations" className="underline text-blue-300 hover:text-blue-200">
            صفحة الاستشارات القانونية
          </Link>{" "}
          لضمان توثيق الطلب وفتح غرفة محادثة رسمية عبر المنصة.
        </p>
      </section>

      {/* أزرار التنقل */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Link href="/lawyers" className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-100 hover:bg-zinc-900">
          العودة لقائمة المحامين
        </Link>
        <Link href="/consultations" className="px-4 py-2 rounded-lg bg-blue-600 text-sm text-white hover:bg-blue-700">
          طلب استشارة قانونية
        </Link>
      </div>

    </main>
  );
}
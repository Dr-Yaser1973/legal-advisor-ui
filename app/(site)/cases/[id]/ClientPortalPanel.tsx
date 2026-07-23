"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ClientInfo = { id: number; name: string | null; email: string | null } | null;
type Update = { id: number; title: string | null; content: string; createdAt: string | Date };

export default function ClientPortalPanel({
  caseId,
  client,
  updates,
}: {
  caseId: number;
  client: ClientInfo;
  updates: Update[];
}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkErr, setLinkErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [postErr, setPostErr] = useState<string | null>(null);

  async function linkClient(e: React.FormEvent) {
    e.preventDefault();
    setLinkErr(null);
    if (!email.trim()) { setLinkErr("أدخل بريد الموكّل."); return; }
    setLinking(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setLinkErr(data?.error || "فشل الربط."); return; }
      setEmail("");
      router.refresh();
    } catch { setLinkErr("حدث خطأ غير متوقع."); }
    finally { setLinking(false); }
  }

  async function unlinkClient() {
    if (!confirm("فكّ ربط الموكّل عن هذه القضية؟ لن يعود يراها في بوابته.")) return;
    setLinking(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/client`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally { setLinking(false); }
  }

  async function postUpdate(e: React.FormEvent) {
    e.preventDefault();
    setPostErr(null);
    if (!content.trim()) { setPostErr("اكتب نصّ التحديث."); return; }
    setPosting(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() || null, content: content.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setPostErr(data?.error || "فشل النشر."); return; }
      setTitle(""); setContent("");
      router.refresh();
    } catch { setPostErr("حدث خطأ غير متوقع."); }
    finally { setPosting(false); }
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs focus:outline-none focus:ring focus:ring-sky-500/60";

  return (
    <section className="rounded-2xl border border-sky-500/30 bg-zinc-900/60 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">🔎 بوابة متابعة الموكّل</h2>
        <span className="text-[11px] text-zinc-500">— ما تكتبه هنا يراه الموكّل في صفحته «قضاياي»</span>
      </div>

      {/* ربط الموكّل */}
      <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-xs">
        {client ? (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="text-zinc-300">
              الموكّل المرتبط:{" "}
              <span className="text-zinc-100 font-medium">{client.name || client.email}</span>
              {client.email && client.name && <span className="text-zinc-500"> ({client.email})</span>}
            </div>
            <button onClick={unlinkClient} disabled={linking} className="text-[11px] text-red-300 hover:text-red-200 underline disabled:opacity-50">
              فكّ الربط
            </button>
          </div>
        ) : (
          <form onSubmit={linkClient} className="space-y-2">
            <label className="block text-zinc-300">اربط حساب الموكّل ببريده ليتابع قضيته:</label>
            <div className="flex gap-2">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="بريد الموكّل المسجّل على المنصة"
                className={field}
              />
              <button type="submit" disabled={linking} className="shrink-0 rounded-xl bg-sky-600 px-3 py-2 text-xs font-medium hover:bg-sky-500 disabled:opacity-60">
                {linking ? "…" : "ربط"}
              </button>
            </div>
            {linkErr && <p className="text-[11px] text-red-300">{linkErr}</p>}
            <p className="text-[11px] text-zinc-500">يجب أن يكون للموكّل حساب على المنصة أولاً.</p>
          </form>
        )}
      </div>

      {/* نشر تحديث للموكّل */}
      <form onSubmit={postUpdate} className="space-y-2">
        <input
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان التحديث (اختياري) — مثال: نتيجة الجلسة"
          className={field}
        />
        <textarea
          value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="اكتب تحديثاً واضحاً للموكّل عن تطوّر قضيته…"
          className={`${field} min-h-[70px]`}
        />
        {postErr && <p className="text-[11px] text-red-300">{postErr}</p>}
        <button type="submit" disabled={posting} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium hover:bg-emerald-500 disabled:opacity-60">
          {posting ? "جارٍ النشر…" : "نشر التحديث للموكّل"}
        </button>
      </form>

      {/* التحديثات المنشورة */}
      {updates.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-300">التحديثات المنشورة للموكّل ({updates.length})</h3>
          <div className="space-y-2">
            {updates.map((u) => (
              <div key={u.id} className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  {u.title ? <span className="font-semibold">{u.title}</span> : <span className="text-zinc-500">تحديث</span>}
                  <span className="text-[11px] text-zinc-500">
                    {new Date(u.createdAt).toLocaleString("ar-IQ", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 whitespace-pre-wrap">{u.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: number;
  content: string;
  isPrivate: boolean;
  createdAt: string | Date;
  userId: number;
  authorName: string | null;
};

export default function CaseNotes({
  caseId,
  currentUserId,
  notes,
}: {
  caseId: number;
  currentUserId: number;
  notes: Note[];
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!content.trim()) { setErr("اكتب نصّ الملاحظة."); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), isPrivate }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(data?.error || "فشل الحفظ."); return; }
      setContent(""); setIsPrivate(false);
      router.refresh();
    } catch { setErr("حدث خطأ غير متوقع."); }
    finally { setSaving(false); }
  }

  async function deleteNote(noteId: number) {
    if (!confirm("حذف هذه الملاحظة؟")) return;
    const res = await fetch(`/api/cases/${caseId}/notes?noteId=${noteId}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs focus:outline-none focus:ring focus:ring-amber-500/60";

  return (
    <section className="rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">🗒️ ملاحظات الفريق الداخلية</h2>
        <span className="text-[11px] text-zinc-500">— لا تظهر للموكّل إطلاقاً</span>
      </div>

      <form onSubmit={addNote} className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ملاحظة داخلية للفريق حول القضية…"
          className={`${field} min-h-[60px]`}
        />
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
            <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="accent-amber-500" />
            خاصة بي فقط (لا يراها بقية الفريق)
          </label>
          <button type="submit" disabled={saving} className="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-medium hover:bg-amber-500 disabled:opacity-60">
            {saving ? "جارٍ الحفظ…" : "إضافة ملاحظة"}
          </button>
        </div>
        {err && <p className="text-[11px] text-red-300">{err}</p>}
      </form>

      {notes.length > 0 && (
        <div className="space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-xs">
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-300 font-medium">{n.authorName || "عضو الفريق"}</span>
                  {n.isPrivate && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700/60 text-zinc-300 border border-zinc-600">🔒 خاصة</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500">
                    {new Date(n.createdAt).toLocaleString("ar-IQ", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                  {n.userId === currentUserId && (
                    <button onClick={() => deleteNote(n.id)} className="text-[11px] text-red-300 hover:text-red-200 underline">حذف</button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-zinc-300 whitespace-pre-wrap">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

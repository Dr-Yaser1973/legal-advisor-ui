"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string | null; image: string | null };
}

export default function BlogComments({
  postId,
  comments,
}: {
  postId: number;
  comments: Comment[];
}) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitComment() {
    if (!comment.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: comment }),
      });
      const data = await res.json();

      if (data.ok) {
        setSubmitted(true);
        setComment("");
      } else {
        setError(data.error ?? "حدث خطأ.");
      }
    } catch {
      setError("حدث خطأ غير متوقع.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" /> التعليقات ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <p className="text-zinc-500 text-sm mb-6">
          لا توجد تعليقات بعد — كن أول من يعلّق.
        </p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">
                  {c.author?.name ?? "مستخدم"}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(c.createdAt).toLocaleDateString("ar-IQ")}
                </span>
              </div>
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {submitted ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">
          ✅ تم إرسال تعليقك — سيظهر بعد مراجعة الإدارة.
        </div>
      ) : (
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك هنا..."
            rows={4}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
          <button
            onClick={submitComment}
            disabled={submitting || !comment.trim()}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
          >
            {submitting ? "جارٍ الإرسال..." : "إرسال التعليق"}
          </button>
        </div>
      )}
    </div>
  );
}

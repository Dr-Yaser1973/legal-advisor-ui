"use client";
// app/(site)/firm-dashboard/FirmRequestCard.tsx

import { useState } from "react";
import { FileText, User2, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";

interface Document {
  id: number;
  title: string;
  filePath?: string | null;
  mimetype: string;
}

interface Client {
  id: number;
  name: string | null;
  email: string | null;
  phone?: string | null;
}

interface Props {
  requestId: number;
  subject: string;
  details: string;
  status: string;
  statusLabel: string;
  statusColor: string;
  createdAt: string;
  client: Client;
  documents: Document[];
  showOfferForm?: boolean;
}

export default function FirmRequestCard({
  requestId, subject, details, statusLabel, statusColor,
  createdAt, client, documents, showOfferForm,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [fee, setFee] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!fee || Number(fee) <= 0) { setError("أدخل قيمة الأتعاب."); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/firm-consult/${requestId}/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fee: Number(fee), currency, note }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.error || "فشل إرسال العرض."); return; }
      setSent(true);
    } catch { setError("حدث خطأ غير متوقع."); }
    finally { setLoading(false); }
  }

  return (
    <div className="border border-amber-500/30 rounded-xl bg-zinc-900/60 overflow-hidden">

      {/* هيدر البطاقة */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-xs px-3 py-0.5 rounded-full border ${statusColor}`}>{statusLabel}</span>
          <span className="text-xs text-zinc-500">#{requestId}</span>
        </div>

        <h3 className="text-sm font-bold text-white">{subject}</h3>

        <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1"><User2 className="w-3 h-3" />{client.name || "مستخدم"}</span>
          {client.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>}
          {client.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>}
        </div>

        <div className="text-xs text-zinc-500">{new Date(createdAt).toLocaleString("ar-IQ")}</div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition"
        >
          {expanded ? <><ChevronUp className="w-3 h-3" /> إخفاء التفاصيل</> : <><ChevronDown className="w-3 h-3" /> عرض التفاصيل</>}
        </button>
      </div>

      {/* التفاصيل */}
      {expanded && (
        <div className="border-t border-zinc-800 p-4 space-y-4">

          {/* نص الاستشارة */}
          <div>
            <div className="text-xs font-semibold text-zinc-300 mb-1">تفاصيل الاستشارة:</div>
            <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed bg-zinc-800/50 rounded-lg p-3">{details}</p>
          </div>

          {/* الوثائق */}
          {documents.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-zinc-300 mb-2">الوثائق المرفقة ({documents.length}):</div>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 text-xs border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800/30">
                    <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-zinc-300 flex-1 truncate">{doc.title}</span>
                    {doc.filePath && (
                      <a href={`/api/documents/${doc.id}/download`} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline flex-shrink-0">
                        تحميل
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* نموذج تقديم العرض */}
          {showOfferForm && (
            <div className="border-t border-zinc-700 pt-4">
              <div className="text-xs font-semibold text-zinc-200 mb-3">تقديم عرض الأتعاب:</div>

              {sent ? (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3 text-sm text-emerald-300 text-center">
                  ✓ تم إرسال العرض بنجاح — بانتظار رد العميل
                </div>
              ) : (
                <form onSubmit={submitOffer} className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="rounded-lg border border-zinc-700 bg-zinc-950 text-sm text-zinc-100 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 w-24 flex-shrink-0"
                    >
                      <option value="USD">USD</option>
                      <option value="IQD">IQD</option>
                      <option value="AED">AED</option>
                      <option value="SAR">SAR</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      placeholder="قيمة الأتعاب"
                      className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 text-sm text-zinc-100 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="ملاحظة للعميل (اختياري) — مثال: يشمل مراجعة الوثائق وجلسة استشارية بالفيديو"
                    rows={3}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-sm text-zinc-100 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {error && <div className="text-xs text-red-400">{error}</div>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition disabled:opacity-60"
                  >
                    {loading ? "جارٍ الإرسال..." : "إرسال العرض للعميل"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


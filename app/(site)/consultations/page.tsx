 "use client";

import { useEffect, useState, useRef } from "react";
import UpgradeModal from "@/components/UpgradeModal";
import { Upload, X, FileText, ChevronLeft } from "lucide-react";

type TabKey = "ai" | "human" | "firm" | "history";

interface AiConsultHistoryItem {
  id: number;
  title: string;
  description: string;
  answer?: string | null;
  createdAt: string;
}

interface LawyerProfile {
  specialties?: string | null;
  phone?: string | null;
  city?: string | null;
  rating?: number | null;
}

interface Lawyer {
  id: number;
  name: string | null;
  email: string | null;
  role: string;
  lawyerProfile?: LawyerProfile | null;
}

interface Offer {
  id: number;
  fee: number | null;
  currency: string | null;
  note?: string | null;
  status: string;
  createdAt: string;
  lawyer: Lawyer | null;
}

interface HumanConsultationInfo {
  id: number;
  title: string;
  description: string;
  answer?: string | null;
}

interface HumanRequestItem {
  id: number;
  status: string;
  createdAt: string;
  consultation: HumanConsultationInfo | null;
  offers: Offer[];
  chatRoom?: { id: number } | null;
}

interface AiHistoryApiResponse { items: AiConsultHistoryItem[] }
interface HumanHistoryApiResponse { items: HumanRequestItem[] }

interface Branch {
  id: number;
  name: string;
  city: string;
  country: string;
  email?: string;
  phone?: string;
}

interface Organization {
  id: number;
  name: string;
  type: string;
  logo?: string;
  website?: string;
  description?: string;
  email?: string;
  phone?: string;
  branches: Branch[];
}

interface FirmRequest {
  id: number;
  subject: string;
  status: string;
  createdAt: string;
  org: { id: number; name: string };
  branch?: { name: string; city: string } | null;
  offer?: { fee: number; currency: string; note?: string; status: string } | null;
  chatRoom?: { id: number } | null;
}

const orgTypeLabel: Record<string, string> = {
  LAW_FIRM: "مكتب محاماة",
  COMPANY: "شركة",
  GOVERNMENT: "جهة حكومية",
  OTHER: "أخرى",
};
 
function firmStatusLabel(status: string) {
  switch (status) {
    case "PENDING": return "بانتظار رد المكتب";
    case "OFFER_SENT": return "وصل عرض من المكتب";
    case "ACCEPTED": return "تم القبول";
    case "IN_PROGRESS": return "قيد التنفيذ";
    case "COMPLETED": return "منجزة";
    case "CANCELED": return "ملغاة";
    default: return status;
  }
}

function firmStatusColor(status: string) {
  switch (status) {
    case "PENDING": return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    case "OFFER_SENT": return "bg-blue-500/10 text-blue-300 border-blue-500/40";
    case "ACCEPTED": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "COMPLETED": return "bg-zinc-500/10 text-zinc-200 border-zinc-500/40";
    case "CANCELED": return "bg-red-500/10 text-red-300 border-red-500/40";
    default: return "bg-zinc-700/40 text-zinc-200 border-zinc-600";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "PENDING": return "بانتظار عروض المحامين";
    case "ACCEPTED": return "تم اختيار محامٍ";
    case "IN_PROGRESS": return "الاستشارة قيد التنفيذ";
    case "COMPLETED": return "الاستشارة منجزة";
    case "CANCELED": return "الاستشارة ملغاة";
    default: return status;
  }
}

function statusColorClasses(status: string) {
  switch (status) {
    case "PENDING": return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    case "ACCEPTED": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "IN_PROGRESS": return "bg-blue-500/10 text-blue-300 border-blue-500/40";
    case "COMPLETED": return "bg-zinc-500/10 text-zinc-200 border-zinc-500/40";
    case "CANCELED": return "bg-red-500/10 text-red-300 border-red-500/40";
    default: return "bg-zinc-700/40 text-zinc-200 border-zinc-600";
  }
}

interface AcceptOfferButtonProps {
  requestId: number;
  offerId: number;
  disabled?: boolean;
  onAccepted?: () => void;
}

function AcceptOfferButton({ requestId, offerId, disabled, onAccepted }: AcceptOfferButtonProps) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/consultations/human/${requestId}/offers/${offerId}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "حدث خطأ أثناء اختيار المحامي."); setLoading(false); return; }
      const roomId = data?.room?.id;
      if (!roomId) { alert("تم اختيار المحامي ولكن لم يتم العثور على غرفة المحادثة."); setLoading(false); return; }
      if (onAccepted) onAccepted();
      window.location.href = `/chat/${roomId}`;
    } catch { alert("حدث خطأ غير متوقع."); setLoading(false); }
  };
  return (
    <button onClick={handleClick} disabled={loading || disabled} className="px-3 py-1.5 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed">
      {loading ? "جاري الاختيار..." : "اختيار هذا المحامي"}
    </button>
  );
}

export default function ConsultationsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("ai");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  // ── الذكاء الاصطناعي ──────────────────────────────────────────
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // ── المحامي البشري ────────────────────────────────────────────
  const [humanTopic, setHumanTopic] = useState("");
  const [humanDetails, setHumanDetails] = useState("");
  const [humanLoading, setHumanLoading] = useState(false);
  const [humanError, setHumanError] = useState<string | null>(null);
  const [humanSuccess, setHumanSuccess] = useState<string | null>(null);

  // ── المكاتب المعتمدة ──────────────────────────────────────────
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | "">("");
  const [firmSubject, setFirmSubject] = useState("");
  const [firmDetails, setFirmDetails] = useState("");
  const [firmFiles, setFirmFiles] = useState<File[]>([]);
  const [firmLoading, setFirmLoading] = useState(false);
  const [firmError, setFirmError] = useState<string | null>(null);
  const [firmSuccess, setFirmSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── السجل ─────────────────────────────────────────────────────
  const [historyLoading, setHistoryLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<AiConsultHistoryItem[]>([]);
  const [humanRequests, setHumanRequests] = useState<HumanRequestItem[]>([]);
  const [firmRequests, setFirmRequests] = useState<FirmRequest[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // جلب المكاتب عند فتح التبويب
  useEffect(() => {
    if (activeTab !== "firm") return;
    setOrgsLoading(true);
    fetch("/api/organizations?pageSize=50")
      .then((r) => r.json())
      .then((d) => setOrgs(d.items || []))
      .catch(() => {})
      .finally(() => setOrgsLoading(false));
  }, [activeTab]);

  // جلب السجل
  useEffect(() => {
    if (activeTab !== "history") return;
    async function loadHistory() {
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const [aiRes, humanRes, firmRes] = await Promise.all([
          fetch("/api/consultations/ai/my"),
          fetch("/api/consultations/human/my"),
          fetch("/api/firm-consult"),
        ]);
        if (aiRes.ok) { const d: AiHistoryApiResponse = await aiRes.json(); setAiHistory(d.items || []); }
        if (humanRes.ok) { const d: HumanHistoryApiResponse = await humanRes.json(); setHumanRequests(d.items || []); }
        if (firmRes.ok) { const d = await firmRes.json(); setFirmRequests(d.requests || []); }
      } catch { setHistoryError("حدث خطأ أثناء تحميل سجل الاستشارات."); }
      finally { setHistoryLoading(false); }
    }
    loadHistory();
  }, [activeTab]);

  // ── الذكاء الاصطناعي ──────────────────────────────────────────
  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAiLoading(true); setAiError(null); setAiAnswer(null);
    try {
      const res = await fetch("/api/consultations/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: aiQuestion.trim().slice(0, 80) || "استشارة قانونية مختصرة", description: aiQuestion }),
      });
      const data = await res.json();
      if (res.status === 403 && data.upgradeRequired) { setUpgradeMessage(data.error); setUpgradeOpen(true); return; }
      if (!res.ok) throw new Error(data?.error || "فشل طلب الاستشارة بالذكاء.");
      setAiAnswer(data.answer || "تم استلام الاستشارة بنجاح.");
    } catch (error: any) {
      setAiError(error?.message || "حدث خطأ غير متوقع.");
    } finally { setAiLoading(false); }
  }

  // ─المحامي المعتمد────────────────────────────────────────────
  async function handleHumanSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHumanLoading(true); setHumanError(null); setHumanSuccess(null);
    try {
      const res = await fetch("/api/consultations/human-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: humanTopic, details: humanDetails }),
      });
      const data = await res.json();
      if (res.status === 403 && data.upgradeRequired) { setUpgradeMessage(data.error); setUpgradeOpen(true); return; }
      if (!res.ok) throw new Error(data?.error || "فشل إرسال طلب الاستشارة.");
      setHumanSuccess("تم إرسال طلب الاستشارة بنجاح. سيتم عرض عروض المحامين في سجل الاستشارات.");
      setHumanTopic(""); setHumanDetails("");
    } catch (error: any) {
      setHumanError(error?.message || "حدث خطأ غير متوقع.");
    } finally { setHumanLoading(false); }
  }

  // ── المكاتب المعتمدة ──────────────────────────────────────────
  function handleFileAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setFirmFiles((prev) => [...prev, ...files].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(idx: number) {
    setFirmFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleFirmSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrg) return;
    setFirmLoading(true); setFirmError(null); setFirmSuccess(null);
    try {
      // رفع الوثائق أولاً إن وجدت
      const documentIds: number[] = [];
      for (const file of firmFiles) {
        const form = new FormData();
        form.append("file", file);
        form.append("title", file.name);
        const uploadRes = await fetch("/api/documents/upload", { method: "POST", body: form });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData?.id) documentIds.push(uploadData.id);
        }
      }

      // إرسال طلب الاستشارة
      const res = await fetch("/api/firm-consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId: selectedOrg.id,
          branchId: selectedBranchId || null,
          subject: firmSubject,
          details: firmDetails,
          documentIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "فشل إرسال الطلب.");

      setFirmSuccess(`تم إرسال طلب الاستشارة إلى ${selectedOrg.name} بنجاح.\nسيردّ عليك المكتب خلال 24 ساعة — ستصلك إشعار عند وصول العرض.`);
      setFirmSubject(""); setFirmDetails(""); setFirmFiles([]); setSelectedOrg(null); setSelectedBranchId("");
    } catch (error: any) {
      setFirmError(error?.message || "حدث خطأ غير متوقع.");
    } finally { setFirmLoading(false); }
  }

  // ── قبول عرض المكتب ──────────────────────────────────────────
  async function acceptFirmOffer(requestId: number) {
    try {
      const res = await fetch(`/api/firm-consult/${requestId}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { alert(data?.error || "فشل قبول العرض."); return; }
      if (data.chatRoomId) window.location.href = `/firm-chat/${data.chatRoomId}`;
      else { alert("تم القبول — ستُفتح غرفة المحادثة قريباً."); setActiveTab("history"); }
    } catch { alert("حدث خطأ غير متوقع."); }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} message={upgradeMessage} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6 text-right">
          <h1 className="text-2xl font-bold mb-1">صفحة الاستشارات القانونية</h1>
          <p className="text-sm text-zinc-400">
            يمكنك هنا طلب استشارة فورية بالذكاء الاصطناعي، أو إرسال طلب استشارة إلى محامٍ بشري أو مكتب معتمد.
          </p>
        </header>

        {/* التبويبات */}
        <div className="flex flex-wrap gap-2 justify-end mb-4">
          <button onClick={() => setActiveTab("ai")} className={`rounded-xl px-4 py-2 text-sm border transition ${activeTab === "ai" ? "border-emerald-500 bg-emerald-500/10 text-emerald-200" : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"}`}>
            🤖 استشارة فورية بالذكاء الاصطناعي
          </button>
          <button onClick={() => setActiveTab("human")} className={`rounded-xl px-4 py-2 text-sm border transition ${activeTab === "human" ? "border-sky-500 bg-sky-500/10 text-sky-200" : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"}`}>
            👨‍⚖️ طلب استشارة من محامٍ بشري
          </button>
          <button onClick={() => setActiveTab("firm")} className={`rounded-xl px-4 py-2 text-sm border transition ${activeTab === "firm" ? "border-amber-500 bg-amber-500/10 text-amber-200" : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"}`}>
            🏛️ استشارة من مكتب معتمد
          </button>
          <button onClick={() => setActiveTab("history")} className={`rounded-xl px-4 py-2 text-sm border transition ${activeTab === "history" ? "border-zinc-300 bg-zinc-800 text-zinc-100" : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"}`}>
            📜 سجل الاستشارات
          </button>
        </div>

        {/* ── تبويب الذكاء الاصطناعي ── */}
        {activeTab === "ai" && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2 text-right">🤖 استشارة قانونية بالذكاء الاصطناعي</h2>
            <form onSubmit={handleAiSubmit} className="space-y-3">
              <div className="text-right">
                <label className="block text-sm mb-1 text-zinc-300">نص الاستشارة</label>
                <textarea className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={6} placeholder="اكتب سؤالك أو وصف حالتك القانونية بالتفصيل..." value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} />
              </div>
              {aiError && <div className="text-sm text-red-400 text-right">{aiError}</div>}
              <button type="submit" disabled={aiLoading} className="ml-auto block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
                {aiLoading ? "جاري إرسال الاستشارة..." : "إرسال الاستشارة"}
              </button>
            </form>
            {aiAnswer && (
              <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm text-right">
                <div className="font-semibold mb-1 text-emerald-200">جواب الذكاء الاصطناعي:</div>
                <p className="text-emerald-50 whitespace-pre-line">{aiAnswer}</p>
              </div>
            )}
          </section>
        )}

        {/* ── تبويب المحامي البشري ── */}
        {activeTab === "human" && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2 text-right">👨‍⚖️ طلب استشارة من محامٍ بشري</h2>
            <form onSubmit={handleHumanSubmit} className="space-y-3">
              <div className="text-right">
                <label className="block text-sm mb-1 text-zinc-300">موضوع الاستشارة</label>
                <input className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="مثال: نزاع حول عقد إيجار، مطالبة مالية..." value={humanTopic} onChange={(e) => setHumanTopic(e.target.value)} />
              </div>
              <div className="text-right">
                <label className="block text-sm mb-1 text-zinc-300">تفاصيل الاستشارة</label>
                <textarea className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" rows={6} placeholder="اكتب وقائع الحالة القانونية، التواريخ، الأطراف، وأي مستندات مهمة..." value={humanDetails} onChange={(e) => setHumanDetails(e.target.value)} />
              </div>
              {humanError && <div className="text-sm text-red-400 text-right">{humanError}</div>}
              {humanSuccess && <div className="text-sm text-emerald-400 text-right">{humanSuccess}</div>}
              <button type="submit" disabled={humanLoading} className="ml-auto block rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60">
                {humanLoading ? "جاري إرسال الطلب..." : "إرسال طلب الاستشارة"}
              </button>
            </form>
          </section>
        )}

        {/* ── تبويب المكاتب المعتمدة ── */}
        {activeTab === "firm" && (
          <section className="rounded-xl border border-amber-500/20 bg-zinc-900/70 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white text-right">🏛️ استشارة من مكتب معتمد</h2>
            <p className="text-sm text-zinc-400 text-right">
              اختر المكتب المناسب وأرسل طلبك مع وثائقك — سيردّ عليك المكتب بعرض خلال 24 ساعة.
            </p>

            {firmSuccess && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm text-emerald-300 text-right whitespace-pre-line">{firmSuccess}</div>
            )}

            {!firmSuccess && (
              <form onSubmit={handleFirmSubmit} className="space-y-5">

                {/* اختيار المكتب */}
                <div className="text-right">
                  <label className="block text-sm mb-2 text-zinc-300 font-medium">١. اختر المكتب</label>
                  {orgsLoading ? (
                    <p className="text-sm text-zinc-400">جارٍ تحميل المكاتب...</p>
                  ) : orgs.length === 0 ? (
                    <p className="text-sm text-zinc-500">لا توجد مكاتب معتمدة حالياً.</p>
                  ) : (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      {orgs.map((org) => (
                        <div
                          key={org.id}
                          onClick={() => { setSelectedOrg(org); setSelectedBranchId(org.branches.length === 1 ? org.branches[0].id : ""); }}
                          className={`cursor-pointer rounded-xl border p-3 transition ${selectedOrg?.id === org.id ? "border-amber-500 bg-amber-500/10" : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs font-serif flex-shrink-0">
                              {org.name.slice(0, 3)}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-white">{org.name}</div>
                              <div className="text-xs text-zinc-400">{orgTypeLabel[org.type]} · {org.branches.length} فروع</div>
                            </div>
                            {selectedOrg?.id === org.id && <span className="mr-auto text-amber-400 text-lg">✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* اختيار الفرع */}
                {selectedOrg && selectedOrg.branches.length > 1 && (
                  <div className="text-right">
                    <label className="block text-sm mb-2 text-zinc-300 font-medium">٢. اختر الفرع</label>
                    <select
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-100"
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                      required
                    >
                      <option value="">-- اختر الفرع --</option>
                      {selectedOrg.branches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} — {b.city}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* موضوع وتفاصيل الاستشارة */}
                {selectedOrg && (
                  <>
                    <div className="text-right">
                      <label className="block text-sm mb-1 text-zinc-300 font-medium">
                        {selectedOrg.branches.length > 1 ? "٣." : "٢."} موضوع الاستشارة
                      </label>
                      <input
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-100"
                        placeholder="مثال: نزاع تجاري، عقد شراكة، قضية تحكيم..."
                        value={firmSubject}
                        onChange={(e) => setFirmSubject(e.target.value)}
                        required
                      />
                    </div>

                    <div className="text-right">
                      <label className="block text-sm mb-1 text-zinc-300 font-medium">
                        {selectedOrg.branches.length > 1 ? "٤." : "٣."} تفاصيل الاستشارة
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-100"
                        rows={6}
                        placeholder="اكتب وقائع الحالة القانونية بالتفصيل — التواريخ، الأطراف، المطالب..."
                        value={firmDetails}
                        onChange={(e) => setFirmDetails(e.target.value)}
                        required
                      />
                    </div>

                    {/* رفع الوثائق */}
                    <div className="text-right">
                      <label className="block text-sm mb-2 text-zinc-300 font-medium">
                        {selectedOrg.branches.length > 1 ? "٥." : "٤."} رفع الوثائق (اختياري — حتى 5 ملفات)
                      </label>

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500/50 transition"
                      >
                        <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                        <p className="text-sm text-zinc-400">اضغط لاختيار الملفات</p>
                        <p className="text-xs text-zinc-600 mt-1">PDF، صور، Word — حتى 10MB لكل ملف</p>
                        <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={handleFileAdd} />
                      </div>

                      {firmFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {firmFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
                              <button type="button" onClick={() => removeFile(idx)} className="text-zinc-500 hover:text-red-400 transition flex-shrink-0">
                                <X className="w-4 h-4" />
                              </button>
                              <div className="flex items-center gap-2 text-sm text-zinc-300 flex-1 text-right">
                                <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                <span className="truncate">{file.name}</span>
                                <span className="text-xs text-zinc-500 flex-shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {firmError && <div className="text-sm text-red-400 text-right">{firmError}</div>}

                <button
                  type="submit"
                  disabled={firmLoading || !selectedOrg || !firmSubject || !firmDetails}
                  className="w-full rounded-lg bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {firmLoading ? "جارٍ إرسال الطلب..." : selectedOrg ? `إرسال الطلب إلى ${selectedOrg.name}` : "اختر مكتباً أولاً"}
                </button>
              </form>
            )}
          </section>
        )}

        {/* ── تبويب السجل ── */}
        {activeTab === "history" && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2 text-right">📜 سجل الاستشارات السابقة</h2>

            {historyLoading && <div className="text-center text-zinc-400 py-4">جاري تحميل سجل الاستشارات...</div>}
            {historyError && <div className="text-sm text-red-400 text-right">{historyError}</div>}

            {!historyLoading && !historyError && (
              <div className="space-y-6">

                {/* استشارات الذكاء الاصطناعي */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-emerald-300 text-right">🤖 استشارات الذكاء الاصطناعي</h3>
                  {aiHistory.length === 0 ? (
                    <div className="text-sm text-zinc-500 text-right">لا توجد استشارات سابقة بالذكاء الاصطناعي.</div>
                  ) : (
                    <div className="space-y-2">
                      {aiHistory.map((c) => (
                        <div key={c.id} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-right">
                          <div className="flex justify-between mb-1">
                            <span className="text-zinc-300">{c.title?.slice(0, 80) || "استشارة قانونية بالذكاء الاصطناعي"}</span>
                            <span className="text-xs text-zinc-500">{new Date(c.createdAt).toLocaleString("ar-IQ")}</span>
                          </div>
                          <div className="text-xs text-zinc-400">{c.description?.slice(0, 120)}{c.description && c.description.length > 120 ? "..." : ""}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* طلبات المحامين البشريين */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-sky-300 text-right">👨‍⚖️ طلبات الاستشارة من المحامين البشريين</h3>
                  {humanRequests.length === 0 ? (
                    <div className="text-sm text-zinc-500 text-right">لا توجد طلبات استشارة بشرية حتى الآن.</div>
                  ) : (
                    <div className="space-y-3">
                      {humanRequests.map((req) => {
                        const chatRoomId = req.chatRoom?.id;
                        const hasAcceptedOffer = req.offers.some((o) => o.status === "ACCEPTED_BY_CLIENT");
                        const canOpenChat = !!chatRoomId && ["ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(req.status);
                        return (
                          <div key={req.id} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 text-sm">
                            <div className="flex flex-col gap-1 mb-2 text-right">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-500">رقم الطلب #{req.id}</span>
                                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-0.5 text-[11px] font-medium ${statusColorClasses(req.status)}`}>
                                  <span className="inline-block w-2 h-2 rounded-full bg-current/70" />
                                  {statusLabel(req.status)}
                                </span>
                              </div>
                              {canOpenChat && (
                                <div className="mt-2 flex justify-end">
                                  <button onClick={() => (window.location.href = `/chat/${chatRoomId}`)} className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 border border-white/10">فتح المحادثة</button>
                                </div>
                              )}
                              <div className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleString("ar-IQ")}</div>
                            </div>
                            {req.consultation && (
                              <div className="mb-3 text-right">
                                <div className="font-semibold mb-1">{req.consultation.title}</div>
                                <div className="text-xs text-zinc-400 whitespace-pre-line">{req.consultation.description}</div>
                              </div>
                            )}
                            <div className="mt-2 space-y-2">
                              <div className="font-semibold text-right text-zinc-200">عروض المحامين:</div>
                              {req.offers.length === 0 ? (
                                <div className="text-xs text-zinc-500 text-right">لم يقم أي محامٍ بتقديم عرض بعد.</div>
                              ) : (
                                <div className="space-y-2">
                                  {req.offers.map((offer) => (
                                    <div key={offer.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-3">
                                      <div className="flex-1 text-right space-y-1">
                                        <div className="font-medium">{offer.lawyer?.name || "محامٍ"}</div>
                                        <div className="text-xs text-zinc-400">الأجر: <span className="font-semibold text-zinc-50">{offer.fee ?? "غير محدد"} {offer.currency || "IQD"}</span></div>
                                        {offer.note && <div className="text-xs text-zinc-500">ملاحظة: {offer.note}</div>}
                                      </div>
                                      <div className="flex flex-col items-center gap-1">
                                        {offer.status === "ACCEPTED_BY_CLIENT" ? (
                                          <span className="text-xs text-emerald-400">تم الاختيار</span>
                                        ) : req.status === "COMPLETED" || req.status === "CANCELED" ? (
                                          <span className="text-xs text-zinc-500">منتهي</span>
                                        ) : (
                                          <AcceptOfferButton requestId={req.id} offerId={offer.id} disabled={hasAcceptedOffer} onAccepted={() => setActiveTab("history")} />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* طلبات المكاتب المعتمدة */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-amber-300 text-right">🏛️ طلبات المكاتب المعتمدة</h3>
                  {firmRequests.length === 0 ? (
                    <div className="text-sm text-zinc-500 text-right">لا توجد طلبات لمكاتب معتمدة حتى الآن.</div>
                  ) : (
                    <div className="space-y-3">
                      {firmRequests.map((req) => (
                        <div key={req.id} className="rounded-lg border border-amber-500/20 bg-zinc-900 px-3 py-3 text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-500">رقم الطلب #{req.id}</span>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] font-medium ${firmStatusColor(req.status)}`}>
                              {firmStatusLabel(req.status)}
                            </span>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="font-semibold text-white">{req.subject}</div>
                            <div className="text-xs text-zinc-400">{req.org.name}{req.branch ? ` — فرع ${req.branch.city}` : ""}</div>
                            <div className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleString("ar-IQ")}</div>
                          </div>
                          {req.offer && (
                            <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-right space-y-2">
                              <div className="text-xs font-semibold text-amber-300">عرض المكتب:</div>
                              <div className="text-sm text-zinc-200">الأتعاب: <span className="font-bold">{req.offer.fee} {req.offer.currency}</span></div>
                              {req.offer.note && <div className="text-xs text-zinc-400">ملاحظة: {req.offer.note}</div>}
                              {req.offer.status === "PENDING" && (
                                <button onClick={() => acceptFirmOffer(req.id)} className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition">
                                  قبول العرض وفتح المحادثة
                                </button>
                              )}
                              {req.offer.status === "ACCEPTED" && req.chatRoom && (
                                <button onClick={() => (window.location.href = `/firm-chat/${req.chatRoom!.id}`)} className="w-full py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-xs transition">
                                  فتح المحادثة
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

 "use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import UpgradeModal from "@/components/UpgradeModal";
import { Upload, X, FileText } from "lucide-react";
import { useLocale } from "@/lib/hooks/useLocale";
import type { Locale } from "@/lib/i18n/config";

// تسجيل دخول بنقرة عبر Google مع العودة لنفس الصفحة
function loginWithGoogle() {
  signIn("google", {
    callbackUrl: typeof window !== "undefined" ? window.location.href : "/consultations",
  });
}

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

const ORG_TYPE_LABEL: Record<Locale, Record<string, string>> = {
  ar: { LAW_FIRM: "مكتب محاماة", COMPANY: "شركة", GOVERNMENT: "جهة حكومية", OTHER: "أخرى" },
  en: { LAW_FIRM: "Law firm", COMPANY: "Company", GOVERNMENT: "Government entity", OTHER: "Other" },
};

const FIRM_STATUS: Record<Locale, Record<string, string>> = {
  ar: {
    PENDING: "بانتظار رد المكتب", OFFER_SENT: "وصل عرض من المكتب", ACCEPTED: "تم القبول",
    IN_PROGRESS: "قيد التنفيذ", COMPLETED: "منجزة", CANCELED: "ملغاة",
  },
  en: {
    PENDING: "Awaiting the office's reply", OFFER_SENT: "An offer arrived from the office", ACCEPTED: "Accepted",
    IN_PROGRESS: "In progress", COMPLETED: "Completed", CANCELED: "Canceled",
  },
};

const HUMAN_STATUS: Record<Locale, Record<string, string>> = {
  ar: {
    PENDING: "بانتظار عروض المحامين", ACCEPTED: "تم اختيار محامٍ", IN_PROGRESS: "الاستشارة قيد التنفيذ",
    COMPLETED: "الاستشارة منجزة", CANCELED: "الاستشارة ملغاة",
  },
  en: {
    PENDING: "Awaiting lawyers' offers", ACCEPTED: "A lawyer was selected", IN_PROGRESS: "Consultation in progress",
    COMPLETED: "Consultation completed", CANCELED: "Consultation canceled",
  },
};

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

const TR = {
  ar: {
    headerTitle: "صفحة الاستشارات القانونية",
    headerSubtitle: "يمكنك هنا طلب استشارة فورية بالذكاء الاصطناعي، أو إرسال طلب استشارة إلى محامٍ معتمد أو مكتب معتمد.",
    guestTitle: "جرّب استشارتك القانونية الأولى مجاناً 🎁",
    guestSubtitle: "سجّل الدخول بنقرة واحدة لتحصل على استشارة فورية بالذكاء الاصطناعي، أو ترسل طلبك إلى محامٍ أو مكتب معتمد.",
    guestBullets: ["✓ استشارة أولى مجانية", "✓ بلا التزام", "✓ تبدأ فوراً"],
    googleLogin: "تسجيل الدخول عبر Google",
    tabAi: "🤖 استشارة فورية بالذكاء الاصطناعي",
    tabHuman: "👨‍⚖️ طلب استشارة من محامي معتمد",
    tabFirm: "🏛️ استشارة من مكتب معتمد",
    tabHistory: "📜 سجل الاستشارات",
    aiTitle: "🤖 استشارة قانونية بالذكاء الاصطناعي",
    aiLabel: "نص الاستشارة",
    aiPlaceholder: "اكتب سؤالك أو وصف حالتك القانونية بالتفصيل...",
    aiSending: "جاري إرسال الاستشارة...",
    aiSubmit: "إرسال الاستشارة",
    aiAnswerTitle: "جواب الذكاء الاصطناعي:",
    humanTitle: "👨‍⚖️ طلب استشارة من محامٍ بشري",
    humanTopicLabel: "موضوع الاستشارة",
    humanTopicPh: "مثال: نزاع حول عقد إيجار، مطالبة مالية...",
    humanDetailsLabel: "تفاصيل الاستشارة",
    humanDetailsPh: "اكتب وقائع الحالة القانونية، التواريخ، الأطراف، وأي مستندات مهمة...",
    humanSending: "جاري إرسال الطلب...",
    humanSubmit: "إرسال طلب الاستشارة",
    firmTitle: "🏛️ استشارة من مكتب معتمد",
    firmSubtitle: "اختر المكتب المناسب وأرسل طلبك مع وثائقك — سيردّ عليك المكتب بعرض خلال 24 ساعة.",
    stepChooseOffice: "اختر المكتب",
    firmLoadingOffices: "جارٍ تحميل المكاتب...",
    firmNoOffices: "لا توجد مكاتب معتمدة حالياً.",
    branchesWord: "فروع",
    stepChooseBranch: "اختر الفرع",
    branchPlaceholder: "-- اختر الفرع --",
    stepSubject: "موضوع الاستشارة",
    firmSubjectPh: "مثال: نزاع تجاري، عقد شراكة، قضية تحكيم...",
    stepDetails: "تفاصيل الاستشارة",
    firmDetailsPh: "اكتب وقائع الحالة القانونية بالتفصيل — التواريخ، الأطراف، المطالب...",
    stepDocs: "رفع الوثائق (اختياري — حتى 5 ملفات)",
    clickToPickFiles: "اضغط لاختيار الملفات",
    filesHint: "PDF، صور، Word — حتى 10MB لكل ملف",
    firmSending: "جارٍ إرسال الطلب...",
    chooseOfficeFirst: "اختر مكتباً أولاً",
    sendTo: (name: string) => `إرسال الطلب إلى ${name}`,
    historyTitle: "📜 سجل الاستشارات السابقة",
    historyLoading: "جاري تحميل سجل الاستشارات...",
    histAiTitle: "🤖 استشارات الذكاء الاصطناعي",
    histAiEmpty: "لا توجد استشارات سابقة بالذكاء الاصطناعي.",
    aiDefaultTitle: "استشارة قانونية بالذكاء الاصطناعي",
    histHumanTitle: "👨‍⚖️ طلبات الاستشارة من المحامين",
    histHumanEmpty: "لا توجد طلبات استشارة بشرية حتى الآن.",
    reqNo: "رقم الطلب #",
    openChat: "فتح المحادثة",
    lawyerOffers: "عروض المحامين:",
    noOffersYet: "لم يقم أي محامٍ بتقديم عرض بعد.",
    lawyerDefault: "محامٍ",
    feeAr: "الأجر: ",
    notSet: "غير محدد",
    noteLabel: "ملاحظة: ",
    chosen: "تم الاختيار",
    ended: "منتهي",
    histFirmTitle: "🏛️ طلبات المكاتب المعتمدة",
    histFirmEmpty: "لا توجد طلبات لمكاتب معتمدة حتى الآن.",
    branchOf: (city: string) => ` — فرع ${city}`,
    firmOfferTitle: "عرض المكتب:",
    firmFee: "الأتعاب: ",
    acceptOpenChat: "قبول العرض وفتح المحادثة",
    aiDefaultAnswer: "تم استلام الاستشارة بنجاح.",
    aiFail: "فشل طلب الاستشارة بالذكاء.",
    unexpectedDot: "حدث خطأ غير متوقع.",
    humanFail: "فشل إرسال طلب الاستشارة.",
    humanSuccess: "تم إرسال طلب الاستشارة بنجاح. سيتم عرض عروض المحامين في سجل الاستشارات.",
    firmFail: "فشل إرسال الطلب.",
    firmSuccess: (name: string) => `تم إرسال طلب الاستشارة إلى ${name} بنجاح.\nسيردّ عليك المكتب خلال 24 ساعة — ستصلك إشعار عند وصول العرض.`,
    firmAcceptFail: "فشل قبول العرض.",
    firmAcceptedNoRoom: "تم القبول — ستُفتح غرفة المحادثة قريباً.",
    historyLoadErr: "حدث خطأ أثناء تحميل سجل الاستشارات.",
    aiShortTitle: "استشارة قانونية مختصرة",
    choosing: "جاري الاختيار...",
    chooseThisLawyer: "اختيار هذا المحامي",
    errChoose: "حدث خطأ أثناء اختيار المحامي.",
    errNoRoom: "تم اختيار المحامي ولكن لم يتم العثور على غرفة المحادثة.",
    stepNums: ["", "١", "٢", "٣", "٤", "٥"],
  },
  en: {
    headerTitle: "Legal consultations page",
    headerSubtitle: "Here you can request an instant AI consultation, or send a consultation request to an accredited lawyer or an accredited office.",
    guestTitle: "Try your first legal consultation for free 🎁",
    guestSubtitle: "Sign in with one click to get an instant AI consultation, or send your request to an accredited lawyer or office.",
    guestBullets: ["✓ First consultation free", "✓ No commitment", "✓ Starts instantly"],
    googleLogin: "Sign in with Google",
    tabAi: "🤖 Instant AI consultation",
    tabHuman: "👨‍⚖️ Request a consultation from an accredited lawyer",
    tabFirm: "🏛️ Consultation from an accredited office",
    tabHistory: "📜 Consultations history",
    aiTitle: "🤖 AI legal consultation",
    aiLabel: "Consultation text",
    aiPlaceholder: "Write your question or describe your legal situation in detail...",
    aiSending: "Sending the consultation...",
    aiSubmit: "Send the consultation",
    aiAnswerTitle: "AI answer:",
    humanTitle: "👨‍⚖️ Request a consultation from a human lawyer",
    humanTopicLabel: "Consultation topic",
    humanTopicPh: "Example: a dispute over a lease, a financial claim...",
    humanDetailsLabel: "Consultation details",
    humanDetailsPh: "Write the facts of the legal case, dates, parties, and any important documents...",
    humanSending: "Sending the request...",
    humanSubmit: "Send the consultation request",
    firmTitle: "🏛️ Consultation from an accredited office",
    firmSubtitle: "Choose the right office and send your request with your documents — the office will reply with an offer within 24 hours.",
    stepChooseOffice: "Choose the office",
    firmLoadingOffices: "Loading offices...",
    firmNoOffices: "There are no accredited offices at the moment.",
    branchesWord: "branches",
    stepChooseBranch: "Choose the branch",
    branchPlaceholder: "-- Choose the branch --",
    stepSubject: "Consultation topic",
    firmSubjectPh: "Example: a commercial dispute, a partnership contract, an arbitration case...",
    stepDetails: "Consultation details",
    firmDetailsPh: "Write the facts of the legal case in detail — dates, parties, claims...",
    stepDocs: "Upload documents (optional — up to 5 files)",
    clickToPickFiles: "Click to choose files",
    filesHint: "PDF, images, Word — up to 10MB per file",
    firmSending: "Sending the request...",
    chooseOfficeFirst: "Choose an office first",
    sendTo: (name: string) => `Send the request to ${name}`,
    historyTitle: "📜 Previous consultations history",
    historyLoading: "Loading consultations history...",
    histAiTitle: "🤖 AI consultations",
    histAiEmpty: "No previous AI consultations.",
    aiDefaultTitle: "AI legal consultation",
    histHumanTitle: "👨‍⚖️ Consultation requests to lawyers",
    histHumanEmpty: "No human consultation requests yet.",
    reqNo: "Request #",
    openChat: "Open chat",
    lawyerOffers: "Lawyers' offers:",
    noOffersYet: "No lawyer has submitted an offer yet.",
    lawyerDefault: "Lawyer",
    feeAr: "Fee: ",
    notSet: "Not specified",
    noteLabel: "Note: ",
    chosen: "Selected",
    ended: "Ended",
    histFirmTitle: "🏛️ Accredited office requests",
    histFirmEmpty: "No accredited office requests yet.",
    branchOf: (city: string) => ` — ${city} branch`,
    firmOfferTitle: "Office offer:",
    firmFee: "Fees: ",
    acceptOpenChat: "Accept the offer and open chat",
    aiDefaultAnswer: "The consultation was received successfully.",
    aiFail: "The AI consultation request failed.",
    unexpectedDot: "An unexpected error occurred.",
    humanFail: "Failed to send the consultation request.",
    humanSuccess: "The consultation request was sent successfully. Lawyers' offers will appear in the consultations history.",
    firmFail: "Failed to send the request.",
    firmSuccess: (name: string) => `The consultation request was sent to ${name} successfully.\nThe office will reply within 24 hours — you will be notified when the offer arrives.`,
    firmAcceptFail: "Failed to accept the offer.",
    firmAcceptedNoRoom: "Accepted — the chat room will open shortly.",
    historyLoadErr: "An error occurred while loading the consultations history.",
    aiShortTitle: "Brief legal consultation",
    choosing: "Selecting...",
    chooseThisLawyer: "Choose this lawyer",
    errChoose: "An error occurred while selecting the lawyer.",
    errNoRoom: "The lawyer was selected but the chat room was not found.",
    stepNums: ["", "1", "2", "3", "4", "5"],
  },
} as const;

interface AcceptOfferButtonProps {
  requestId: number;
  offerId: number;
  disabled?: boolean;
  onAccepted?: () => void;
  labels: { choosing: string; chooseThisLawyer: string; errChoose: string; errNoRoom: string; unexpectedDot: string };
}

function AcceptOfferButton({ requestId, offerId, disabled, onAccepted, labels }: AcceptOfferButtonProps) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/consultations/human/${requestId}/offers/${offerId}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { alert(data.error || labels.errChoose); setLoading(false); return; }
      const roomId = data?.room?.id;
      if (!roomId) { alert(labels.errNoRoom); setLoading(false); return; }
      if (onAccepted) onAccepted();
      window.location.href = `/chat/${roomId}`;
    } catch { alert(labels.unexpectedDot); setLoading(false); }
  };
  return (
    <button onClick={handleClick} disabled={loading || disabled} className="px-3 py-1.5 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed">
      {loading ? labels.choosing : labels.chooseThisLawyer}
    </button>
  );
}

export default function ConsultationsPage() {
  const { status } = useSession();
  const { locale, dir } = useLocale();
  const t = TR[locale];
  const orgTypeLabel = ORG_TYPE_LABEL[locale];
  const localeTag = locale === "ar" ? "ar-IQ" : "en-US";
  const align = dir === "rtl" ? "text-right" : "text-left";
  const acceptLabels = {
    choosing: t.choosing, chooseThisLawyer: t.chooseThisLawyer,
    errChoose: t.errChoose, errNoRoom: t.errNoRoom, unexpectedDot: t.unexpectedDot,
  };
  const isGuest = status === "unauthenticated";
  const [activeTab, setActiveTab] = useState<TabKey>("ai");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  // ── الذكاء الاصطناعي ──────────────────────────────────────────
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // ── المحامي المعتمد ────────────────────────────────────────────
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
      } catch { setHistoryError(t.historyLoadErr); }
      finally { setHistoryLoading(false); }
    }
    loadHistory();
  }, [activeTab, t.historyLoadErr]);

  // ── الذكاء الاصطناعي ──────────────────────────────────────────
  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAiLoading(true); setAiError(null); setAiAnswer(null);
    try {
      const res = await fetch("/api/consultations/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: aiQuestion.trim().slice(0, 80) || t.aiShortTitle, description: aiQuestion }),
      });
      const data = await res.json();
      if (res.status === 401) { loginWithGoogle(); return; }
      if (res.status === 403 && data.upgradeRequired) { setUpgradeMessage(data.error); setUpgradeOpen(true); return; }
      if (!res.ok) throw new Error(data?.error || t.aiFail);
      setAiAnswer(data.answer || t.aiDefaultAnswer);
    } catch (error: any) {
      setAiError(error?.message || t.unexpectedDot);
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
      if (res.status === 401) { loginWithGoogle(); return; }
      if (res.status === 403 && data.upgradeRequired) { setUpgradeMessage(data.error); setUpgradeOpen(true); return; }
      if (!res.ok) throw new Error(data?.error || t.humanFail);
      setHumanSuccess(t.humanSuccess);
      setHumanTopic(""); setHumanDetails("");
    } catch (error: any) {
      setHumanError(error?.message || t.unexpectedDot);
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
      if (res.status === 401) { loginWithGoogle(); return; }
      if (!res.ok) throw new Error(data?.error || t.firmFail);

      setFirmSuccess(t.firmSuccess(selectedOrg.name));
      setFirmSubject(""); setFirmDetails(""); setFirmFiles([]); setSelectedOrg(null); setSelectedBranchId("");
    } catch (error: any) {
      setFirmError(error?.message || t.unexpectedDot);
    } finally { setFirmLoading(false); }
  }

  // ── قبول عرض المكتب ──────────────────────────────────────────
  async function acceptFirmOffer(requestId: number) {
    try {
      const res = await fetch(`/api/firm-consult/${requestId}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { alert(data?.error || t.firmAcceptFail); return; }
      if (data.chatRoomId) window.location.href = `/firm-chat/${data.chatRoomId}`;
      else { alert(t.firmAcceptedNoRoom); setActiveTab("history"); }
    } catch { alert(t.unexpectedDot); }
  }

  const multiBranch = !!selectedOrg && selectedOrg.branches.length > 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50" dir={dir}>
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} message={upgradeMessage} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className={`mb-6 ${align}`}>
          <h1 className="text-2xl font-bold mb-1">{t.headerTitle}</h1>
          <p className="text-sm text-zinc-400">{t.headerSubtitle}</p>
        </header>

        {/* بطاقة تحويل للزائر غير المسجّل */}
        {isGuest && (
          <div className="mb-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-l from-emerald-500/10 to-sky-500/5 p-5">
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${align}`}>
              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-white">{t.guestTitle}</h2>
                <p className="text-sm text-zinc-300">{t.guestSubtitle}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400 justify-end pt-1">
                  {t.guestBullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
              <button
                onClick={loginWithGoogle}
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-100"
              >
                {t.googleLogin}
              </button>
            </div>
          </div>
        )}

        {/* التبويبات */}
        <div className="flex flex-wrap gap-2 justify-end mb-4">
          <button onClick={() => setActiveTab("ai")} className={`rounded-xl px-4 py-2 text-sm border transition ${activeTab === "ai" ? "border-emerald-500 bg-emerald-500/10 text-emerald-200" : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"}`}>
            {t.tabAi}
          </button>
          <button onClick={() => setActiveTab("human")} className={`rounded-xl px-4 py-2 text-sm border transition ${activeTab === "human" ? "border-sky-500 bg-sky-500/10 text-sky-200" : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"}`}>
            {t.tabHuman}
          </button>
          <button onClick={() => setActiveTab("firm")} className={`rounded-xl px-4 py-2 text-sm border transition ${activeTab === "firm" ? "border-amber-500 bg-amber-500/10 text-amber-200" : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"}`}>
            {t.tabFirm}
          </button>
          <button onClick={() => setActiveTab("history")} className={`rounded-xl px-4 py-2 text-sm border transition ${activeTab === "history" ? "border-zinc-300 bg-zinc-800 text-zinc-100" : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"}`}>
            {t.tabHistory}
          </button>
        </div>

        {/* ── تبويب الذكاء الاصطناعي ── */}
        {activeTab === "ai" && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
            <h2 className={`text-lg font-semibold text-white mb-2 ${align}`}>{t.aiTitle}</h2>
            <form onSubmit={handleAiSubmit} className="space-y-3">
              <div className={align}>
                <label className="block text-sm mb-1 text-zinc-300">{t.aiLabel}</label>
                <textarea className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={6} placeholder={t.aiPlaceholder} value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} />
              </div>
              {aiError && <div className={`text-sm text-red-400 ${align}`}>{aiError}</div>}
              <button type="submit" disabled={aiLoading} className="ms-auto block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
                {aiLoading ? t.aiSending : t.aiSubmit}
              </button>
            </form>
            {aiAnswer && (
              <div className={`mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm ${align}`}>
                <div className="font-semibold mb-1 text-emerald-200">{t.aiAnswerTitle}</div>
                <p className="text-emerald-50 whitespace-pre-line">{aiAnswer}</p>
              </div>
            )}
          </section>
        )}

        {/* ── تبويب المحامي المعتمد ── */}
        {activeTab === "human" && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
            <h2 className={`text-lg font-semibold text-white mb-2 ${align}`}>{t.humanTitle}</h2>
            <form onSubmit={handleHumanSubmit} className="space-y-3">
              <div className={align}>
                <label className="block text-sm mb-1 text-zinc-300">{t.humanTopicLabel}</label>
                <input className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder={t.humanTopicPh} value={humanTopic} onChange={(e) => setHumanTopic(e.target.value)} />
              </div>
              <div className={align}>
                <label className="block text-sm mb-1 text-zinc-300">{t.humanDetailsLabel}</label>
                <textarea className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" rows={6} placeholder={t.humanDetailsPh} value={humanDetails} onChange={(e) => setHumanDetails(e.target.value)} />
              </div>
              {humanError && <div className={`text-sm text-red-400 ${align}`}>{humanError}</div>}
              {humanSuccess && <div className={`text-sm text-emerald-400 ${align}`}>{humanSuccess}</div>}
              <button type="submit" disabled={humanLoading} className="ms-auto block rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60">
                {humanLoading ? t.humanSending : t.humanSubmit}
              </button>
            </form>
          </section>
        )}

        {/* ── تبويب المكاتب المعتمدة ── */}
        {activeTab === "firm" && (
          <section className="rounded-xl border border-amber-500/20 bg-zinc-900/70 p-6 space-y-5">
            <h2 className={`text-lg font-semibold text-white ${align}`}>{t.firmTitle}</h2>
            <p className={`text-sm text-zinc-400 ${align}`}>{t.firmSubtitle}</p>

            {firmSuccess && (
              <div className={`rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm text-emerald-300 ${align} whitespace-pre-line`}>{firmSuccess}</div>
            )}

            {!firmSuccess && (
              <form onSubmit={handleFirmSubmit} className="space-y-5">

                {/* اختيار المكتب */}
                <div className={align}>
                  <label className="block text-sm mb-2 text-zinc-300 font-medium">{t.stepNums[1]}. {t.stepChooseOffice}</label>
                  {orgsLoading ? (
                    <p className="text-sm text-zinc-400">{t.firmLoadingOffices}</p>
                  ) : orgs.length === 0 ? (
                    <p className="text-sm text-zinc-500">{t.firmNoOffices}</p>
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
                            <div className={align}>
                              <div className="text-sm font-semibold text-white">{org.name}</div>
                              <div className="text-xs text-zinc-400">{orgTypeLabel[org.type]} · {org.branches.length} {t.branchesWord}</div>
                            </div>
                            {selectedOrg?.id === org.id && <span className="ms-auto text-amber-400 text-lg">✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* اختيار الفرع */}
                {multiBranch && (
                  <div className={align}>
                    <label className="block text-sm mb-2 text-zinc-300 font-medium">{t.stepNums[2]}. {t.stepChooseBranch}</label>
                    <select
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-100"
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                      required
                    >
                      <option value="">{t.branchPlaceholder}</option>
                      {selectedOrg!.branches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} — {b.city}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* موضوع وتفاصيل الاستشارة */}
                {selectedOrg && (
                  <>
                    <div className={align}>
                      <label className="block text-sm mb-1 text-zinc-300 font-medium">
                        {multiBranch ? t.stepNums[3] : t.stepNums[2]}. {t.stepSubject}
                      </label>
                      <input
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-100"
                        placeholder={t.firmSubjectPh}
                        value={firmSubject}
                        onChange={(e) => setFirmSubject(e.target.value)}
                        required
                      />
                    </div>

                    <div className={align}>
                      <label className="block text-sm mb-1 text-zinc-300 font-medium">
                        {multiBranch ? t.stepNums[4] : t.stepNums[3]}. {t.stepDetails}
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-100"
                        rows={6}
                        placeholder={t.firmDetailsPh}
                        value={firmDetails}
                        onChange={(e) => setFirmDetails(e.target.value)}
                        required
                      />
                    </div>

                    {/* رفع الوثائق */}
                    <div className={align}>
                      <label className="block text-sm mb-2 text-zinc-300 font-medium">
                        {multiBranch ? t.stepNums[5] : t.stepNums[4]}. {t.stepDocs}
                      </label>

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500/50 transition"
                      >
                        <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                        <p className="text-sm text-zinc-400">{t.clickToPickFiles}</p>
                        <p className="text-xs text-zinc-600 mt-1">{t.filesHint}</p>
                        <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={handleFileAdd} />
                      </div>

                      {firmFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {firmFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
                              <button type="button" onClick={() => removeFile(idx)} className="text-zinc-500 hover:text-red-400 transition flex-shrink-0">
                                <X className="w-4 h-4" />
                              </button>
                              <div className={`flex items-center gap-2 text-sm text-zinc-300 flex-1 ${align}`}>
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

                {firmError && <div className={`text-sm text-red-400 ${align}`}>{firmError}</div>}

                <button
                  type="submit"
                  disabled={firmLoading || !selectedOrg || !firmSubject || !firmDetails}
                  className="w-full rounded-lg bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {firmLoading ? t.firmSending : selectedOrg ? t.sendTo(selectedOrg.name) : t.chooseOfficeFirst}
                </button>
              </form>
            )}
          </section>
        )}

        {/* ── تبويب السجل ── */}
        {activeTab === "history" && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
            <h2 className={`text-lg font-semibold text-white mb-2 ${align}`}>{t.historyTitle}</h2>

            {historyLoading && <div className="text-center text-zinc-400 py-4">{t.historyLoading}</div>}
            {historyError && <div className={`text-sm text-red-400 ${align}`}>{historyError}</div>}

            {!historyLoading && !historyError && (
              <div className="space-y-6">

                {/* استشارات الذكاء الاصطناعي */}
                <div className="space-y-2">
                  <h3 className={`text-sm font-semibold text-emerald-300 ${align}`}>{t.histAiTitle}</h3>
                  {aiHistory.length === 0 ? (
                    <div className={`text-sm text-zinc-500 ${align}`}>{t.histAiEmpty}</div>
                  ) : (
                    <div className="space-y-2">
                      {aiHistory.map((c) => (
                        <div key={c.id} className={`rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm ${align}`}>
                          <div className="flex justify-between mb-1">
                            <span className="text-zinc-300">{c.title?.slice(0, 80) || t.aiDefaultTitle}</span>
                            <span className="text-xs text-zinc-500">{new Date(c.createdAt).toLocaleString(localeTag)}</span>
                          </div>
                          <div className="text-xs text-zinc-400">{c.description?.slice(0, 120)}{c.description && c.description.length > 120 ? "..." : ""}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/*   طلبات الاستشارة من المحامين المعتمدين*/}
                <div className="space-y-2">
                  <h3 className={`text-sm font-semibold text-sky-300 ${align}`}>{t.histHumanTitle}</h3>
                  {humanRequests.length === 0 ? (
                    <div className={`text-sm text-zinc-500 ${align}`}>{t.histHumanEmpty}</div>
                  ) : (
                    <div className="space-y-3">
                      {humanRequests.map((req) => {
                        const chatRoomId = req.chatRoom?.id;
                        const hasAcceptedOffer = req.offers.some((o) => o.status === "ACCEPTED_BY_CLIENT");
                        const canOpenChat = !!chatRoomId && ["ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(req.status);
                        return (
                          <div key={req.id} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 text-sm">
                            <div className={`flex flex-col gap-1 mb-2 ${align}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-500">{t.reqNo}{req.id}</span>
                                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-0.5 text-[11px] font-medium ${statusColorClasses(req.status)}`}>
                                  <span className="inline-block w-2 h-2 rounded-full bg-current/70" />
                                  {HUMAN_STATUS[locale][req.status] || req.status}
                                </span>
                              </div>
                              {canOpenChat && (
                                <div className="mt-2 flex justify-end">
                                  <button onClick={() => (window.location.href = `/chat/${chatRoomId}`)} className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 border border-white/10">{t.openChat}</button>
                                </div>
                              )}
                              <div className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleString(localeTag)}</div>
                            </div>
                            {req.consultation && (
                              <div className={`mb-3 ${align}`}>
                                <div className="font-semibold mb-1">{req.consultation.title}</div>
                                <div className="text-xs text-zinc-400 whitespace-pre-line">{req.consultation.description}</div>
                              </div>
                            )}
                            <div className="mt-2 space-y-2">
                              <div className={`font-semibold ${align} text-zinc-200`}>{t.lawyerOffers}</div>
                              {req.offers.length === 0 ? (
                                <div className={`text-xs text-zinc-500 ${align}`}>{t.noOffersYet}</div>
                              ) : (
                                <div className="space-y-2">
                                  {req.offers.map((offer) => (
                                    <div key={offer.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-3">
                                      <div className={`flex-1 ${align} space-y-1`}>
                                        <div className="font-medium">{offer.lawyer?.name || t.lawyerDefault}</div>
                                        <div className="text-xs text-zinc-400">{t.feeAr}<span className="font-semibold text-zinc-50">{offer.fee ?? t.notSet} {offer.currency || "IQD"}</span></div>
                                        {offer.note && <div className="text-xs text-zinc-500">{t.noteLabel}{offer.note}</div>}
                                      </div>
                                      <div className="flex flex-col items-center gap-1">
                                        {offer.status === "ACCEPTED_BY_CLIENT" ? (
                                          <span className="text-xs text-emerald-400">{t.chosen}</span>
                                        ) : req.status === "COMPLETED" || req.status === "CANCELED" ? (
                                          <span className="text-xs text-zinc-500">{t.ended}</span>
                                        ) : (
                                          <AcceptOfferButton requestId={req.id} offerId={offer.id} disabled={hasAcceptedOffer} onAccepted={() => setActiveTab("history")} labels={acceptLabels} />
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
                  <h3 className={`text-sm font-semibold text-amber-300 ${align}`}>{t.histFirmTitle}</h3>
                  {firmRequests.length === 0 ? (
                    <div className={`text-sm text-zinc-500 ${align}`}>{t.histFirmEmpty}</div>
                  ) : (
                    <div className="space-y-3">
                      {firmRequests.map((req) => (
                        <div key={req.id} className="rounded-lg border border-amber-500/20 bg-zinc-900 px-3 py-3 text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-500">{t.reqNo}{req.id}</span>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] font-medium ${firmStatusColor(req.status)}`}>
                              {FIRM_STATUS[locale][req.status] || req.status}
                            </span>
                          </div>
                          <div className={`${align} space-y-1`}>
                            <div className="font-semibold text-white">{req.subject}</div>
                            <div className="text-xs text-zinc-400">{req.org.name}{req.branch ? t.branchOf(req.branch.city) : ""}</div>
                            <div className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleString(localeTag)}</div>
                          </div>
                          {req.offer && (
                            <div className={`mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 ${align} space-y-2`}>
                              <div className="text-xs font-semibold text-amber-300">{t.firmOfferTitle}</div>
                              <div className="text-sm text-zinc-200">{t.firmFee}<span className="font-bold">{req.offer.fee} {req.offer.currency}</span></div>
                              {req.offer.note && <div className="text-xs text-zinc-400">{t.noteLabel}{req.offer.note}</div>}
                              {req.offer.status === "PENDING" && (
                                <button onClick={() => acceptFirmOffer(req.id)} className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition">
                                  {t.acceptOpenChat}
                                </button>
                              )}
                              {req.offer.status === "ACCEPTED" && req.chatRoom && (
                                <button onClick={() => (window.location.href = `/firm-chat/${req.chatRoom!.id}`)} className="w-full py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-xs transition">
                                  {t.openChat}
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

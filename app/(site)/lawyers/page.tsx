 // app/(site)/lawyers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  User2, Mail, Phone, MapPin, Star, Briefcase,
  Globe, ChevronLeft,
} from "lucide-react";
import AddFirmModal from "@/components/admin/AddFirmModal";
import { useLocale } from "@/lib/hooks/useLocale";

type Lawyer = {
  id: number; fullName: string; email: string; phone?: string;
  specialization: string; bio?: string; experience?: number | null;
  location?: string; rating: number; avatarUrl?: string; available: boolean;
};

type HumanRequestItem = {
  id: number; status: string; createdAt: string;
  consultation: { id: number; title: string; description: string; user?: { id: number; name: string | null } | null } | null;
  hasOffered: boolean;
  myOffer: { id: number; fee: number; currency: string; status: string } | null;
};

type Branch = { id: number; name: string; city: string; country: string; email?: string; phone?: string };

type Organization = {
  id: number; name: string; type: string; logo?: string; website?: string;
  description?: string; email?: string; phone?: string;
  branches: Branch[]; totalRequests: number;
};

type PendingItem = {
  id: number; name: string | null; email: string | null;
  pendingBio: string | null; pendingAvatarUrl: string | null;
};

type LawyersResponse = { items: Lawyer[]; total: number; page: number; pageSize: number };
type OpenRequestsResponse = { items: HumanRequestItem[] };
type OrgsResponse = { items: Organization[]; total: number };
type TabKey = "list" | "requests" | "firms" | "pending";

const ORG_TYPE_LABEL: Record<"ar" | "en", Record<string, string>> = {
  ar: { LAW_FIRM: "مكتب محاماة", COMPANY: "شركة", GOVERNMENT: "جهة حكومية", OTHER: "أخرى" },
  en: { LAW_FIRM: "Law firm", COMPANY: "Company", GOVERNMENT: "Government entity", OTHER: "Other" },
};

const T = {
  ar: {
    title: "ابحث عن محامٍ معتمد",
    subtitle: "تصفّح المحامين والمكاتب المعتمدة، واطلب استشارتك عبر المنصة بأمان وتوثيق رسمي.",
    addLawyer: "+ إضافة محامٍ",
    addFirm: "🏛️ إضافة مكتب",
    tabList: "📚 قائمة المحامين",
    tabRequests: "👨‍⚖️ طلبات استشارة متاحة للعرض",
    tabFirms: "🏛️ المكاتب المعتمدة",
    tabPending: "🔔 طلبات المراجعة",
    searchGeneral: "بحث عام...",
    specialization: "الاختصاص",
    location: "الموقع",
    filter: "تصفية",
    loading: "جاري التحميل...",
    notSet: "غير محدد",
    viewProfile: "عرض الملف وطلب استشارة ←",
    noResults: "لا توجد نتائج.",
    uploading: "جارٍ الرفع...",
    uploadPhoto: "رفع صورة",
    resendInvite: "🔁 إعادة إرسال الدعوة",
    offerTitle: "تقديم عرض للاستشارة",
    feeLabel: "الأجرة (دينار عراقي)",
    feePlaceholder: "مثال: 50000",
    noteLabel: "ملاحظة للمستفيد (اختياري)",
    notePlaceholder: "وضّح ما يشمله العرض ومدّته...",
    cancel: "إلغاء",
    sending: "جارٍ الإرسال...",
    sendOffer: "إرسال العرض",
    reqLoading: "جارٍ تحميل طلبات الاستشارة...",
    reqEmpty: "لا توجد طلبات استشارة مفتوحة حاليًا.",
    reqId: "رقم الطلب: ",
    reqUntitled: "استشارة بدون عنوان",
    reqAsker: "طالب الاستشارة: ",
    reqRegistered: "مستخدم مسجل",
    reqDate: "تاريخ الطلب: ",
    statusLabel: "الحالة: ",
    offeredBefore: "قدمت عرضًا سابقًا:",
    fee: "الأجرة: ",
    offerStatus: "حالة العرض: ",
    editOffer: "تعديل العرض",
    makeOffer: "تقديم عرض للاستشارة",
    backToList: "العودة للقائمة",
    accredited: "✓ معتمد",
    branches: "الفروع الإقليمية",
    requestFrom: (name: string) => `طلب استشارة من ${name} عبر صفحة الاستشارات ←`,
    searchFirm: "بحث عن مكتب...",
    optLawFirms: "مكاتب المحاماة",
    optCompanies: "الشركات",
    optAll: "الكل",
    firmsLoading: "جارٍ تحميل المكاتب...",
    firmsEmpty: "لا توجد مكاتب معتمدة حالياً.",
    accreditedFirm: "✓ مكتب معتمد",
    branchWord: (n: number) => (n === 1 ? "فرع" : "فروع"),
    branchesWord: "فروع",
    doneConsults: "استشارة منجزة",
    viewFullPage: "عرض الصفحة الكاملة ←",
    pendingLoading: "جارٍ التحميل...",
    pendingEmpty: "لا توجد طلبات مراجعة معلقة.",
    pendingBio: "📝 نبذة جديدة بانتظار الموافقة:",
    pendingAvatar: "🖼️ صورة جديدة بانتظار الموافقة:",
    approve: "✅ موافقة ونشر",
    reject: "❌ رفض وحذف",
    // prompts / alerts
    promptName: "اسم المحامي الكامل:",
    promptEmail: "البريد الإلكتروني:",
    promptPhone: "رقم الهاتف (اختياري):",
    promptLocation: "الموقع (المدينة):",
    defaultCity: "بغداد",
    createdOk: "تم إنشاء حساب المحامي وإرسال رابط التفعيل",
    createFail: "فشل إنشاء محامٍ",
    confirmResend: "هل تريد إعادة إرسال رابط تفعيل الحساب؟",
    resendFail: "فشل إعادة إرسال الدعوة",
    resendOk: "تمت إعادة إرسال رابط التفعيل بنجاح",
    unexpected: "حدث خطأ غير متوقع",
    avatarOk: "تم رفع صورة المحامي بنجاح",
    avatarFail: "فشل رفع الصورة",
    feeInvalid: "يرجى إدخال أجرة صحيحة أكبر من صفر.",
    offerFail: "فشل إرسال العرض.",
    reqLoadFail: "فشل تحميل الطلبات.",
    firmsLoadFail: "فشل تحميل المكاتب.",
  },
  en: {
    title: "Find an accredited lawyer",
    subtitle: "Browse accredited lawyers and offices, and request your consultation through the platform securely and with official documentation.",
    addLawyer: "+ Add lawyer",
    addFirm: "🏛️ Add office",
    tabList: "📚 Lawyers list",
    tabRequests: "👨‍⚖️ Consultation requests open for offers",
    tabFirms: "🏛️ Accredited offices",
    tabPending: "🔔 Review requests",
    searchGeneral: "General search...",
    specialization: "Specialization",
    location: "Location",
    filter: "Filter",
    loading: "Loading...",
    notSet: "Not specified",
    viewProfile: "View profile and request a consultation →",
    noResults: "No results.",
    uploading: "Uploading...",
    uploadPhoto: "Upload photo",
    resendInvite: "🔁 Resend invite",
    offerTitle: "Submit an offer for the consultation",
    feeLabel: "Fee (Iraqi Dinar)",
    feePlaceholder: "Example: 50000",
    noteLabel: "Note to the client (optional)",
    notePlaceholder: "Explain what the offer includes and its duration...",
    cancel: "Cancel",
    sending: "Sending...",
    sendOffer: "Send offer",
    reqLoading: "Loading consultation requests...",
    reqEmpty: "There are no open consultation requests at the moment.",
    reqId: "Request no.: ",
    reqUntitled: "Untitled consultation",
    reqAsker: "Requested by: ",
    reqRegistered: "Registered user",
    reqDate: "Request date: ",
    statusLabel: "Status: ",
    offeredBefore: "You submitted an offer earlier:",
    fee: "Fee: ",
    offerStatus: "Offer status: ",
    editOffer: "Edit offer",
    makeOffer: "Submit an offer",
    backToList: "Back to the list",
    accredited: "✓ Accredited",
    branches: "Regional branches",
    requestFrom: (name: string) => `Request a consultation from ${name} via the consultations page →`,
    searchFirm: "Search for an office...",
    optLawFirms: "Law firms",
    optCompanies: "Companies",
    optAll: "All",
    firmsLoading: "Loading offices...",
    firmsEmpty: "There are no accredited offices at the moment.",
    accreditedFirm: "✓ Accredited office",
    branchWord: (n: number) => (n === 1 ? "branch" : "branches"),
    branchesWord: "branches",
    doneConsults: "completed consultations",
    viewFullPage: "View full page →",
    pendingLoading: "Loading...",
    pendingEmpty: "There are no pending review requests.",
    pendingBio: "📝 New bio awaiting approval:",
    pendingAvatar: "🖼️ New photo awaiting approval:",
    approve: "✅ Approve and publish",
    reject: "❌ Reject and delete",
    promptName: "Lawyer's full name:",
    promptEmail: "Email:",
    promptPhone: "Phone number (optional):",
    promptLocation: "Location (city):",
    defaultCity: "Baghdad",
    createdOk: "The lawyer account was created and an activation link was sent",
    createFail: "Failed to create a lawyer",
    confirmResend: "Do you want to resend the account activation link?",
    resendFail: "Failed to resend the invite",
    resendOk: "The activation link was resent successfully",
    unexpected: "An unexpected error occurred",
    avatarOk: "The lawyer photo was uploaded successfully",
    avatarFail: "Failed to upload the photo",
    feeInvalid: "Please enter a valid fee greater than zero.",
    offerFail: "Failed to send the offer.",
    reqLoadFail: "Failed to load the requests.",
    firmsLoadFail: "Failed to load the offices.",
  },
} as const;

export default function LawyersPage() {
  const { locale, dir } = useLocale();
  const t = T[locale];
  const orgTypeLabel = ORG_TYPE_LABEL[locale];
  const localeTag = locale === "ar" ? "ar-IQ" : "en-US";

  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;
  const isAdmin = role === "ADMIN";
  const isLawyer = role === "LAWYER";

  const [activeTab, setActiveTab] = useState<TabKey>("list");
  const [showFirmModal, setShowFirmModal] = useState(false);

  // ─── قائمة المحامين ──────────────────────────────────────────
  const [q, setQ] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [location, setLocation] = useState("");
  const [data, setData] = useState<LawyersResponse>({ items: [], total: 0, page: 1, pageSize: 12 });
  const [loading, setLoading] = useState(false);

  const fetchLawyers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), pageSize: "12" });
      if (q) params.set("q", q);
      if (specialization) params.set("specialization", specialization);
      if (location) params.set("location", location);
      const res = await fetch(`/api/lawyers?${params.toString()}`);
      if (!res.ok) return;
      setData(await res.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLawyers(1); }, []);

  async function quickCreate() {
    const name = prompt(t.promptName);
    const email = prompt(t.promptEmail);
    const phone = prompt(t.promptPhone) || "";
    const locationVal = prompt(t.promptLocation) || t.defaultCity;
    if (!name || !email) return;
    const res = await fetch("/api/admin/lawyers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, location: locationVal }),
    });
    const json = await res.json();
    if (res.ok) { alert(t.createdOk); fetchLawyers(data.page); }
    else alert(json?.error || t.createFail);
  }

  async function resendInvite(email: string) {
    if (!confirm(t.confirmResend)) return;
    try {
      const res = await fetch("/api/admin/lawyers/resend-invite", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) { alert(json?.error || t.resendFail); return; }
      alert(t.resendOk);
    } catch { alert(t.unexpected); }
  }

  function AdminUploadAvatar({ lawyerId, onUploaded }: { lawyerId: number; onUploaded?: () => void }) {
    const [uploading, setUploading] = useState(false);
    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]; if (!file) return;
      setUploading(true);
      const form = new FormData(); form.append("file", file); form.append("lawyerId", String(lawyerId));
      const res = await fetch("/api/lawyers/avatar/upload", { method: "POST", body: form });
      setUploading(false);
      if (res.ok) { alert(t.avatarOk); onUploaded?.(); }
      else alert(t.avatarFail);
    }
    return (
      <label className="cursor-pointer text-xs px-3 py-1 rounded-lg border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 transition">
        {uploading ? t.uploading : t.uploadPhoto}
        <input type="file" hidden accept="image/*" onChange={handleChange} />
      </label>
    );
  }

  // ─── طلبات الاستشارة ─────────────────────────────────────────
  const [requests, setRequests] = useState<HumanRequestItem[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);

  // ── مودال تقديم العرض ─────────────────────────────────────────
  const [offerFor, setOfferFor] = useState<number | null>(null);
  const [offerFee, setOfferFee] = useState("");
  const [offerNote, setOfferNote] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerErr, setOfferErr] = useState<string | null>(null);

  const fetchOpenRequests = async () => {
    try {
      setReqLoading(true); setReqError(null);
      const res = await fetch("/api/lawyers/human-requests/open");
      const json: OpenRequestsResponse | { error: string } = await res.json();
      if (!res.ok) { setReqError((json as any)?.error || t.reqLoadFail); setRequests([]); return; }
      setRequests((json as OpenRequestsResponse).items || []);
    } catch { setReqError(t.unexpected + "."); }
    finally { setReqLoading(false); }
  };

  useEffect(() => { if (activeTab === "requests") fetchOpenRequests(); }, [activeTab]);

  function handleOffer(requestId: number) {
    setOfferFor(requestId); setOfferFee(""); setOfferNote(""); setOfferErr(null);
  }

  async function submitOffer() {
    if (offerFor == null) return;
    const fee = Number(offerFee);
    if (!fee || isNaN(fee) || fee <= 0) { setOfferErr(t.feeInvalid); return; }
    setOfferSubmitting(true); setOfferErr(null);
    try {
      const res = await fetch(`/api/lawyers/human-requests/${offerFor}/offer`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fee, note: offerNote, currency: "IQD" }),
      });
      const json = await res.json();
      if (!res.ok) { setOfferErr(json?.error || t.offerFail); return; }
      setOfferFor(null);
      fetchOpenRequests();
    } catch { setOfferErr(t.unexpected + "."); }
    finally { setOfferSubmitting(false); }
  }

  // ─── المكاتب المعتمدة ─────────────────────────────────────────
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [orgsError, setOrgsError] = useState<string | null>(null);
  const [orgQ, setOrgQ] = useState("");
  const [orgType, setOrgType] = useState("LAW_FIRM");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const fetchOrgs = async () => {
    try {
      setOrgsLoading(true); setOrgsError(null);
      const params = new URLSearchParams();
      if (orgQ) params.set("q", orgQ);
      params.set("type", orgType || "LAW_FIRM");
      const res = await fetch(`/api/organizations?${params.toString()}`);
      const json: OrgsResponse | { error: string } = await res.json();
      if (!res.ok) { setOrgsError((json as any)?.error || t.firmsLoadFail); return; }
      setOrgs((json as OrgsResponse).items || []);
    } catch { setOrgsError(t.unexpected + "."); }
    finally { setOrgsLoading(false); }
  };

  useEffect(() => { if (activeTab === "firms") fetchOrgs(); }, [activeTab]);

  // ─── طلبات المراجعة (أدمن) ───────────────────────────────────
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  const fetchPending = async () => {
    setPendingLoading(true);
    const res = await fetch("/api/admin/lawyers/pending-profiles");
    const json = await res.json();
    setPending(json.items || []);
    setPendingLoading(false);
  };

  useEffect(() => { if (activeTab === "pending" && isAdmin) fetchPending(); }, [activeTab]);

  async function handleApprove(lawyerId: number, field: string, action: string) {
    const res = await fetch(`/api/admin/lawyers/${lawyerId}/approve-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, field }),
    });
    const json = await res.json();
    alert(json.message || json.error);
    fetchPending();
  }

  const align = dir === "rtl" ? "text-right" : "text-left";

  return (
    <main className={`p-6 max-w-6xl mx-auto space-y-6 ${align} text-zinc-100`} dir={dir}>

      {showFirmModal && (
        <AddFirmModal
          onClose={() => setShowFirmModal(false)}
          onSuccess={() => { if (activeTab === "firms") fetchOrgs(); }}
        />
      )}

      {/* مودال تقديم العرض (للمحامي) */}
      {offerFor !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => !offerSubmitting && setOfferFor(null)}>
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white">{t.offerTitle}</h3>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">{t.feeLabel}</label>
              <input
                type="number" min={1} value={offerFee}
                onChange={(e) => setOfferFee(e.target.value)}
                placeholder={t.feePlaceholder}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">{t.noteLabel}</label>
              <textarea
                rows={3} value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
                placeholder={t.notePlaceholder}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
            {offerErr && <p className="text-sm text-red-400">{offerErr}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setOfferFor(null)} disabled={offerSubmitting} className="px-4 py-2 rounded-lg border border-zinc-600 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-50">{t.cancel}</button>
              <button onClick={submitOffer} disabled={offerSubmitting} className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
                {offerSubmitting ? t.sending : t.sendOffer}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-sm text-zinc-400">{t.subtitle}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={quickCreate} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              {t.addLawyer}
            </button>
            <button onClick={() => setShowFirmModal(true)} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              {t.addFirm}
            </button>
          </div>
        )}
      </header>

      {/* التبويبات */}
      <div className="flex gap-2 justify-end flex-wrap">
        <button onClick={() => setActiveTab("list")} className={`px-4 py-2 rounded-xl border text-sm transition-colors ${activeTab === "list" ? "bg-emerald-600 text-white border-emerald-500" : "bg-zinc-900/60 text-zinc-200 border-zinc-700 hover:bg-zinc-800"}`}>
          {t.tabList}
        </button>
        {(isLawyer || isAdmin) && (
          <button onClick={() => setActiveTab("requests")} className={`px-4 py-2 rounded-xl border text-sm transition-colors ${activeTab === "requests" ? "bg-blue-600 text-white border-blue-500" : "bg-zinc-900/60 text-zinc-200 border-zinc-700 hover:bg-zinc-800"}`}>
            {t.tabRequests}
          </button>
        )}
        <button onClick={() => setActiveTab("firms")} className={`px-4 py-2 rounded-xl border text-sm transition-colors ${activeTab === "firms" ? "bg-amber-600 text-white border-amber-500" : "bg-zinc-900/60 text-zinc-200 border-zinc-700 hover:bg-zinc-800"}`}>
          {t.tabFirms}
        </button>
        {/* تبويب المراجعة للأدمن فقط */}
        {isAdmin && (
          <button onClick={() => setActiveTab("pending")} className={`px-4 py-2 rounded-xl border text-sm transition-colors ${activeTab === "pending" ? "bg-rose-600 text-white border-rose-500" : "bg-zinc-900/60 text-zinc-200 border-zinc-700 hover:bg-zinc-800"}`}>
            {t.tabPending}
          </button>
        )}
      </div>

      {/* ── تبويب المحامين ── */}
      {activeTab === "list" && (
        <section className="space-y-4">
          <section className="flex gap-2 flex-wrap items-center justify-end">
            <input className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder={t.searchGeneral} value={q} onChange={(e) => setQ(e.target.value)} />
            <input className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder={t.specialization} value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
            <input className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder={t.location} value={location} onChange={(e) => setLocation(e.target.value)} />
            <button onClick={() => fetchLawyers(1)} className="px-4 py-2 rounded-lg border border-emerald-600 text-sm text-emerald-300 hover:bg-emerald-600/10 transition-colors">{t.filter}</button>
          </section>

          {loading ? <p className="text-sm text-zinc-400">{t.loading}</p> : (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((l) => (
                  <a key={l.id} href={`/lawyers/${l.id}`} className="border border-white/10 rounded-2xl p-4 hover:shadow-lg hover:border-emerald-400/60 transition bg-zinc-900/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="relative">
                        <img src={l.avatarUrl || "/default-lawyer.png"} className="w-20 h-20 rounded-full object-cover border border-white/10" alt={l.fullName} />
                        {isAdmin && (
                          <div className="mt-2 flex flex-col gap-1">
                            <AdminUploadAvatar lawyerId={l.id} onUploaded={() => fetchLawyers(data.page)} />
                            <button onClick={(e) => { e.preventDefault(); resendInvite(l.email); }} className="text-xs px-3 py-1 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition">
                              {t.resendInvite}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-base font-semibold text-white"><User2 className="w-4 h-4 text-emerald-400" /><span>{l.fullName}</span></div>
                      <div className="flex items-center gap-1 text-sm text-zinc-300"><Briefcase className="w-4 h-4 text-zinc-400" /><span>{l.specialization}</span></div>
                      <div className="flex items-center gap-1 text-xs text-zinc-400"><MapPin className="w-3 h-3" /><span>{l.location || t.notSet}</span></div>
                      <div className="flex items-center gap-1 text-sm mt-1"><Star className="w-4 h-4 text-yellow-400" /><span className="text-zinc-200">{l.rating?.toFixed(1) ?? "0.0"}</span></div>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border bg-emerald-500/15 text-emerald-300 border-emerald-500/50">
                        {t.viewProfile}
                      </div>
                      {isAdmin && (
                        <div className="mt-2 flex flex-col items-center gap-1 text-xs text-zinc-400">
                          {l.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" /><span>{l.email}</span></div>}
                          {l.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /><span>{l.phone}</span></div>}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
              {data.total === 0 && <p className="text-zinc-400 text-sm">{t.noResults}</p>}
            </>
          )}
        </section>
      )}

      {/* ── تبويب طلبات الاستشارة ── */}
      {activeTab === "requests" && (
        <section className="space-y-4">
          {reqLoading && <p className="text-sm text-zinc-400">{t.reqLoading}</p>}
          {reqError && <p className="text-sm text-red-400 border border-red-500/40 bg-red-950/40 rounded-lg p-2">{reqError}</p>}
          {!reqLoading && !reqError && requests.length === 0 && <p className="text-zinc-400 text-sm">{t.reqEmpty}</p>}
          {requests.length > 0 && (
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="border border-white/10 rounded-2xl p-4 bg-zinc-900/70 shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="text-xs text-zinc-400">{t.reqId}{r.id}</div>
                      <h3 className="font-semibold text-zinc-50">{r.consultation?.title || t.reqUntitled}</h3>
                      <p className="text-sm text-zinc-200 whitespace-pre-line">{r.consultation?.description}</p>
                      <div className="text-xs text-zinc-400 mt-1">{t.reqAsker}{r.consultation?.user?.name || t.reqRegistered}</div>
                      <div className="text-xs text-zinc-500">{t.reqDate}{new Date(r.createdAt).toLocaleString(localeTag)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[180px]">
                      <span className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-600">{t.statusLabel}{r.status}</span>
                      {r.hasOffered && r.myOffer && (
                        <div className={`text-xs text-emerald-200 bg-emerald-950/40 border border-emerald-500/40 rounded-lg px-2 py-2 ${align} w-full`}>
                          <div>{t.offeredBefore}</div>
                          <div>{t.fee}{r.myOffer.fee} {r.myOffer.currency}</div>
                          <div>{t.offerStatus}{r.myOffer.status}</div>
                        </div>
                      )}
                      <button onClick={() => handleOffer(r.id)} className="px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-500 transition w-full">
                        {r.hasOffered ? t.editOffer : t.makeOffer}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── تبويب المكاتب المعتمدة ── */}
      {activeTab === "firms" && (
        <section className="space-y-4">
          {selectedOrg ? (
            <div className="space-y-4">
              <button onClick={() => setSelectedOrg(null)} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition">
                <ChevronLeft className="w-4 h-4" /> {t.backToList}
              </button>
              <div className="border border-amber-500/30 rounded-2xl p-6 bg-zinc-900/80 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl font-serif">
                    {selectedOrg.name.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{selectedOrg.name}</h2>
                      <span className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">{t.accredited}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{orgTypeLabel[selectedOrg.type] || selectedOrg.type}</p>
                  </div>
                </div>
                {selectedOrg.description && <p className="text-sm text-zinc-300 leading-relaxed">{selectedOrg.description}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
                  {selectedOrg.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{selectedOrg.email}</span>}
                  {selectedOrg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selectedOrg.phone}</span>}
                  {selectedOrg.website && <a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-amber-400 hover:underline"><Globe className="w-3 h-3" />{selectedOrg.website}</a>}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2">{t.branches}</h3>
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                    {selectedOrg.branches.map((b) => (
                      <div key={b.id} className="border border-zinc-700 rounded-xl p-3 bg-zinc-800/50 text-xs space-y-1">
                        <div className="font-semibold text-zinc-100">{b.name}</div>
                        <div className="flex items-center gap-1 text-zinc-400"><MapPin className="w-3 h-3" />{b.city}{locale === "ar" ? "، " : ", "}{b.country}</div>
                        {b.email && <div className="flex items-center gap-1 text-zinc-400"><Mail className="w-3 h-3" />{b.email}</div>}
                        {b.phone && <div className="flex items-center gap-1 text-zinc-400"><Phone className="w-3 h-3" />{b.phone}</div>}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => { window.location.href = "/consultations"; }} className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition">
                  {t.requestFrom(selectedOrg.name)}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2 flex-wrap items-center justify-end">
                <input className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500" placeholder={t.searchFirm} value={orgQ} onChange={(e) => setOrgQ(e.target.value)} />
                <select className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500" value={orgType} onChange={(e) => setOrgType(e.target.value)}>
                  <option value="LAW_FIRM">{t.optLawFirms}</option>
                  {isAdmin && <option value="COMPANY">{t.optCompanies}</option>}
                  {isAdmin && <option value="">{t.optAll}</option>}
                </select>
                <button onClick={fetchOrgs} className="px-4 py-2 rounded-lg border border-amber-600 text-sm text-amber-300 hover:bg-amber-600/10 transition-colors">{t.filter}</button>
              </div>
              {orgsLoading && <p className="text-sm text-zinc-400">{t.firmsLoading}</p>}
              {orgsError && <p className="text-sm text-red-400 border border-red-500/40 bg-red-950/40 rounded-lg p-2">{orgsError}</p>}
              {!orgsLoading && !orgsError && orgs.length === 0 && <p className="text-zinc-400 text-sm">{t.firmsEmpty}</p>}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {orgs.map((org) => (
                  <div key={org.id} onClick={() => setSelectedOrg(org)} className="border border-amber-500/30 rounded-2xl overflow-hidden bg-zinc-900/80 hover:border-amber-400/60 transition cursor-pointer">
                    <div className="bg-amber-900/40 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs text-amber-300 font-semibold">{t.accreditedFirm}</span>
                      <span className="text-xs text-amber-400/70">{orgTypeLabel[org.type] || org.type}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm font-serif flex-shrink-0">
                          {org.name.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{org.name}</div>
                          <div className="text-xs text-zinc-400">{org.branches.length} {t.branchWord(org.branches.length)}</div>
                        </div>
                      </div>
                      {org.description && <p className="text-xs text-zinc-400 line-clamp-2">{org.description}</p>}
                      <div className="flex flex-wrap gap-1">
                        {org.branches.map((b) => (
                          <span key={b.id} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">{b.city}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t border-zinc-700/50 pt-3">
                        <div className="text-center">
                          <div className="text-sm font-bold text-amber-400">{org.branches.length}</div>
                          <div className="text-[10px] text-zinc-500">{t.branchesWord}</div>
                        </div>
                        <div className="text-center border-r border-zinc-700/50">
                          <div className="text-sm font-bold text-amber-400">{org.totalRequests}</div>
                          <div className="text-[10px] text-zinc-500">{t.doneConsults}</div>
                        </div>
                      </div>
                      <button className="w-full py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-bold transition">
                        {t.viewFullPage}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* ── تبويب طلبات المراجعة (أدمن فقط) ── */}
      {activeTab === "pending" && isAdmin && (
        <section className="space-y-4">
          {pendingLoading && <p className="text-sm text-zinc-400">{t.pendingLoading}</p>}
          {!pendingLoading && pending.length === 0 && (
            <p className="text-zinc-400 text-sm">{t.pendingEmpty}</p>
          )}
          {pending.map((p) => (
            <div key={p.id} className="border border-zinc-700 rounded-2xl p-4 bg-zinc-900/70 space-y-4">
              <div className="font-semibold text-white">
                {p.name} — <span className="text-zinc-400 text-sm font-normal">{p.email}</span>
              </div>

              {/* نبذة معلقة */}
              {p.pendingBio && (
                <div className="space-y-2">
                  <p className="text-xs text-amber-400 font-semibold">{t.pendingBio}</p>
                  <p className="text-sm text-zinc-200 border border-zinc-700 rounded-lg p-3 bg-zinc-800/50 whitespace-pre-wrap">
                    {p.pendingBio}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(p.id, "bio", "approve")} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition">
                      {t.approve}
                    </button>
                    <button onClick={() => handleApprove(p.id, "bio", "reject")} className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs transition">
                      {t.reject}
                    </button>
                  </div>
                </div>
              )}

              {/* صورة معلقة */}
              {p.pendingAvatarUrl && (
                <div className="space-y-2">
                  <p className="text-xs text-amber-400 font-semibold">{t.pendingAvatar}</p>
                  <img
                    src={p.pendingAvatarUrl}
                    alt="pending avatar"
                    className="w-24 h-24 rounded-full object-cover border border-zinc-600"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(p.id, "avatar", "approve")} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition">
                      {t.approve}
                    </button>
                    <button onClick={() => handleApprove(p.id, "avatar", "reject")} className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs transition">
                      {t.reject}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

    </main>
  );
}

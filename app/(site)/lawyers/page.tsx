 //app/(site)/lawyer/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  User2,
  Mail,
  Phone,
  MapPin,
  Star,
  Briefcase,
  CheckCircle2,
  XCircle,
  Building2,
  Globe,
  ChevronLeft,
} from "lucide-react";

type Lawyer = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  specialization: string;
  bio?: string;
  experience?: number | null;
  location?: string;
  rating: number;
  avatarUrl?: string;
  available: boolean;
};

type HumanRequestItem = {
  id: number;
  status: string;
  createdAt: string;
  consultation: {
    id: number;
    title: string;
    description: string;
    user?: { id: number; name: string | null } | null;
  } | null;
  hasOffered: boolean;
  myOffer: {
    id: number;
    fee: number;
    currency: string;
    status: string;
  } | null;
};

type Branch = {
  id: number;
  name: string;
  city: string;
  country: string;
  email?: string;
  phone?: string;
};

type Organization = {
  id: number;
  name: string;
  type: string;
  logo?: string;
  website?: string;
  description?: string;
  email?: string;
  phone?: string;
  branches: Branch[];
  totalRequests: number;
};

type LawyersResponse = {
  items: Lawyer[];
  total: number;
  page: number;
  pageSize: number;
};

type OpenRequestsResponse = { items: HumanRequestItem[] };
type OrgsResponse = { items: Organization[]; total: number };

type TabKey = "list" | "requests" | "firms";

const orgTypeLabel: Record<string, string> = {
  LAW_FIRM: "مكتب محاماة",
  COMPANY: "شركة",
  GOVERNMENT: "جهة حكومية",
  OTHER: "أخرى",
};

export default function LawyersPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;

  const [activeTab, setActiveTab] = useState<TabKey>("list");

  // ─── قائمة المحامين ───────────────────────────────────────────
  const [q, setQ] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [location, setLocation] = useState("");
  const [available, setAvailable] = useState<"" | "true" | "false">("");
  const [data, setData] = useState<LawyersResponse>({ items: [], total: 0, page: 1, pageSize: 12 });
  const [loading, setLoading] = useState(false);

  const fetchLawyers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), pageSize: "12" });
      if (q) params.set("q", q);
      if (specialization) params.set("specialization", specialization);
      if (location) params.set("location", location);
      if (available) params.set("available", available);
      const res = await fetch(`/api/lawyers?${params.toString()}`);
      if (!res.ok) return;
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLawyers(1); }, []);

  async function quickCreate() {
    const fullName = prompt("اسم المحامي الكامل:");
    const email = prompt("البريد الإلكتروني:");
    const specializationVal = prompt("الاختصاص (مدني/جزائي/تجاري/...)") || "مدني";
    const locationVal = prompt("الموقع (المدينة):") || "بغداد";
    if (!fullName || !email) return;
    const res = await fetch("/api/admin/lawyers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, specialization: specializationVal, location: locationVal }),
    });
    if (res.ok) fetchLawyers(data.page);
    else alert("فشل إنشاء محامٍ");
  }

  async function resendInvite(email: string) {
    if (!confirm("هل تريد إعادة إرسال رابط تفعيل الحساب؟")) return;
    try {
      const res = await fetch("/api/admin/lawyers/resend-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) { alert(json?.error || "فشل إعادة إرسال الدعوة"); return; }
      alert("تمت إعادة إرسال رابط التفعيل بنجاح");
    } catch { alert("حدث خطأ غير متوقع"); }
  }

  function AdminUploadAvatar({ lawyerId, onUploaded }: { lawyerId: number; onUploaded?: () => void }) {
    const [loading, setLoading] = useState(false);
    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoading(true);
      const form = new FormData();
      form.append("file", file);
      form.append("lawyerId", String(lawyerId));
      const res = await fetch("/api/lawyers/avatar/upload", { method: "POST", body: form });
      setLoading(false);
      if (res.ok) { alert("تم رفع صورة المحامي بنجاح"); onUploaded?.(); }
      else alert("فشل رفع الصورة");
    }
    return (
      <label className="cursor-pointer text-xs px-3 py-1 rounded-lg border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 transition">
        {loading ? "جارٍ الرفع..." : "رفع صورة"}
        <input type="file" hidden accept="image/*" onChange={handleChange} />
      </label>
    );
  }

  // ─── طلبات الاستشارة للمحامين ─────────────────────────────────
  const [requests, setRequests] = useState<HumanRequestItem[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);

  const fetchOpenRequests = async () => {
    try {
      setReqLoading(true);
      setReqError(null);
      const res = await fetch("/api/lawyers/human-requests/open");
      const json: OpenRequestsResponse | { error: string } = await res.json();
      if (!res.ok) { setReqError((json as any)?.error || "فشل تحميل الطلبات."); setRequests([]); return; }
      setRequests((json as OpenRequestsResponse).items || []);
    } catch { setReqError("حدث خطأ غير متوقع."); }
    finally { setReqLoading(false); }
  };

  useEffect(() => { if (activeTab === "requests") fetchOpenRequests(); }, [activeTab]);

  async function handleOffer(requestId: number) {
    try {
      const feeStr = prompt("أدخل أجرة الاستشارة (دينار عراقي):");
      if (!feeStr) return;
      const fee = Number(feeStr);
      if (!fee || isNaN(fee) || fee <= 0) { alert("يرجى إدخال رقم صحيح أكبر من صفر."); return; }
      const note = prompt("ملاحظة للمستفيد (اختياري):") || "";
      const res = await fetch(`/api/lawyers/human-requests/${requestId}/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fee, note, currency: "IQD" }),
      });
      const json = await res.json();
      if (!res.ok) { alert(json?.error || "فشل إرسال العرض."); return; }
      alert(json?.message || "تم إرسال العرض بنجاح.");
      fetchOpenRequests();
    } catch { alert("حدث خطأ غير متوقع."); }
  }

  // ─── المكاتب المعتمدة ─────────────────────────────────────────
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [orgsError, setOrgsError] = useState<string | null>(null);
  const [orgQ, setOrgQ] = useState("");
  const [orgType, setOrgType] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const fetchOrgs = async () => {
    try {
      setOrgsLoading(true);
      setOrgsError(null);
      const params = new URLSearchParams();
      if (orgQ) params.set("q", orgQ);
      if (orgType) params.set("type", orgType);
      const res = await fetch(`/api/organizations?${params.toString()}`);
      const json: OrgsResponse | { error: string } = await res.json();
      if (!res.ok) { setOrgsError((json as any)?.error || "فشل تحميل المكاتب."); return; }
      setOrgs((json as OrgsResponse).items || []);
    } catch { setOrgsError("حدث خطأ غير متوقع."); }
    finally { setOrgsLoading(false); }
  };

  useEffect(() => { if (activeTab === "firms") fetchOrgs(); }, [activeTab]);

  async function requestFirmConsult(org: Organization) {
    const branchId = org.branches.length === 1
      ? org.branches[0].id
      : Number(prompt(`اختر رقم الفرع:\n${org.branches.map(b => `${b.id}: ${b.name} - ${b.city}`).join("\n")}`));

    const subject = prompt("موضوع الاستشارة:");
    if (!subject) return;
    const details = prompt("تفاصيل الاستشارة:");
    if (!details) return;

    const res = await fetch("/api/firm-consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId: org.id, branchId, subject, details }),
    });
    const json = await res.json();
    if (!res.ok) { alert(json?.error || "فشل إرسال الطلب."); return; }
    alert("تم إرسال طلب الاستشارة بنجاح — سيردّ عليك المكتب خلال 24 ساعة.");
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 text-right text-zinc-100" dir="rtl">

      {/* العنوان */}
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">إدارة المحامين وطلبات الاستشارة</h1>
          <p className="text-sm text-zinc-400">
            يمكنك من هنا إدارة قائمة المحامين، والاطلاع على طلبات الاستشارة البشرية وتقديم عروضك كمحامٍ.
          </p>
        </div>
        {role === "ADMIN" && (
          <button onClick={quickCreate} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
            + إضافة محامٍ
          </button>
        )}
      </header>

      {/* التبويبات */}
      <div className="flex gap-2 justify-end flex-wrap">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-xl border text-sm transition-colors ${activeTab === "list" ? "bg-emerald-600 text-white border-emerald-500" : "bg-zinc-900/60 text-zinc-200 border-zinc-700 hover:bg-zinc-800"}`}
        >
          📚 قائمة المحامين
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-xl border text-sm transition-colors ${activeTab === "requests" ? "bg-blue-600 text-white border-blue-500" : "bg-zinc-900/60 text-zinc-200 border-zinc-700 hover:bg-zinc-800"}`}
        >
          👨‍⚖️ طلبات الاستشارة للمحامين
        </button>
        <button
          onClick={() => setActiveTab("firms")}
          className={`px-4 py-2 rounded-xl border text-sm transition-colors ${activeTab === "firms" ? "bg-amber-600 text-white border-amber-500" : "bg-zinc-900/60 text-zinc-200 border-zinc-700 hover:bg-zinc-800"}`}
        >
          🏛️ المكاتب المعتمدة
        </button>
      </div>

      {/* ── تبويب قائمة المحامين ── */}
      {activeTab === "list" && (
        <section className="space-y-4">
          <section className="flex gap-2 flex-wrap items-center justify-end">
            <input className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="بحث عام..." value={q} onChange={(e) => setQ(e.target.value)} />
            <input className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="الاختصاص" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
            <input className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="الموقع" value={location} onChange={(e) => setLocation(e.target.value)} />
            <select className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={available} onChange={(e) => setAvailable(e.target.value as "" | "true" | "false")}>
              <option value="">التوفر (الكل)</option>
              <option value="true">متاح</option>
              <option value="false">غير متاح</option>
            </select>
            <button onClick={() => fetchLawyers(1)} className="px-4 py-2 rounded-lg border border-emerald-600 text-sm text-emerald-300 hover:bg-emerald-600/10 transition-colors">تصفية</button>
          </section>

          {loading ? (
            <p className="text-sm text-zinc-400">جاري التحميل...</p>
          ) : (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((l) => (
                  <a key={l.id} href={`/lawyers/${l.id}`} className="border border-white/10 rounded-2xl p-4 hover:shadow-lg hover:border-emerald-400/60 transition bg-zinc-900/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="relative">
                        <img src={l.avatarUrl || "/default-lawyer.png"} className="w-20 h-20 rounded-full object-cover border border-white/10" alt={l.fullName} />
                        <span className={`absolute -bottom-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-zinc-900 ${l.available ? "bg-emerald-500 text-white" : "bg-zinc-600 text-white"}`}>
                          {l.available ? "✔" : "⏸"}
                        </span>
                        {role === "ADMIN" && (
                          <div className="mt-2 flex flex-col gap-1">
                            <AdminUploadAvatar lawyerId={l.id} onUploaded={() => fetchLawyers(data.page)} />
                            <button onClick={(e) => { e.preventDefault(); resendInvite(l.email); }} className="text-xs px-3 py-1 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition">
                              🔁 إعادة إرسال الدعوة
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-base font-semibold text-white"><User2 className="w-4 h-4 text-emerald-400" /><span>{l.fullName}</span></div>
                      <div className="flex items-center gap-1 text-sm text-zinc-300"><Briefcase className="w-4 h-4 text-zinc-400" /><span>{l.specialization}</span></div>
                      <div className="flex items-center gap-1 text-xs text-zinc-400"><MapPin className="w-3 h-3" /><span>{l.location || "غير محدد"}</span></div>
                      <div className="flex items-center gap-1 text-sm mt-1"><Star className="w-4 h-4 text-yellow-400" /><span className="text-zinc-200">{l.rating?.toFixed(1) ?? "0.0"}</span></div>
                      <div className={`mt-2 inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border ${l.available ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/50" : "bg-zinc-800 text-zinc-300 border-zinc-600"}`}>
                        {l.available ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{l.available ? "متاح للاستشارة" : "غير متاح"}</span>
                      </div>
                      <div className="mt-2 flex flex-col items-center gap-1 text-xs text-zinc-400">
                        <div className="flex items-center gap-1"><Mail className="w-3 h-3" /><span>{l.email}</span></div>
                        {l.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /><span>{l.phone}</span></div>}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {data.total === 0 && <p className="text-zinc-400 text-sm">لا توجد نتائج.</p>}
            </>
          )}
        </section>
      )}

      {/* ── تبويب طلبات الاستشارة للمحامين ── */}
      {activeTab === "requests" && (
        <section className="space-y-4">
          {reqLoading && <p className="text-sm text-zinc-400">جارٍ تحميل طلبات الاستشارة...</p>}
          {reqError && <p className="text-sm text-red-400 border border-red-500/40 bg-red-950/40 rounded-lg p-2">{reqError}</p>}
          {!reqLoading && !reqError && requests.length === 0 && <p className="text-zinc-400 text-sm">لا توجد طلبات استشارة مفتوحة حاليًا.</p>}
          {requests.length > 0 && (
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="border border-white/10 rounded-2xl p-4 bg-zinc-900/70 shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="text-xs text-zinc-400">رقم الطلب: {r.id}</div>
                      <h3 className="font-semibold text-zinc-50">{r.consultation?.title || "استشارة بدون عنوان"}</h3>
                      <p className="text-sm text-zinc-200 whitespace-pre-line">{r.consultation?.description}</p>
                      <div className="text-xs text-zinc-400 mt-1">طالب الاستشارة: {r.consultation?.user?.name || "مستخدم مسجل"}</div>
                      <div className="text-xs text-zinc-500">تاريخ الطلب: {new Date(r.createdAt).toLocaleString("ar-IQ")}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[180px]">
                      <span className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-600">الحالة: {r.status}</span>
                      {r.hasOffered && r.myOffer && (
                        <div className="text-xs text-emerald-200 bg-emerald-950/40 border border-emerald-500/40 rounded-lg px-2 py-2 text-right w-full">
                          <div>قدمت عرضًا سابقًا:</div>
                          <div>الأجرة: {r.myOffer.fee} {r.myOffer.currency}</div>
                          <div>حالة العرض: {r.myOffer.status}</div>
                        </div>
                      )}
                      <button onClick={() => handleOffer(r.id)} className="px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-500 transition w-full">
                        {r.hasOffered ? "تعديل العرض" : "تقديم عرض للاستشارة"}
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

          {/* صفحة تفاصيل المكتب */}
          {selectedOrg ? (
            <div className="space-y-4">
              <button onClick={() => setSelectedOrg(null)} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition">
                <ChevronLeft className="w-4 h-4" /> العودة للقائمة
              </button>

              {/* هيدر المكتب */}
              <div className="border border-amber-500/30 rounded-2xl p-6 bg-zinc-900/80 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl font-serif">
                    {selectedOrg.name.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{selectedOrg.name}</h2>
                      <span className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">✓ معتمد</span>
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

                {/* الفروع */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2">الفروع الإقليمية</h3>
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                    {selectedOrg.branches.map((b) => (
                      <div key={b.id} className="border border-zinc-700 rounded-xl p-3 bg-zinc-800/50 text-xs space-y-1">
                        <div className="font-semibold text-zinc-100">{b.name}</div>
                        <div className="flex items-center gap-1 text-zinc-400"><MapPin className="w-3 h-3" />{b.city}، {b.country}</div>
                        {b.email && <div className="flex items-center gap-1 text-zinc-400"><Mail className="w-3 h-3" />{b.email}</div>}
                        {b.phone && <div className="flex items-center gap-1 text-zinc-400"><Phone className="w-3 h-3" />{b.phone}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* زر طلب الاستشارة */}
                <button
                  onClick={() => requestFirmConsult(selectedOrg)}
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition"
                >
                  طلب استشارة من {selectedOrg.name}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* فلاتر البحث */}
              <div className="flex gap-2 flex-wrap items-center justify-end">
                <input
                  className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="بحث عن مكتب..."
                  value={orgQ}
                  onChange={(e) => setOrgQ(e.target.value)}
                />
                <select
                  className="border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                >
                  <option value="">الكل</option>
                  <option value="LAW_FIRM">مكتب محاماة</option>
                  <option value="COMPANY">شركة</option>
                  <option value="GOVERNMENT">جهة حكومية</option>
                </select>
                <button onClick={fetchOrgs} className="px-4 py-2 rounded-lg border border-amber-600 text-sm text-amber-300 hover:bg-amber-600/10 transition-colors">تصفية</button>
              </div>

              {orgsLoading && <p className="text-sm text-zinc-400">جارٍ تحميل المكاتب...</p>}
              {orgsError && <p className="text-sm text-red-400 border border-red-500/40 bg-red-950/40 rounded-lg p-2">{orgsError}</p>}
              {!orgsLoading && !orgsError && orgs.length === 0 && <p className="text-zinc-400 text-sm">لا توجد مكاتب معتمدة حالياً.</p>}

              {/* بطاقات المكاتب */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {orgs.map((org) => (
                  <div
                    key={org.id}
                    onClick={() => setSelectedOrg(org)}
                    className="border border-amber-500/30 rounded-2xl overflow-hidden bg-zinc-900/80 hover:border-amber-400/60 transition cursor-pointer"
                  >
                    {/* شريط علوي */}
                    <div className="bg-amber-900/40 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                        ✓ مكتب معتمد
                      </span>
                      <span className="text-xs text-amber-400/70">{orgTypeLabel[org.type] || org.type}</span>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* الشعار والاسم */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm font-serif flex-shrink-0">
                          {org.name.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{org.name}</div>
                          <div className="text-xs text-zinc-400">{org.branches.length} {org.branches.length === 1 ? "فرع" : "فروع"}</div>
                        </div>
                      </div>

                      {org.description && <p className="text-xs text-zinc-400 line-clamp-2">{org.description}</p>}

                      {/* الفروع */}
                      <div className="flex flex-wrap gap-1">
                        {org.branches.map((b) => (
                          <span key={b.id} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                            {b.city}
                          </span>
                        ))}
                      </div>

                      {/* الإحصاءات */}
                      <div className="grid grid-cols-2 gap-2 border-t border-zinc-700/50 pt-3">
                        <div className="text-center">
                          <div className="text-sm font-bold text-amber-400">{org.branches.length}</div>
                          <div className="text-[10px] text-zinc-500">فروع</div>
                        </div>
                        <div className="text-center border-r border-zinc-700/50">
                          <div className="text-sm font-bold text-amber-400">{org.totalRequests}</div>
                          <div className="text-[10px] text-zinc-500">استشارة منجزة</div>
                        </div>
                      </div>

                      <button className="w-full py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-bold transition">
                        عرض الصفحة الكاملة ←
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

    </main>
  );
}

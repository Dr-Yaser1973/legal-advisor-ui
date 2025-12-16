 "use client";

import { useEffect, useState } from "react";

type TabKey = "ai" | "human" | "history";

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
    chatRoom?: { id: number } | null; // ✅ أضف هذا
}

interface AiHistoryApiResponse {
  items: AiConsultHistoryItem[];
}

interface HumanHistoryApiResponse {
  items: HumanRequestItem[];
}

function statusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "بانتظار عروض المحامين";
    case "ACCEPTED":
      return "تم اختيار محامٍ";
    case "IN_PROGRESS":
      return "الاستشارة قيد التنفيذ";
    case "COMPLETED":
      return "الاستشارة منجزة";
    case "CANCELED":
      return "الاستشارة ملغاة";
    default:
      return status;
  }
}

function statusColorClasses(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    case "ACCEPTED":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "IN_PROGRESS":
      return "bg-blue-500/10 text-blue-300 border-blue-500/40";
    case "COMPLETED":
      return "bg-zinc-500/10 text-zinc-200 border-zinc-500/40";
    case "CANCELED":
      return "bg-red-500/10 text-red-300 border-red-500/40";
    default:
      return "bg-zinc-700/40 text-zinc-200 border-zinc-600";
  }
}

interface AcceptOfferButtonProps {
  requestId: number;
  offerId: number;
  disabled?: boolean;
  onAccepted?: () => void;
}

function AcceptOfferButton({
  requestId,
  offerId,
  disabled,
  onAccepted,
}: AcceptOfferButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/consultations/human/${requestId}/offers/${offerId}/accept`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "حدث خطأ أثناء اختيار المحامي.");
        setLoading(false);
        return;
      }

      const roomId = data?.room?.id;
      if (!roomId) {
        alert("تم اختيار المحامي ولكن لم يتم العثور على غرفة المحادثة.");
        setLoading(false);
        return;
      }

      if (onAccepted) onAccepted();

      // فتح غرفة الشات
      window.location.href = `/chat/${roomId}`;
    } catch (error) {
      console.error("Error accepting offer:", error);
      alert("حدث خطأ غير متوقع أثناء اختيار المحامي.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className="px-3 py-1.5 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "جاري الاختيار..." : "اختيار هذا المحامي"}
    </button>
  );
}

export default function ConsultationsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("ai");

  // حالة استشارة الذكاء الاصطناعي
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // حالة طلب استشارة من محامٍ بشري
  const [humanTopic, setHumanTopic] = useState("");
  const [humanDetails, setHumanDetails] = useState("");
  const [humanLoading, setHumanLoading] = useState(false);
  const [humanError, setHumanError] = useState<string | null>(null);
  const [humanSuccess, setHumanSuccess] = useState<string | null>(null);

  // تاريخ الاستشارات
  const [historyLoading, setHistoryLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<AiConsultHistoryItem[]>([]);
  const [humanRequests, setHumanRequests] = useState<HumanRequestItem[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // تحميل التاريخ عند فتح تبويب "السجل"
  useEffect(() => {
    if (activeTab !== "history") return;

    async function loadHistory() {
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const [aiRes, humanRes] = await Promise.all([
          fetch("/api/consultations/ai/my"),
          fetch("/api/consultations/human/my"),
        ]);

        if (aiRes.ok) {
          const aiData: AiHistoryApiResponse = await aiRes.json();
          setAiHistory(aiData.items || []);
        } else {
          const errBody = await aiRes.json().catch(() => null);
          console.error("AI history error:", errBody);
        }

        if (humanRes.ok) {
          const humanData: HumanHistoryApiResponse = await humanRes.json();
          setHumanRequests(humanData.items || []);
        } else {
          const errBody = await humanRes.json().catch(() => null);
          console.error("Human history error:", errBody);
        }
      } catch (error) {
        console.error("Error loading history:", error);
        setHistoryError("حدث خطأ أثناء تحميل سجل الاستشارات.");
      } finally {
        setHistoryLoading(false);
      }
    }

    loadHistory();
  }, [activeTab]);

  // استشارة بالذكاء الاصطناعي
  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAiLoading(true);
    setAiError(null);
    setAiAnswer(null);

    try {
      const title =
        aiQuestion.trim().slice(0, 80) || "استشارة قانونية مختصرة";

      const res = await fetch("/api/consultations/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: aiQuestion,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || "فشل طلب الاستشارة بالذكاء.");
      }

      const data = await res.json();
      setAiAnswer(data.answer || "تم استلام الاستشارة بنجاح.");
    } catch (error: any) {
      setAiError(
        error?.message || "حدث خطأ غير متوقع أثناء إرسال الاستشارة."
      );
    } finally {
      setAiLoading(false);
    }
  }

  // إرسال طلب استشارة لمحامٍ بشري
  async function handleHumanSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHumanLoading(true);
    setHumanError(null);
    setHumanSuccess(null);

    try {
      const res = await fetch("/api/consultations/human-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: humanTopic,
          details: humanDetails,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(
          errBody?.error || "فشل إرسال طلب الاستشارة للمحامي."
        );
      }

      setHumanSuccess(
        "تم إرسال طلب الاستشارة بنجاح. سيتم عرض عروض المحامين في سجل الاستشارات."
      );
      setHumanTopic("");
      setHumanDetails("");
    } catch (error: any) {
      setHumanError(
        error?.message ||
          "حدث خطأ غير متوقع أثناء إرسال طلب الاستشارة للمحامي."
      );
    } finally {
      setHumanLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6 text-right">
          <h1 className="text-2xl font-bold mb-1">صفحة الاستشارات القانونية</h1>
          <p className="text-sm text-zinc-400">
            يمكنك هنا طلب استشارة فورية بالذكاء الاصطناعي، أو إرسال طلب استشارة
            إلى محامٍ بشري، ومتابعة سجل الاستشارات السابقة.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-end mb-4">
          <button
            onClick={() => setActiveTab("ai")}
            className={`rounded-xl px-4 py-2 text-sm border transition ${
              activeTab === "ai"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-200"
                : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            🤖 استشارة فورية بالذكاء الاصطناعي
          </button>
          <button
            onClick={() => setActiveTab("human")}
            className={`rounded-xl px-4 py-2 text-sm border transition ${
              activeTab === "human"
                ? "border-sky-500 bg-sky-500/10 text-sky-200"
                : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            👨‍⚖️ طلب استشارة من محامٍ بشري
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`rounded-xl px-4 py-2 text-sm border transition ${
              activeTab === "history"
                ? "border-zinc-300 bg-zinc-800 text-zinc-100"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            📜 سجل الاستشارات
          </button>
        </div>

        {/* تبويب الذكاء الاصطناعي */}
        {activeTab === "ai" && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2 text-right">
              🤖 استشارة قانونية بالذكاء الاصطناعي
            </h2>
            <form onSubmit={handleAiSubmit} className="space-y-3">
              <div className="text-right">
                <label className="block text-sm mb-1 text-zinc-300">
                  نص الاستشارة
                </label>
                <textarea
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  rows={6}
                  placeholder="اكتب سؤالك أو وصف حالتك القانونية بالتفصيل..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                />
              </div>
              {aiError && (
                <div className="text-sm text-red-400 text-right">
                  {aiError}
                </div>
              )}
              <button
                type="submit"
                disabled={aiLoading}
                className="ml-auto block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {aiLoading ? "جاري إرسال الاستشارة..." : "إرسال الاستشارة"}
              </button>
            </form>
            {aiAnswer && (
              <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm text-right">
                <div className="font-semibold mb-1 text-emerald-200">
                  جواب الذكاء الاصطناعي:
                </div>
                <p className="text-emerald-50 whitespace-pre-line">
                  {aiAnswer}
                </p>
              </div>
            )}
          </section>
        )}

        {/* تبويب طلب استشارة من محامٍ بشري */}
        {activeTab === "human" && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2 text-right">
              👨‍⚖️ طلب استشارة من محامٍ بشري
            </h2>
            <form onSubmit={handleHumanSubmit} className="space-y-3">
              <div className="text-right">
                <label className="block text-sm mb-1 text-zinc-300">
                  موضوع الاستشارة
                </label>
                <input
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="مثال: نزاع حول عقد إيجار، مطالبة مالية..."
                  value={humanTopic}
                  onChange={(e) => setHumanTopic(e.target.value)}
                />
              </div>
              <div className="text-right">
                <label className="block text-sm mb-1 text-zinc-300">
                  تفاصيل الاستشارة
                </label>
                <textarea
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                  rows={6}
                  placeholder="اكتب وقائع الحالة القانونية، التواريخ، الأطراف، وأي مستندات مهمة (يمكنك ذكرها هنا الآن)..."
                  value={humanDetails}
                  onChange={(e) => setHumanDetails(e.target.value)}
                />
              </div>

              {humanError && (
                <div className="text-sm text-red-400 text-right">
                  {humanError}
                </div>
              )}
              {humanSuccess && (
                <div className="text-sm text-emerald-400 text-right">
                  {humanSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={humanLoading}
                className="ml-auto block rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {humanLoading ? "جاري إرسال الطلب..." : "إرسال طلب الاستشارة"}
              </button>
            </form>
          </section>
        )}

        {/* تبويب سجل الاستشارات */}
        {activeTab === "history" && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2 text-right">
              📜 سجل الاستشارات السابقة
            </h2>

            {historyLoading && (
              <div className="text-center text-zinc-400 py-4">
                جاري تحميل سجل الاستشارات...
              </div>
            )}

            {historyError && (
              <div className="text-sm text-red-400 text-right">
                {historyError}
              </div>
            )}

            {!historyLoading && !historyError && (
              <div className="space-y-6">
                {/* استشارات الذكاء الاصطناعي */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-emerald-300 text-right">
                    🤖 استشارات الذكاء الاصطناعي
                  </h3>
                  {aiHistory.length === 0 ? (
                    <div className="text-sm text-zinc-500 text-right">
                      لا توجد استشارات سابقة بالذكاء الاصطناعي.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {aiHistory.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-right"
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-zinc-300">
                              {c.title?.slice(0, 80) ||
                                "استشارة قانونية بالذكاء الاصطناعي"}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {new Date(c.createdAt).toLocaleString("ar-IQ")}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400">
                            {c.description?.slice(0, 120)}
                            {c.description && c.description.length > 120
                              ? "..."
                              : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* طلبات الاستشارة من المحامين */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-sky-300 text-right">
                    👨‍⚖️ طلبات الاستشارة من المحامين البشريين
                  </h3>

                  {humanRequests.length === 0 ? (
                    <div className="text-sm text-zinc-500 text-right">
                      لا توجد طلبات استشارة بشرية حتى الآن.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {humanRequests.map((req) => {
                        const chatRoomId = req.chatRoom?.id;

                        const created = new Date(req.createdAt);
                        const hasAcceptedOffer = req.offers.some(
                          (o) => o.status === "ACCEPTED_BY_CLIENT"
                        );
                        const canOpenChat =
  !!chatRoomId &&
  ["ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(req.status);


                        return (
                          <div
                            key={req.id}
                            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 text-sm"
                          >
                            <div className="flex flex-col gap-1 mb-2 text-right">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-500">
                                  رقم الطلب #{req.id}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-0.5 text-[11px] font-medium ${statusColorClasses(
                                    req.status
                                  )}`}
                                >
                                  <span className="inline-block w-2 h-2 rounded-full bg-current/70" />
                                  {statusLabel(req.status)}
                                </span>
                              </div>
                              {canOpenChat && (
  <div className="mt-2 flex justify-end">
    <button
       onClick={() => (window.location.href = `/chat/${chatRoomId}`)}

      className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 border border-white/10"
    >
      فتح المحادثة
    </button>
  </div>
)}

                              <div className="text-xs text-zinc-500">
                                {created.toLocaleString("ar-IQ")}
                              </div>
                            </div>

                            {req.consultation && (
                              <div className="mb-3 text-right">
                                <div className="font-semibold mb-1">
                                  {req.consultation.title}
                                </div>
                                <div className="text-xs text-zinc-400 whitespace-pre-line">
                                  {req.consultation.description}
                                </div>
                              </div>
                            )}

                            <div className="mt-2 space-y-2">
                              <div className="font-semibold text-right text-zinc-200">
                                عروض المحامين:
                              </div>

                              {req.offers.length === 0 ? (
                                <div className="text-xs text-zinc-500 text-right">
                                  لم يقم أي محامٍ بتقديم عرض بعد. يرجى
                                  الانتظار حتى يوافق أحد المحامين.
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {req.offers.map((offer) => {
                                    const offerDate = new Date(
                                      offer.createdAt
                                    );
                                    const lawyer = offer.lawyer;

                                    return (
                                      <div
                                        key={offer.id}
                                        className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-3"
                                      >
                                        <div className="flex-1 text-right space-y-1">
                                          <div className="font-medium">
                                            {lawyer?.name ||
                                              "محامٍ (الاسم غير متوفر)"}
                                          </div>
                                          <div className="text-[11px] text-zinc-400">
                                            {lawyer?.lawyerProfile
                                              ?.specialties && (
                                              <span>
                                                الاختصاص:{" "}
                                                {
                                                  lawyer.lawyerProfile
                                                    .specialties
                                                }{" "}
                                              </span>
                                            )}
                                            {lawyer?.lawyerProfile?.city && (
                                              <span>
                                                – المدينة:{" "}
                                                {lawyer.lawyerProfile.city}
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-xs text-zinc-400">
                                            الأجر المقترح:{" "}
                                            <span className="font-semibold text-zinc-50">
                                              {offer.fee ?? "غير محدد"}{" "}
                                              {offer.currency || "IQD"}
                                            </span>
                                          </div>
                                          {offer.note && (
                                            <div className="text-xs text-zinc-500">
                                              ملاحظة المحامي: {offer.note}
                                            </div>
                                          )}
                                          <div className="text-[11px] text-zinc-500">
                                            تاريخ العرض:{" "}
                                            {offerDate.toLocaleString("ar-IQ")}
                                          </div>
                                          {offer.status ===
                                            "ACCEPTED_BY_CLIENT" && (
                                            <div className="text-[11px] text-emerald-400">
                                              تم اختيار هذا المحامي لهذا الطلب.
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex flex-col items-center gap-1">
                                          {offer.status ===
                                          "ACCEPTED_BY_CLIENT" ? (
                                            <span className="text-xs text-emerald-400">
                                              تم الاختيار
                                            </span>
                                          ) : req.status === "COMPLETED" ||
                                            req.status === "CANCELED" ? (
                                            <span className="text-xs text-zinc-500">
                                              لا يمكن اختيار محامٍ لطلب منهي أو
                                              ملغى.
                                            </span>
                                          ) : (
                                            <AcceptOfferButton
                                              requestId={req.id}
                                              offerId={offer.id}
                                              disabled={hasAcceptedOffer}
                                              onAccepted={() => {
                                                // إعادة تحميل السجل بعد الاختيار
                                                setActiveTab("history");
                                              }}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
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

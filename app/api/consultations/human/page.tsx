 // app/(site)/consultations/human/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type LawyerProfile = {
  specialties?: string | null;
  phone?: string | null;
  city?: string | null;
  rating?: number | null;
};

type Lawyer = {
  id: number;
  name: string | null;
  email: string | null;
  role: string;
  lawyerProfile?: LawyerProfile | null;
};

type Offer = {
  id: number;
  fee: number | null;
  currency: string | null;
  note?: string | null;
  status: string;
  createdAt: string;
  lawyer: Lawyer | null;
};

type Consultation = {
  id: number;
  title: string;
  description: string;
};

type HumanConsultRequestItem = {
  id: number;
  status: string;
  createdAt: string;
  chatRoomId?: number | null;
  consultation: Consultation | null;
  offers: Offer[];
};

type ApiResponse = {
  items: HumanConsultRequestItem[];
};

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

// نجوم التقييم
function RatingStars({ rating }: { rating?: number | null }) {
  if (rating == null) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-amber-400">
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3.5 h-3.5"
        aria-hidden="true"
      >
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}

interface ConfirmState {
  requestId: number;
  offerId: number;
  lawyerName: string;
}

export default function MyHumanConsultationsPage() {
  const [items, setItems] = useState<HumanConsultRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [accepting, setAccepting] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const res = await fetch("/api/consultations/human/my", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "تعذر جلب بيانات الاستشارات.");
        setItems([]);
        return;
      }

      const data: ApiResponse = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Error fetching my human consultations:", err);
      setError("حدث خطأ غير متوقع أثناء جلب البيانات.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // تحديث تلقائي خفيف كل 20 ثانية — فقط إن وُجد طلب معلّق ينتظر عروضاً
  useEffect(() => {
    const hasPending = items.some((r) => r.status === "PENDING");
    if (!hasPending) return;
    const t = setInterval(() => fetchData(true), 20000);
    return () => clearInterval(t);
  }, [items, fetchData]);

  // تنفيذ القبول بعد التأكيد
  const doAccept = async () => {
    if (!confirm || accepting) return;
    setAccepting(true);
    setActionError(null);

    try {
      const res = await fetch(
        `/api/consultations/human/${confirm.requestId}/offers/${confirm.offerId}/accept`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || "حدث خطأ أثناء اختيار المحامي.");
        setAccepting(false);
        setConfirm(null);
        return;
      }

      const roomId = data?.room?.id;
      if (!roomId) {
        setActionError(
          "تم اختيار المحامي لكن تعذّر العثور على غرفة المحادثة."
        );
        setAccepting(false);
        setConfirm(null);
        return;
      }

      router.push(`/chat/${roomId}`);
    } catch (err) {
      console.error("Error accepting offer:", err);
      setActionError("حدث خطأ غير متوقع أثناء اختيار المحامي.");
      setAccepting(false);
      setConfirm(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-right">
            استشاراتي مع المحامين المعتمدين
          </h1>
          <p className="text-sm text-zinc-400 text-right">
            في هذه الصفحة يمكنك متابعة طلبات الاستشارة القانونية التي
            أرسلتها، والاطلاع على عروض المحامين، واختيار المحامي المناسب
            للتواصل عبر المحادثة.
          </p>
        </div>

        {/* خطأ تحميل عام */}
        {error && !loading && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-right">
            {error}
          </div>
        )}

        {/* خطأ إجراء (قبول عرض) — بدل alert */}
        {actionError && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-right">
            <span>{actionError}</span>
            <button
              onClick={() => setActionError(null)}
              className="text-red-300 hover:text-red-100 text-xs"
            >
              إغلاق
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center text-zinc-400 py-8">
            جاري تحميل الاستشارات...
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-8 text-center">
            <p className="text-sm text-zinc-400 mb-3">
              لا توجد لديك طلبات استشارة مع محامٍ معتمد حتى الآن.
            </p>
            <button
              onClick={() => router.push("/consultations")}
              className="px-4 py-2 rounded-lg text-sm bg-[#c9a84c] text-black font-semibold hover:opacity-90"
            >
              إرسال استشارة جديدة
            </button>
          </div>
        )}

        <div className="space-y-4 mt-4">
          {items.map((req) => {
            const created = new Date(req.createdAt);
            const hasAcceptedOffer = req.offers.some(
              (o) => o.status === "ACCEPTED_BY_CLIENT"
            );
            const isFinished =
              req.status === "COMPLETED" || req.status === "CANCELED";
            const canChat =
              (req.status === "ACCEPTED" || req.status === "IN_PROGRESS") &&
              req.chatRoomId;

            // ترتيب العروض بالأقل سعراً (null في النهاية)
            const sortedOffers = [...req.offers].sort((a, b) => {
              const fa = a.fee ?? Number.POSITIVE_INFINITY;
              const fb = b.fee ?? Number.POSITIVE_INFINITY;
              return fa - fb;
            });

            return (
              <div
                key={req.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-500">
                      رقم الطلب #{req.id}
                      {req.offers.length > 0 && (
                        <span className="mr-1">
                          {" · "}
                          {req.offers.length} عرض
                        </span>
                      )}
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusColorClasses(
                        req.status
                      )}`}
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-current/70" />
                      {statusLabel(req.status)}
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500 text-left">
                    {created.toLocaleString("ar-IQ")}
                  </div>
                </div>

                {req.consultation && (
                  <div className="mb-3 text-right">
                    <div className="font-semibold mb-1">
                      {req.consultation.title}
                    </div>
                    <div className="text-sm text-zinc-400 whitespace-pre-line">
                      {req.consultation.description}
                    </div>
                  </div>
                )}

                {/* زر فتح المحادثة للطلبات المقبولة */}
                {canChat && (
                  <div className="mb-3">
                    <button
                      onClick={() => router.push(`/chat/${req.chatRoomId}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                        aria-hidden="true"
                      >
                        <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 4V4z" />
                      </svg>
                      فتح المحادثة
                    </button>
                  </div>
                )}

                <div className="mt-4">
                  <div className="font-semibold mb-2 text-right flex items-center gap-2">
                    عروض المحامين:
                    {req.offers.length > 0 && (
                      <span className="text-xs font-normal text-zinc-500">
                        (مرتّبة بالأقل سعراً)
                      </span>
                    )}
                  </div>

                  {req.offers.length === 0 && (
                    <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/30 px-4 py-6 text-center text-sm text-zinc-500">
                      لم يقدّم أي محامٍ عرضاً بعد. ستصلك رسالة فور وصول
                      أول عرض على هذه الاستشارة.
                    </div>
                  )}

                  <div className="space-y-2">
                    {sortedOffers.map((offer) => {
                      const offerDate = new Date(offer.createdAt);
                      const lawyer = offer.lawyer;
                      const isAccepted =
                        offer.status === "ACCEPTED_BY_CLIENT";

                      return (
                        <div
                          key={offer.id}
                          className={`flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg border px-3 py-3 ${
                            isAccepted
                              ? "border-emerald-500/40 bg-emerald-500/5"
                              : "border-zinc-800 bg-zinc-950/40"
                          }`}
                        >
                          <div className="flex-1 text-right space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {lawyer?.name || "محامٍ (الاسم غير متوفر)"}
                              </span>
                              <RatingStars
                                rating={lawyer?.lawyerProfile?.rating}
                              />
                            </div>
                            <div className="text-xs text-zinc-400">
                              {lawyer?.lawyerProfile?.specialties && (
                                <span>
                                  الاختصاص:{" "}
                                  {lawyer.lawyerProfile.specialties}{" "}
                                </span>
                              )}
                              {lawyer?.lawyerProfile?.city && (
                                <span>
                                  – المدينة: {lawyer.lawyerProfile.city}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-400">
                              الأجر المقترح:{" "}
                              <span className="font-semibold text-zinc-200">
                                {offer.fee != null
                                  ? offer.fee.toLocaleString("ar-IQ")
                                  : "غير محدد"}{" "}
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
                            {isAccepted && (
                              <div className="text-[11px] text-emerald-400">
                                تم اختيار هذا المحامي لهذا الطلب.
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            {isAccepted ? (
                              <span className="text-xs text-emerald-400">
                                تم الاختيار
                              </span>
                            ) : isFinished ? (
                              <span className="text-xs text-zinc-500">
                                لا يمكن اختيار محامٍ لطلب منهٍ أو ملغى.
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  setConfirm({
                                    requestId: req.id,
                                    offerId: offer.id,
                                    lawyerName:
                                      lawyer?.name || "هذا المحامي",
                                  })
                                }
                                disabled={hasAcceptedOffer}
                                className="px-3 py-1.5 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                اختيار هذا المحامي
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* نافذة التأكيد */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => !accepting && setConfirm(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 text-center"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="text-amber-400 text-3xl mb-2">⚠</div>
            <div className="font-semibold text-lg mb-1">
              تأكيد اختيار المحامي
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-5">
              عند اختيار{" "}
              <span className="font-semibold text-zinc-200">
                {confirm.lawyerName}
              </span>{" "}
              سيُرفض باقي العروض تلقائياً وتُفتح غرفة محادثة. لا يمكن
              التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                disabled={accepting}
                className="flex-1 px-4 py-2 rounded-lg text-sm border border-zinc-600 text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
              >
                إلغاء
              </button>
              <button
                onClick={doAccept}
                disabled={accepting}
                className="flex-1 px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {accepting ? "جارٍ الاختيار..." : "تأكيد الاختيار"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
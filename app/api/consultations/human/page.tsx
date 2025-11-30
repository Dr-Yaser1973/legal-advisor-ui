// app/(site)/consultations/human/page.tsx
"use client";

import { useEffect, useState } from "react";
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
  const router = useRouter();

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/consultations/human/${requestId}/offers/${offerId}/accept`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "حدث خطأ أثناء اختيار المحامي.");
        setLoading(false);
        return;
      }

      const roomId = data?.room?.id;
      if (!roomId) {
        alert("تم اختيار المحامي لكن لم يتم العثور على غرفة المحادثة.");
        setLoading(false);
        return;
      }

      // تحديث القائمة في الخلفية (اختياري)
      if (onAccepted) onAccepted();

      // الانتقال إلى صفحة الشات
      router.push(`/chat/${roomId}`);
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

export default function MyHumanConsultationsPage() {
  const [items, setItems] = useState<HumanConsultRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/consultations/human/my", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "تعذر جلب بيانات الاستشارات.");
        setItems([]);
        setLoading(false);
        return;
      }

      const data: ApiResponse = await res.json();
      setItems(data.items || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching my human consultations:", err);
      setError("حدث خطأ غير متوقع أثناء جلب البيانات.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-right">
            استشاراتي مع المحامين البشريين
          </h1>
          <p className="text-sm text-zinc-400 text-right">
            في هذه الصفحة يمكنك متابعة طلبات الاستشارة القانونية التي
            أرسلتها، والاطلاع على عروض المحامين، واختيار المحامي المناسب
            للتواصل عبر المحادثة.
          </p>
        </div>

        {loading && (
          <div className="text-center text-zinc-400 py-8">
            جاري تحميل الاستشارات...
          </div>
        )}

        {error && !loading && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-right">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-6 text-sm text-zinc-400 text-right">
            لا توجد لديك طلبات استشارة بشرية حتى الآن.
          </div>
        )}

        <div className="space-y-4 mt-4">
          {items.map((req) => {
            const created = new Date(req.createdAt);
            const hasAcceptedOffer = req.offers.some(
              (o) => o.status === "ACCEPTED_BY_CLIENT"
            );

            return (
              <div
                key={req.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-500">
                      رقم الطلب #{req.id}
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

                <div className="mt-4">
                  <div className="font-semibold mb-2 text-right">
                    عروض المحامين:
                  </div>

                  {req.offers.length === 0 && (
                    <div className="text-sm text-zinc-500 text-right">
                      لم يقم أي محامٍ بتقديم عرض حتى الآن. يرجى الانتظار
                      لحين استجابة أحد المحامين.
                    </div>
                  )}

                  <div className="space-y-2">
                    {req.offers.map((offer) => {
                      const offerDate = new Date(offer.createdAt);
                      const lawyer = offer.lawyer;

                      return (
                        <div
                          key={offer.id}
                          className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-3"
                        >
                          <div className="flex-1 text-right space-y-1">
                            <div className="font-medium">
                              {lawyer?.name || "محامٍ (الاسم غير متوفر)"}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {lawyer?.lawyerProfile?.specialties && (
                                <span>
                                  الاختصاص:{" "}
                                  {lawyer.lawyerProfile.specialties}{" "}
                                </span>
                              )}
                              {lawyer?.lawyerProfile?.city && (
                                <span>– المدينة: {lawyer.lawyerProfile.city}</span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-400">
                              الأجر المقترح:{" "}
                              <span className="font-semibold text-zinc-200">
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
                            {offer.status === "ACCEPTED_BY_CLIENT" && (
                              <div className="text-[11px] text-emerald-400">
                                تم اختيار هذا المحامي لهذا الطلب.
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            {offer.status === "ACCEPTED_BY_CLIENT" ? (
                              <span className="text-xs text-emerald-400">
                                تم الاختيار
                              </span>
                            ) : req.status === "COMPLETED" ||
                              req.status === "CANCELED" ? (
                              <span className="text-xs text-zinc-500">
                                لا يمكن اختيار محامٍ لطلب منهي أو ملغى.
                              </span>
                            ) : (
                              <AcceptOfferButton
                                requestId={req.id}
                                offerId={offer.id}
                                disabled={hasAcceptedOffer}
                                onAccepted={fetchData}
                              />
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
    </div>
  );
}


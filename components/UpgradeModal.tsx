"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Lock, Zap } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  message?: string;
};

const WHATSAPP_NUMBER = "9647719183785";

function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function UpgradeModal({ open, onClose, message }: Props) {
  // إغلاق عند الضغط على Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl overflow-hidden text-right">

        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-black/40 p-1.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>

        {/* الشريط العلوي */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-3 border-b border-white/10 bg-zinc-900/60">
          <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-400/50">
            <Lock className="h-4 w-4 text-amber-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-amber-300">
              هذه الميزة غير متاحة في باقتك
            </span>
            <span className="text-[11px] text-zinc-400">
              Legal Advisor Platform
            </span>
          </div>
        </div>

        {/* المحتوى */}
        <div className="px-6 py-5 space-y-4">
          {/* أيقونة */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border border-amber-400/20">
              <Zap className="h-8 w-8 text-amber-400" />
            </div>
          </div>

          {/* الرسالة */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-white">
              ترقية الباقة مطلوبة
            </h2>
            <p className="text-sm text-zinc-300 leading-7">
              {message || "هذه الخدمة غير متاحة في باقتك الحالية. يرجى الترقية للاستفادة من جميع ميزات المنصة."}
            </p>
          </div>

          {/* الباقات المقترحة */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4 space-y-2">
            <p className="text-xs font-semibold text-zinc-300 mb-3">
              الباقات المتاحة:
            </p>
            {[
              { name: "باقة الأفراد", price: "15,000", features: "استشارات + عقود" },
              { name: "باقة المحامين", price: "20,000", features: "عقود + قضايا + عروض" },
              { name: "باقة الشركات", price: "75,000", features: "وصول مفتوح كامل" },
            ].map((plan) => (
              <div
                key={plan.name}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/60 px-3 py-2"
              >
                <span className="text-[11px] text-zinc-400">{plan.features}</span>
                <div className="text-right">
                  <p className="text-xs font-semibold text-zinc-200">{plan.name}</p>
                  <p className="text-[11px] text-emerald-400">{plan.price} د.ع / شهر</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 pb-5 pt-3 border-t border-white/10 bg-zinc-900/80">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/15 px-3 py-1.5 text-[12px] text-zinc-100 hover:bg-zinc-800/80 transition"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-[12px] font-medium text-emerald-100 hover:bg-emerald-500/20 transition"
            >
              عرض الباقات
            </Link>
            <Link
              href={waLink("مرحباً، أريد الترقية إلى باقة مدفوعة في منصة المستشار القانوني.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-[12px] font-medium text-white shadow-md transition"
            >
              اشترك الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


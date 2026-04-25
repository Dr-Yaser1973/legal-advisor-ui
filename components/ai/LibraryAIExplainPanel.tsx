 "use client";

import { useState } from "react";
import { SparklesIcon, AcademicCapIcon, BuildingOfficeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

type Level = "basic" | "pro" | "business";

interface Props {
  itemId: string;
  title: string;
  isAuthenticated?: boolean;
  initialExplanations?: {
    basic?: string | null;
    pro?: string | null;
    business?: string | null;
  };
}

export default function LibraryAIExplainPanel({ 
  itemId, 
  title,
  isAuthenticated = false,
  initialExplanations 
}: Props) {
  
  const [level, setLevel] = useState<Level>("basic");
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(
    initialExplanations?.basic || null
  );
  const [error, setError] = useState<string | null>(null);
  const [articleText, setArticleText] = useState("");
  const [isCached, setIsCached] = useState(!!initialExplanations?.basic);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const levelConfig = {
    basic: { 
      label: "شرح مبسط", 
      icon: SparklesIcon, 
      color: "from-green-600 to-green-400",
      existing: initialExplanations?.basic
    },
    pro: { 
      label: "تحليل قانوني", 
      icon: AcademicCapIcon, 
      color: "from-blue-600 to-blue-400",
      existing: initialExplanations?.pro
    },
    business: { 
      label: "نظرة تجارية", 
      icon: BuildingOfficeIcon, 
      color: "from-amber-600 to-amber-400",
      existing: initialExplanations?.business
    },
  };

  async function loadExplanation(lv: Level) {
    // التحقق من تسجيل الدخول قبل أي شيء
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    if (levelConfig[lv].existing) {
      setExplanation(levelConfig[lv].existing);
      setIsCached(true);
      return;
    }

    if (!articleText.trim()) {
      setError("يرجى إدخال نص المادة للشرح");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("level", lv);
      params.set("text", articleText);

      const res = await fetch(
        `/api/library/items/${itemId}/explain?${params.toString()}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      if (!data?.ok) {
        throw new Error(data?.error || "فشل تحميل الشرح");
      }

      setExplanation(data.explanation);
      setIsCached(data.cached || false);
    } catch (e: any) {
      setError(e?.message || "حدث خطأ أثناء إنشاء الشرح");
    } finally {
      setLoading(false);
    }
  }

  const handleLevelChange = (lv: Level) => {
    // التحقق من تسجيل الدخول عند تغيير المستوى
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    setLevel(lv);
    if (levelConfig[lv].existing) {
      setExplanation(levelConfig[lv].existing);
      setIsCached(true);
      setError(null);
    } else {
      setExplanation(null);
      setIsCached(false);
      loadExplanation(lv);
    }
  };

  // ── واجهة طلب تسجيل الدخول ──────────────────────────────────────────────
  if (showAuthPrompt || !isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* الرأس */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">الشرح بالذكاء الاصطناعي</h3>
          </div>
        </div>

        {/* رسالة تسجيل الدخول */}
        <div className="p-8 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center shadow-inner">
            <LockClosedIcon className="h-8 w-8 text-purple-500" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900">
              أنت بحاجة إلى تسجيل الدخول
            </h4>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              للاستفادة من ميزة الشرح القانوني بالذكاء الاصطناعي، يرجى تسجيل الدخول إلى حسابك أولاً.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={() => {
  window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
}}
              className="flex-1 py-2.5 px-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium shadow hover:from-purple-700 hover:to-blue-700 transition-all hover:shadow-md"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => {
  window.location.href = "/auth/register";
}}
              className="flex-1 py-2.5 px-5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              إنشاء حساب
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── الواجهة الأصلية (للمستخدمين المسجّلين) ──────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* الرأس */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">الشرح بالذكاء الاصطناعي</h3>
          {isCached && explanation && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-2">
              من المخبأ
            </span>
          )}
        </div>
      </div>

      {/* المحتوى */}
      <div className="p-6 space-y-4">
        {/* حقل إدخال النص */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نص المادة القانونية
          </label>
          <textarea
            value={articleText}
            onChange={(e) => setArticleText(e.target.value)}
            placeholder="الصق نص المادة القانونية هنا..."
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            rows={4}
          />
          <p className="text-xs text-gray-400 mt-1">
            يمكنك لصق نص المادة من القانون أو من المستند
          </p>
        </div>

        {/* أزرار المستويات */}
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(levelConfig) as Level[]).map((key) => {
            const config = levelConfig[key];
            const isActive = level === key;
            const hasExisting = !!config.existing;
            return (
              <button
                key={key}
                onClick={() => handleLevelChange(key)}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? `bg-gradient-to-r ${config.color} text-white shadow-md` 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <config.icon className="h-4 w-4" />
                {config.label}
                {hasExisting && (
                  <span className="text-xs bg-white/20 rounded-full px-1.5 py-0.5">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* التحميل */}
        {loading && (
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              <p className="text-gray-600">جاري إنشاء شرح المادة...</p>
            </div>
          </div>
        )}

        {/* الخطأ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* الشرح */}
        {!loading && !error && explanation && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {explanation}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

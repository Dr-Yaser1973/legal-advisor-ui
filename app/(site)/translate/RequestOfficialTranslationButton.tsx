"use client";

type Props = {
  documentId: number | null;
  targetLang: "AR" | "EN";
  disabled?: boolean;
};

export default function RequestOfficialTranslationButton({
  documentId,
  targetLang,
  disabled,
}: Props) {
  async function handleClick() {
    if (!documentId) {
      alert("يجب أولًا رفع المستند واستخراج النص.");
      return;
    }

    // هنا يمكن لاحقًا توجيه المستخدم لصفحة اختيار المكتب
    // الآن سنرسله لصفحة اختيار المكاتب مع باراميترات
    const params = new URLSearchParams({
      doc: String(documentId),
      lang: targetLang,
    });

    window.location.href = `/translation-offices/requests?${params.toString()}`;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="inline-flex items-center rounded-xl border border-amber-500 
                 bg-amber-500 text-black px-4 py-2 text-sm font-semibold
                 hover:bg-amber-400 disabled:opacity-40"
    >
      طلب ترجمة رسمية من مكتب معتمد
    </button>
  );
}


 // components/admin/EditLibraryItemButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Props {
  item: any;
}

const MAIN_CATEGORIES = [
  { value: "LAW", label: "قوانين" },
  { value: "FIQH", label: "فقه" },
  { value: "ACADEMIC", label: "أكاديمي" },
  { value: "CONTRACT", label: "عقود" }
];

const ITEM_TYPES: Record<string, Array<{ value: string; label: string }>> = {
  LAW: [
    { value: "CONSTITUTION", label: "دستور" },
    { value: "STATUTE", label: "قانون" },
    { value: "REGULATION", label: "لائحة" },
    { value: "COURT_RULING", label: "حكم قضائي" }
  ],
  FIQH: [{ value: "RESEARCH_PAPER", label: "بحث علمي" }],
  ACADEMIC: [
    { value: "PHD_THESIS", label: "أطروحة دكتوراه" },
    { value: "MASTER_THESIS", label: "رسالة ماجستير" },
    { value: "RESEARCH_PAPER", label: "بحث علمي" }
  ],
  CONTRACT: [
    { value: "LOCAL_CONTRACT", label: "عقد محلي" },
    { value: "INTERNATIONAL_CONTRACT", label: "عقد دولي" }
  ]
};

export default function EditLibraryItemButton({ item }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(item.mainCategory || "LAW");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      mainCategory: selectedCategory,
      itemType: formData.get("itemType"),
      basicExplanation: formData.get("basicExplanation"),
      professionalExplanation: formData.get("professionalExplanation"),
      commercialExplanation: formData.get("commercialExplanation"),
      year: formData.get("year") ? parseInt(formData.get("year") as string) : null,
      author: formData.get("author"),
      jurisdiction: formData.get("jurisdiction"),
      university: formData.get("university"),
      keywords: formData.get("keywords") ? (formData.get("keywords") as string).split(",").map(k => k.trim()) : [],
    };

    try {
      const res = await fetch(`/api/library/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "تم التحديث بنجاح");
        router.refresh();
        setShowModal(false);
      } else {
        toast.error(result.error || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="تعديل سريع"
      >
        ✏️
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">تعديل: {item.titleAr}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="titleAr"
                defaultValue={item.titleAr}
                placeholder="العنوان بالعربية"
                required
                className="w-full p-2 border rounded-lg"
              />

              <input
                name="titleEn"
                defaultValue={item.titleEn || ""}
                placeholder="العنوان بالإنجليزية"
                className="w-full p-2 border rounded-lg"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">التصنيف الرئيسي</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    {MAIN_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">نوع المادة</label>
                  <select
                    name="itemType"
                    defaultValue={item.itemType || ""}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">اختر النوع</option>
                    {ITEM_TYPES[selectedCategory]?.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                name="basicExplanation"
                defaultValue={item.basicExplanation || ""}
                placeholder="شرح مبسط"
                rows={3}
                className="w-full p-2 border rounded-lg"
              />

              <textarea
                name="professionalExplanation"
                defaultValue={item.professionalExplanation || ""}
                placeholder="شرح احترافي"
                rows={3}
                className="w-full p-2 border rounded-lg"
              />

              <textarea
                name="commercialExplanation"
                defaultValue={item.commercialExplanation || ""}
                placeholder="شرح تجاري"
                rows={3}
                className="w-full p-2 border rounded-lg"
              />

              <div className="grid grid-cols-3 gap-4">
                <input
                  name="year"
                  type="number"
                  defaultValue={item.year || ""}
                  placeholder="السنة"
                  className="p-2 border rounded-lg"
                />
                <input
                  name="author"
                  defaultValue={item.author || ""}
                  placeholder="المؤلف"
                  className="p-2 border rounded-lg"
                />
                <input
                  name="jurisdiction"
                  defaultValue={item.jurisdiction || ""}
                  placeholder="الاختصاص"
                  className="p-2 border rounded-lg"
                />
              </div>

              <input
                name="university"
                defaultValue={item.university || ""}
                placeholder="الجامعة"
                className="w-full p-2 border rounded-lg"
              />

              <input
                name="keywords"
                defaultValue={item.keywords?.join(", ") || ""}
                placeholder="كلمات مفتاحية (مفصولة بفاصلة)"
                className="w-full p-2 border rounded-lg"
              />

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
// components/admin/EditLibraryItemButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  item: any;
}

export default function EditLibraryItemButton({ item }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      basicExplanation: formData.get("basicExplanation"),
      professionalExplanation: formData.get("professionalExplanation"),
      commercialExplanation: formData.get("commercialExplanation"),
      year: formData.get("year") ? parseInt(formData.get("year") as string) : null,
      author: formData.get("author"),
      jurisdiction: formData.get("jurisdiction"),
    };

    try {
      const res = await fetch(`/api/library/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error:", error);
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

              <textarea
                name="basicExplanation"
                defaultValue={item.basicExplanation || ""}
                placeholder="شرح مبسط"
                rows={4}
                className="w-full p-2 border rounded-lg"
              />

              <textarea
                name="professionalExplanation"
                defaultValue={item.professionalExplanation || ""}
                placeholder="شرح احترافي"
                rows={4}
                className="w-full p-2 border rounded-lg"
              />

              <textarea
                name="commercialExplanation"
                defaultValue={item.commercialExplanation || ""}
                placeholder="شرح تجاري"
                rows={4}
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

              <div className="flex gap-2 justify-end">
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

// app/admin/library/NewLibraryItemForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewLibraryItemForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      mainCategory: formData.get("mainCategory"),
      itemType: formData.get("itemType"),
      mainText: formData.get("mainText"),
      basicExplanation: formData.get("basicExplanation"),
      professionalExplanation: formData.get("professionalExplanation"),
      commercialExplanation: formData.get("commercialExplanation"),
      year: formData.get("year"),
      author: formData.get("author"),
      jurisdiction: formData.get("jurisdiction"),
    };

    try {
      const res = await fetch("/api/library/upload-new ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="titleAr"
        placeholder="العنوان بالعربية *"
        required
        className="w-full p-2 border rounded-lg"
      />
      <input
        name="titleEn"
        placeholder="العنوان بالإنجليزية"
        className="w-full p-2 border rounded-lg"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <select name="mainCategory" required className="p-2 border rounded-lg">
          <option value="LAW">قانون</option>
          <option value="FIQH">فقه</option>
          <option value="ACADEMIC">دراسة أكاديمية</option>
          <option value="CONTRACT">عقد</option>
        </select>

        <select name="itemType" required className="p-2 border rounded-lg">
          <option value="STATUTE">قانون</option>
          <option value="CONSTITUTION">دستور</option>
          <option value="REGULATION">لائحة</option>
          <option value="PHD_THESIS">رسالة دكتوراه</option>
          <option value="MASTER_THESIS">رسالة ماجستير</option>
          <option value="RESEARCH_PAPER">بحث</option>
          <option value="LOCAL_CONTRACT">عقد محلي</option>
          <option value="INTERNATIONAL_CONTRACT">عقد دولي</option>
        </select>
      </div>

      <textarea
        name="mainText"
        placeholder="النص الرئيسي *"
        required
        rows={5}
        className="w-full p-2 border rounded-lg"
      />

      <textarea
        name="basicExplanation"
        placeholder="شرح مبسط (اختياري)"
        rows={3}
        className="w-full p-2 border rounded-lg"
      />

      <textarea
        name="professionalExplanation"
        placeholder="شرح احترافي (اختياري)"
        rows={3}
        className="w-full p-2 border rounded-lg"
      />

      <textarea
        name="commercialExplanation"
        placeholder="شرح تجاري (اختياري)"
        rows={3}
        className="w-full p-2 border rounded-lg"
      />

      <div className="grid grid-cols-3 gap-4">
        <input
          name="year"
          type="number"
          placeholder="السنة"
          className="p-2 border rounded-lg"
        />
        <input
          name="author"
          placeholder="المؤلف"
          className="p-2 border rounded-lg"
        />
        <input
          name="jurisdiction"
          placeholder="الاختصاص"
          className="p-2 border rounded-lg"
        />
      </div>
        {/* 🔹 إضافة رفع ملف Word/PDF */}
  <input
    type="file"
    name="file"
    accept=".doc,.docx"
    className="w-full p-2 border rounded-lg"
  />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "جاري الإضافة..." : "إضافة المادة"}
      </button>
    </form>
  );
}

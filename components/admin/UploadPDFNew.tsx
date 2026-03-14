// components/admin/UploadPDFNew.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPDFNew() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/library/upload-new", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.refresh();
        (e.target as HTMLFormElement).reset();
        setFile(null);
      } else {
        const error = await res.json();
        alert(error.error || "فشل الرفع");
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
        type="file"
        name="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
        className="w-full p-2 border rounded-lg"
      />

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
          <option value="LOCAL_CONTRACT">عقد محلي</option>
        </select>
      </div>

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

      <button
        type="submit"
        disabled={loading || !file}
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "جاري الرفع..." : "رفع PDF"}
      </button>
    </form>
  );
}

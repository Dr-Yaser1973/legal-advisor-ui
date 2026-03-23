// components/admin/UploadPDFNew.tsx
 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const MAIN_CATEGORIES = [
  { value: "LAW", label: "قوانين" },
  { value: "FIQH", label: "فقه" },
  { value: "ACADEMIC", label: "أكاديمي" },
  { value: "CONTRACT", label: "عقود" }
];

export default function UploadPDFNew() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("LAW");
  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    jurisdiction: "",
    year: "",
    author: "",
    university: "",
    keywords: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titleAr) {
      toast.error("العنوان بالعربية مطلوب");
      return;
    }
    
    if (!file) {
      toast.error("يرجى رفع ملف PDF");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("يرجى رفع ملف PDF فقط");
      return;
    }

    setLoading(true);
    
    const data = new FormData();
    data.append("titleAr", formData.titleAr);
    data.append("titleEn", formData.titleEn);
    data.append("mainCategory", selectedCategory);
    data.append("itemType", "STATUTE");
    data.append("jurisdiction", formData.jurisdiction);
    if (formData.year) data.append("year", formData.year);
    if (formData.author) data.append("author", formData.author);
    if (formData.university) data.append("university", formData.university);
    if (formData.keywords) data.append("keywords", formData.keywords);
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/library/upload-new", {
        method: "POST",
        body: data,
      });
      
      const result = await res.json();
      
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
        // إعادة تعيين النموذج
        setFormData({
          titleAr: "",
          titleEn: "",
          jurisdiction: "",
          year: "",
          author: "",
          university: "",
          keywords: "",
        });
        setFile(null);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          العنوان بالعربية <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.titleAr}
          onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          العنوان بالإنجليزية
        </label>
        <input
          type="text"
          value={formData.titleEn}
          onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            التصنيف الرئيسي
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {MAIN_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            السنة
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الاختصاص
          </label>
          <input
            type="text"
            value={formData.jurisdiction}
            onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="عراقي، مصري، سعودي..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المؤلف
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          كلمات مفتاحية (مفصولة بفاصلة)
        </label>
        <input
          type="text"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="قانون, عقوبات, مدني"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ملف PDF <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        {file && (
          <p className="text-xs text-gray-500 mt-1">
            {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "جاري الرفع..." : "📄 رفع PDF"}
      </button>
    </form>
  );
}
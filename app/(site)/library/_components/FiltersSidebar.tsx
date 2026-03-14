// app/(site)/library/_components/FiltersSidebar.tsx
"use client";

interface FiltersSidebarProps {
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  showExplanations: string;
  setShowExplanations: (value: string) => void;
  hasPDF: boolean;
  setHasPDF: (value: boolean) => void;
  hasWord: boolean;
  setHasWord: (value: boolean) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  onReset: () => void;
}

export default function FiltersSidebar({
  selectedType,
  setSelectedType,
  selectedYear,
  setSelectedYear,
  showExplanations,
  setShowExplanations,
  hasPDF,
  setHasPDF,
  hasWord,
  setHasWord,
  sortBy,
  setSortBy,
  onReset
}: FiltersSidebarProps) {
  
  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018];
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900">🔍 تصفية النتائج</h3>
        <button 
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          إعادة ضبط
        </button>
      </div>

      {/* نوع المحتوى */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          نوع المحتوى
        </label>
        <div className="space-y-2">
          {[
            { value: "ALL", label: "الكل" },
            { value: "CONSTITUTION", label: "دساتير" },
            { value: "STATUTE", label: "قوانين" },
            { value: "REGULATION", label: "لوائح" },
            { value: "PHD_THESIS", label: "رسائل دكتوراه" },
            { value: "MASTER_THESIS", label: "رسائل ماجستير" },
            { value: "LOCAL_CONTRACT", label: "عقود محلية" },
            { value: "INTERNATIONAL_CONTRACT", label: "عقود دولية" },
          ].map((type) => (
            <label key={type.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value={type.value}
                checked={selectedType === type.value}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* السنة */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          السنة
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="ALL">كل السنوات</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* الشروحات */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          الشروحات
        </label>
        <div className="space-y-2">
          {[
            { value: "ALL", label: "الكل" },
            { value: "basic", label: "شرح مبسط" },
            { value: "professional", label: "شرح احترافي" },
            { value: "commercial", label: "شرح تجاري" },
          ].map((exp) => (
            <label key={exp.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="explanation"
                value={exp.value}
                checked={showExplanations === exp.value}
                onChange={(e) => setShowExplanations(e.target.value)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">{exp.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* نوع الملف */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          نوع الملف
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasPDF}
              onChange={(e) => setHasPDF(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">📄 PDF</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasWord}
              onChange={(e) => setHasWord(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">📝 Word</span>
          </label>
        </div>
      </div>
    </div>
  );
}

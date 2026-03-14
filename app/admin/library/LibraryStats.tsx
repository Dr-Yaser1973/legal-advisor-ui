// app/admin/library/LibraryStats.tsx
export default function LibraryStats({ stats }: { 
  stats: { total: number; withPDF: number; withWord: number; views: number; }
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
        <div className="text-3xl font-bold mb-1">{stats.total}</div>
        <div className="text-blue-100">إجمالي المواد</div>
      </div>
      
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6">
        <div className="text-3xl font-bold mb-1">{stats.withPDF}</div>
        <div className="text-red-100">ملفات PDF</div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
        <div className="text-3xl font-bold mb-1">{stats.withWord}</div>
        <div className="text-blue-100">نصوص قانونية</div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
        <div className="text-3xl font-bold mb-1">{stats.views.toLocaleString()}</div>
        <div className="text-purple-100">إجمالي المشاهدات</div>
      </div>
    </div>
  );
}

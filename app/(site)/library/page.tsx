 // app/(site)/library/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";


export default async function LibraryPage() {

  // جلب احصائيات الأقسام
   const [law, fiqh, academic] = await Promise.all([
    prisma.lawDoc.count({ where: { category: "LAW" } }),
    prisma.lawDoc.count({ where: { category: "FIQH" } }),
    prisma.lawDoc.count({ where: { category: "ACADEMIC_STUDY" } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-slate-800 text-white text-center p-10">
        <h1 className="text-3xl font-bold">
          المكتبة الإلكترونية العامة
        </h1>
        

        <div className="mt-4">
          <input
            placeholder="ابحث عن كتاب، مؤلف، أو بحث..."
            className="w-2/3 p-3 rounded-full text-black"
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">

        <h2 className="border-r-4 border-red-600 pr-4 text-xl font-bold text-slate-700">
          الأقسام الأكاديمية
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-6">

          <Link href="/library/list?catogary=LAW">
            <SectionCard
              title="⚖️ قسم القانون"
              desc="تشريعات وقوانين وطنية ودولية"
              count={law}
              
            />
          </Link>

          <Link href="/library/list?catogary=ACADEMIC_STUDY">
            <SectionCard
              title="🎓 دراسات أكاديمية"
              desc="رسائل ماجستير ودكتوراه"
              count={academic}
            />
          </Link>

          <Link href="/library/list?catogary=FIQH">
            <SectionCard
              title="📜 قسم الفقه"
              desc="فقه مقارن وأصول"
              count={fiqh}
            />
          </Link>

        </div>
        

         {/* قسم المصادر الخارجية بتصميم متناسق */}
        <div className="bg-white border border-gray-200 p-10 rounded-3xl mt-16 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            <span>🌐</span> مكتبة المصادر الخارجية
          </h2>
          <div className="flex flex-wrap gap-4">
            <ExternalLink name="مكتبة الكونجرس" url="/external/library-of-congress" />
            <ExternalLink name="Google Scholar" url="/external/google-scholar" />
            <ExternalLink name="المكتبة الرقمية العالمية" url="/external/wdl" />
            <ExternalLink name="دار المنظومة" url="/external/mandumah" />
          </div>
        </div>

      </div>
    </div>
  );
}


 // مكون بطاقة القسم المدمج بالتعديلات الجمالية
function SectionCard({ title, desc, count }: { title: string; desc: string; count: number }) {
  return (
    <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-500 text-center relative overflow-hidden h-full flex flex-col justify-between">
      {/* الخلفية الباهتة التي تظهر عند التحويم */}
      <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <h3 className="font-bold text-2xl mb-3 text-slate-800 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {desc}
        </p>
      </div>

      <div className="relative z-10 mt-6">
        <div className="inline-block bg-slate-100 px-4 py-1.5 rounded-full text-slate-600 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {count.toLocaleString()} مادة رقمية
        </div>
      </div>
    </div>
  );
}

 // مكون الروابط الخارجية
function ExternalLink({ name, url }: { name: string; url: string }) {
  return (
    <Link
      href={url}
      className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 font-bold transition-all duration-200 shadow-sm"
    >
      {name}
    </Link>
  );
}
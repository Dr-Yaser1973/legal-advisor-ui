"use client";
 import { useRouter } from "next/navigation";

export default function UsePanel({
  lawUnitId,
  title,
  userRole,
}: {
  lawUnitId: number;
  title: string;
  userRole: string;
}) {
  const router = useRouter();

  function go(path: string) {
    router.push(`${path}?fromLawUnit=${lawUnitId}&title=${encodeURIComponent(title)}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* استشارة قانونية */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h3 className="mb-2 text-zinc-100 font-semibold">⚖️ استشارة قانونية</h3>
        <p className="mb-3 text-sm text-zinc-400">
          احصل على رأي مهني متخصص حول تطبيق هذه المادة على حالتك الواقعية
        </p>
        <button
          onClick={() => go("/lawyers")}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
        >
          اطلب استشارة
        </button>
      </div>

      {/* العقود المرتبطة */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h3 className="mb-2 text-zinc-100 font-semibold">📄 العقود المرتبطة</h3>
        <p className="mb-3 text-sm text-zinc-400">
          أنشئ عقدًا قانونيًا احترافيًا مستندًا إلى هذه المادة مباشرة
        </p>
        <button
          onClick={() => go("/contracts")}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm hover:bg-emerald-500"
        >
          إنشاء عقد ذكي
        </button>
      </div>

      {/* امتثال الشركات */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h3 className="mb-2 text-zinc-100 font-semibold">🏢 امتثال الشركات</h3>
        <p className="mb-3 text-sm text-zinc-400">
          تعرّف على المخاطر القانونية والتوصيات العملية المرتبطة بهذه المادة
        </p>
        <button
          onClick={() => go("/company")}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
        >
          عرض تقرير الامتثال
        </button>
      </div>

      {/* ترجمة قانونية رسمية */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h3 className="mb-2 text-zinc-100 font-semibold">🌍 ترجمة قانونية رسمية</h3>
        <p className="mb-3 text-sm text-zinc-400">
          استخدم هذه المادة في معاملات دولية أو مستندات أجنبية مع ترجمة معتمدة
        </p>
        <button
          onClick={() => go("/translate")}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
        >
          إرسال لمكتب ترجمة
        </button>
      </div>
    </div>
  );
}



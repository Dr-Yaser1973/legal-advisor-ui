 // app/(site)/library/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import ReadingModeToggle from "./ReadingModeToggle";

// 🚩 في Next 16 params هي Promise
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function categoryLabel(category: string | null | undefined) {
  switch (category) {
    case "LAW":
      return "قانون عراقي";
    case "FIQH":
      return "كتاب فقهي";
    case "ACADEMIC_STUDY":
      return "دراسة أكاديمية";
    default:
      return "مواد قانونية";
  }
}

export const dynamic = "force-dynamic";

export default async function LawDocPage(props: PageProps) {
  const { id: idParam } = await props.params;
  const id = Number(idParam);

  let doc = null;

  if (!Number.isNaN(id)) {
    doc = await prisma.lawDoc.findUnique({
      where: { id },
    });
  }

  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-right" dir="rtl">
        <h1 className="text-2xl font-bold mb-2">المصدر غير موجود</h1>
        <p className="text-sm text-zinc-400">
          لا يوجد مصدر قانوني بالمعرّف: {idParam}
        </p>
      </div>
    );
  }

  const hasFile = !!doc.filePath;
  const hasText = !!doc.text && doc.text.trim().length > 0;

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8 text-right reading-root"
      dir="rtl"
    >
      {/* العنوان + زر وضع القراءة */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">{doc.title}</h1>
        <ReadingModeToggle />
      </div>

      <div className="text-xs text-zinc-400 mb-4 flex flex-wrap gap-2 justify-end">
        <span>{doc.jurisdiction || "غير محدد"}</span>
        <span>· {categoryLabel(doc.category)}</span>
        <span>· {doc.year ?? "بدون سنة"}</span>
      </div>

      {/* 📄 الحالة 1: عندنا PDF → نعرض الـ PDF فقط */}
      {hasFile && (
        <section className="mb-8 reading-container">
          <div className="w-full border border-zinc-800 rounded-2xl overflow-hidden bg-black/40">
            <object
              data={doc.filePath!}
              type="application/pdf"
              className="w-full h-[90vh] pdf-frame"
            >
              <p className="p-4 text-sm text-zinc-300">
                لا يمكن عرض ملف الـ PDF داخل المتصفّح.
              </p>
            </object>
          </div>
        </section>
      )}

      {/* ✍️ الحالة 2: لا يوجد PDF لكن يوجد نص مكتوب يدويًا → نعرض النص */}
      {!hasFile && hasText && (
        <section className="mb-8 reading-container">
          <h2 className="text-lg font-semibold mb-2">النص الكامل</h2>
          <div
            className="
              whitespace-pre-line
              leading-8
              text-base
              bg-zinc-900/60
              border border-zinc-800
              rounded-2xl
              p-4
              text-zinc-100
              reading-text
            "
          >
            {doc.text}
          </div>
        </section>
      )}

      {/* لا PDF ولا نص */}
      {!hasFile && !hasText && (
        <p className="text-sm text-zinc-400">
          لا يوجد نص محفوظ لهذا المصدر حتى الآن.
        </p>
      )}
    </div>
  );
}

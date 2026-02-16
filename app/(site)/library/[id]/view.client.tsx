 "use client";

import { useMemo, useState } from "react";
import { Tabs } from "../_components/Tabs";
import { RelationsPanel } from "../_components/RelationsPanel";
import ExplainPanel from "../_components/ExplainPanel";
import UsePanel from "../_components/UsePanel";

import FaqEditor from "../_components/FaqEditor";
import SmartFaqPanel from "../_components/SmartFaqPanel";

/* =========================
   أنواع النظام
========================= */
type TabKey = "text" | "pdf" | "explain" | "use" | "relations" | "faq";

type LawUnitDoc = {
  id: number;
  title: string;
  category: string;
  content: string;
  simplified?: string | null;
  practicalUse?: string | null;
  pdfUrl?: string | null;
  updatedAt: string;
};

type LawRelation = {
  id: number;
  fromId: number;
  toId: number;
  type: string;
  note?: string | null;
  // قد تأتي من الـ API إذا عملت include
  to?: {
    title?: string | null;
    category?: string | null;
  } | null;
};

type LawFaq = {
  id: number;
  question: string;
  answer: string;
};

/**
 * النوع الذي يتوقعه RelationsPanel
 */
 type RelationView = {
  id: number;
  toId: number;          // ✅ مهم لـ RelationsPanel
  type: string;
  note?: string | null;
  toTitle: string;
  toCategory: string;
};


type Props = {
  doc: LawUnitDoc;
  relations: LawRelation[];
  faqs: LawFaq[];
  canEdit: boolean;
  userRole: string;
};

export default function LawUnitViewClient({
  doc,
  relations,
  faqs,
  canEdit,
  userRole,
}: Props) {
  /* =========================
     حالة التبويبات
  ========================= */
  const [tab, setTab] = useState<TabKey>("text");

  /* =========================
     تعريف التبويبات مع typing صريح
  ========================= */
  const tabs = useMemo<{ key: TabKey; label: string }[]>(
    () => [
      { key: "text", label: "النص القانوني" },
      { key: "pdf", label: "النسخة الأصلية (PDF)" },
      { key: "explain", label: "شرح مبسط" },
      { key: "use", label: "الاستخدام العملي" },
      { key: "relations", label: "العلاقات القانونية" },
      { key: "faq", label: "الأسئلة الشائعة" },
    ],
    []
  );

  /* =========================
     تحويل العلاقات إلى الشكل الذي يتوقعه RelationsPanel
  ========================= */
   const relationViews: RelationView[] = useMemo(
  () =>
    relations.map((r) => ({
      id: r.id,
      toId: r.toId,          // ✅ تمرير المعرّف المطلوب
      type: r.type,
      note: r.note,
      toTitle: r.to?.title || "غير معروف",
      toCategory: r.to?.category || "-",
    })),
  [relations]
);


  return (
    <main className="mx-auto max-w-6xl px-4 py-8" dir="rtl">
      {/* ================= العنوان ================= */}
      <header className="mb-6">
        <div className="text-sm text-zinc-400">{doc.category}</div>

        <h1 className="mt-1 text-right text-3xl font-bold text-zinc-100">
          {doc.title}
        </h1>

        <div className="mt-2 text-xs text-zinc-500">
          آخر تحديث:{" "}
          {new Date(doc.updatedAt).toLocaleDateString("ar-IQ")}
        </div>

        {/* شارة الدور */}
        <div className="mt-1 text-xs text-zinc-600">
          الدور الحالي: {userRole || "GUEST"}
        </div>
      </header>

      {/* ================= التبويبات ================= */}
      <Tabs<TabKey> active={tab} setActive={setTab} items={tabs} />

      {/* ================= المحتوى ================= */}
      <section className="mt-5 space-y-4">
        {/* النص القانوني */}
        {tab === "text" && (
          <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-right text-sm leading-8 text-zinc-200 whitespace-pre-wrap">
            {doc.content || "لا يوجد نص قانوني متاح."}
          </article>
        )}

        {/* PDF */}
        {tab === "pdf" && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <iframe
              src={`/api/library/${doc.id}/pdf`}
              className="w-full h-[80vh] rounded-lg border border-zinc-700"
            />
          </div>
        )}

        {/* الشرح المبسط */}
        {tab === "explain" && <ExplainPanel lawUnitId={doc.id} />}

        {/* الاستخدام العملي */}
         {tab === "use" && (
  <UsePanel
    lawUnitId={doc.id}
    title={doc.title}
    userRole={userRole}
  />
)}


        {/* العلاقات القانونية */}
        {tab === "relations" && (
          <RelationsPanel relations={relationViews} />
        )}

        {/* الأسئلة الشائعة */}
        {tab === "faq" && (
          <div className="space-y-4">
            {/* عرض الأسئلة الحالية */}
            {faqs.length > 0 ? (
              <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
                <h3 className="mb-3 text-sm text-zinc-300">
                  الأسئلة الشائعة المرتبطة بهذه المادة
                </h3>

                <div className="space-y-2">
                  {faqs.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-lg bg-zinc-800 p-3"
                    >
                      <div className="text-sm font-medium text-emerald-400">
                        {f.question}
                      </div>
                      <div className="mt-1 text-sm text-zinc-300 whitespace-pre-line">
                        {f.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-zinc-500">
                لا توجد أسئلة شائعة لهذه المادة بعد.
              </div>
            )}

            {/* إضافة سؤال (محامي / أدمن فقط) */}
            <FaqEditor lawUnitId={doc.id} canEdit={canEdit} />

            {/* السؤال الذكي الحر */}
            <SmartFaqPanel lawUnitId={doc.id} />
          </div>
        )}
      </section>
    </main>
  );
}

 // components/library/LibraryItemViewClient.tsx
"use client";

import PDFViewer from "./PDFViewer";

interface Props {
  item: {
    id: string;
    titleAr: string;
    titleEn?: string | null;
    basicExplanation?: string | null;
    professionalExplanation?: string | null;
    commercialExplanation?: string | null;
    pdfUrl?: string | null;
    hasWord?: boolean;
    wordUrl?: string | null;
    mainCategory: string;
    itemType: string;
    year?: number | null;
    author?: string | null;
    jurisdiction?: string | null;
    views: number;
    downloads: number;
    createdAt: Date;
    updatedAt: Date;
  };
  relatedItems: any[];
  canEdit: boolean;
  isAuthenticated: boolean;
  userRole: string;
  userId?: number;
}

export default function LibraryItemViewClient({
  item,
  relatedItems,
  canEdit,
}: Props) {
  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{item.titleAr}</h1>

      {item.pdfUrl ? (
        <PDFViewer url={item.pdfUrl} title={item.titleAr} />
      ) : (
        <div className="p-10 text-center text-gray-500 bg-gray-50 rounded-lg">
          لا يوجد PDF للعرض
        </div>
      )}

      <div className="space-y-3">
        {item.basicExplanation && (
          <div>
            <h2 className="font-semibold">شرح أساسي</h2>
            <p>{item.basicExplanation}</p>
          </div>
        )}
        {item.professionalExplanation && (
          <div>
            <h2 className="font-semibold">شرح مهني</h2>
            <p>{item.professionalExplanation}</p>
          </div>
        )}
        {item.commercialExplanation && (
          <div>
            <h2 className="font-semibold">شرح تجاري</h2>
            <p>{item.commercialExplanation}</p>
          </div>
        )}
      </div>

      {relatedItems.length > 0 && (
        <div>
          <h3 className="font-semibold mt-6">مواد مرتبطة</h3>
          <ul className="list-disc pl-5">
            {relatedItems.map((r) => (
              <li key={r.id}>{r.titleAr}</li>
            ))}
          </ul>
        </div>
      )}

      {canEdit && (
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            تحرير المادة
          </button>
        </div>
      )}
    </div>
  );
}

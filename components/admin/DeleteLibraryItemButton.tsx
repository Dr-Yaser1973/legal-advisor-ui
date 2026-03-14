// components/admin/DeleteLibraryItemButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  title: string;
  hasPDF?: boolean;
  pdfUrl?: string | null;
}

export default function DeleteLibraryItemButton({ id, title, hasPDF, pdfUrl }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/library/items/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
        setShowConfirm(false);
      } else {
        alert("فشل الحذف");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="حذف"
      >
        🗑️
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-2">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-4">
              هل أنت متأكد من حذف "{title}"؟
              {hasPDF && " (سيتم حذف الملف المرتبط أيضاً)"}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

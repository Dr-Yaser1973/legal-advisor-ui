"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditTitleButton({
  docId,
  currentTitle,
}: {
  docId: number;
  currentTitle: string;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);

    const res = await fetch("/api/library/update-title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docId,
        title,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.ok) {
      setOpen(false);
      router.refresh(); // تحديث الصفحة بدون reload
    } else {
      alert(data.error || "فشل التعديل");
    }
  }

  return (
    <>
      {/* زر */}
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
      >
        ✏️ تعديل
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 w-[420px]">
            <h3 className="mb-3 font-semibold">
              تعديل اسم القانون
            </h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-zinc-700 rounded"
              >
                إلغاء
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-3 py-1 bg-blue-600 rounded text-white"
              >
                {loading ? "جارٍ الحفظ..." : "حفظ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

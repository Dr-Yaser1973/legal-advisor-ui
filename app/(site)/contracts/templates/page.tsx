"use client";

import { useEffect, useState } from "react";

interface Template {
  id: number;
  title: string;
  slug: string;
  language: "AR" | "EN";
}

export default function ContractTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [language, setLanguage] = useState<"AR" | "EN">("AR");
  const [bodyHtml, setBodyHtml] = useState("");

  async function loadTemplates() {
    setLoading(true);
    try {
      const res = await fetch("/api/contracts/templates");
      const data = await res.json();
      setTemplates(data.items || []);
    } catch (e) {
      console.error(e);
      alert("فشل تحميل القوالب");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setLanguage("AR");
    setBodyHtml("");
  }

  function startEdit(t: any) {
    setEditingId(t.id);
    setTitle(t.title || "");
    setSlug(t.slug || "");
    setLanguage((t.language as "AR" | "EN") || "AR");
    setBodyHtml(t.bodyHtml || "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !bodyHtml.trim()) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    const payload = {
      title,
      slug,
      language,
      bodyHtml,
    };

    try {
      const url = editingId
        ? `/api/contracts/templates/${editingId}`
        : "/api/contracts/templates";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        alert(data.error || "فشل حفظ القالب");
        return;
      }

      resetForm();
      loadTemplates();
    } catch (e) {
      console.error(e);
      alert("خطأ أثناء حفظ القالب");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("هل تريد حذف هذا القالب؟")) return;

    try {
      const res = await fetch(`/api/contracts/templates/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        alert(data.error || "فشل حذف القالب");
        return;
      }

      if (editingId === id) resetForm();
      loadTemplates();
    } catch (e) {
      console.error(e);
      alert("خطأ أثناء حذف القالب");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-right">
      <h1 className="text-3xl font-bold mb-6">🧱 إدارة قوالب العقود</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* القائمة */}
        <div className="border rounded-xl bg-white shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">القوالب الحالية</h2>
            {loading && <span className="text-sm text-gray-500">جارٍ التحميل...</span>}
          </div>

          {templates.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد قوالب حتى الآن.</p>
          ) : (
            <ul className="space-y-2">
              {templates.map((t) => (
                <li
                  key={t.id}
                  className="border rounded-lg p-3 flex flex-col gap-2 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-xs text-gray-500">
                        slug: {t.slug} • اللغة: {t.language === "AR" ? "العربية" : "الإنجليزية"}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-2 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* النموذج */}
        <div className="border rounded-xl bg-white shadow-sm p-4">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "تعديل قالب" : "إنشاء قالب جديد"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">عنوان القالب:</label>
              <input
                className="w-full border rounded-lg p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: عقد إيجار سكني"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">الرمز (slug):</label>
              <input
                className="w-full border rounded-lg p-2"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="مثال: rent-residential"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">اللغة:</label>
              <select
                className="w-full border rounded-lg p-2"
                value={language}
                onChange={(e) => setLanguage(e.target.value as "AR" | "EN")}
              >
                <option value="AR">العربية</option>
                <option value="EN">الإنجليزية</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">
                قالب HTML (محتوى العقد):
              </label>
              <textarea
                className="w-full border rounded-lg p-2 min-h-[160px]"
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                placeholder="يمكنك استخدام HTML بسيط مع متغيرات مثل {{partyA}} و {{partyB}} و {{subject}}..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                >
                  إلغاء التعديل
                </button>
              )}

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingId ? "حفظ التعديلات" : "حفظ القالب"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


"use client";
// components/admin/AddFirmModal.tsx
import { useState } from "react";
import { X, Building2, Mail, Phone, MapPin, Globe, FileText } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddFirmModal({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    orgName: "", contactName: "", email: "",
    phone: "", city: "", website: "", description: "",
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/firms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "حدث خطأ."); return; }
      alert(`✅ ${data.message}`);
      onSuccess();
      onClose();
    } catch { setError("حدث خطأ غير متوقع."); }
    finally { setLoading(false); }
  }

  const inputCls = "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition";
  const labelCls = "block text-xs text-zinc-400 mb-1 font-medium";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg mx-4 shadow-2xl">

        {/* الهيدر */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">إضافة مكتب محاماة جديد</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className={labelCls}>
                <Building2 className="w-3 h-3 inline ml-1" />اسم المكتب *
              </label>
              <input className={inputCls} placeholder="مثال: مكتب الرشيد للمحاماة" value={form.orgName} onChange={set("orgName")} required />
            </div>

            <div>
              <label className={labelCls}>اسم المسؤول</label>
              <input className={inputCls} placeholder="اسم الشخص المسؤول" value={form.contactName} onChange={set("contactName")} />
            </div>

            <div>
              <label className={labelCls}>
                <Mail className="w-3 h-3 inline ml-1" />البريد الإلكتروني *
              </label>
              <input type="email" className={inputCls} placeholder="office@example.com" value={form.email} onChange={set("email")} required />
            </div>

            <div>
              <label className={labelCls}>
                <Phone className="w-3 h-3 inline ml-1" />رقم الهاتف
              </label>
              <input className={inputCls} placeholder="+964 7xx xxx xxxx" value={form.phone} onChange={set("phone")} />
            </div>

            <div>
              <label className={labelCls}>
                <MapPin className="w-3 h-3 inline ml-1" />المدينة
              </label>
              <input className={inputCls} placeholder="بغداد" value={form.city} onChange={set("city")} />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>
                <Globe className="w-3 h-3 inline ml-1" />الموقع الإلكتروني
              </label>
              <input className={inputCls} placeholder="https://office.com" value={form.website} onChange={set("website")} />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>
                <FileText className="w-3 h-3 inline ml-1" />نبذة عن المكتب
              </label>
              <textarea className={inputCls} rows={3} placeholder="وصف مختصر عن المكتب وتخصصاته..." value={form.description} onChange={set("description")} />
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
            ✉️ سيُرسل رابط تفعيل إلى البريد الإلكتروني المدخل — صالح لـ 48 ساعة.
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition disabled:opacity-60">
              {loading ? "جارٍ الإنشاء..." : "إنشاء المكتب وإرسال الدعوة"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800 transition">
              إلغاء
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}


// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="bg-zinc-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-red-400 mb-3">
          صلاحية غير كافية
        </h1>
        <p className="text-sm text-zinc-200 mb-4">
          لا تملك صلاحية الوصول إلى هذه الصفحة. يرجى العودة إلى لوحتك أو
          التواصل مع إدارة المنصة إذا كنت تعتقد أن هذا خطأ.
        </p>
        <a
          href="/"
          className="inline-block rounded-md bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-sm text-white"
        >
          الرجوع إلى الرئيسية
        </a>
      </div>
    </div>
  );
}


// app/account-blocked/page.tsx
export default function AccountBlockedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="bg-zinc-900 border border-yellow-500/40 rounded-2xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-yellow-400 mb-3">
          حسابك غير مفعّل
        </h1>
        <p className="text-sm text-zinc-200 mb-2">
          حسابك موقوف مؤقتًا أو منتهي الاشتراك أو بانتظار التفعيل من قبل إدارة
          المنصة.
        </p>
        <p className="text-sm text-zinc-400 mb-4">
          إذا كنت تعتقد أن هذا الإجراء غير صحيح، يرجى التواصل مع إدارة المنصة
          أو الدعم الفني.
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


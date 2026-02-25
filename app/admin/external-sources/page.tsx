// app/admin/external-sources/page.tsx
 import ExternalSourcesClient from "./ExternalSourcesClient";

export const metadata = {
  title: "استيراد مصادر خارجية",
};

export default function AdminExternalSourcesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          📚 استيراد مصادر قانونية خارجية
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          البحث والاستيراد من OpenAlex ثم تحويلها إلى مواد في المكتبة
        </p>
      </div>

      <ExternalSourcesClient />
    </div>
  );
}



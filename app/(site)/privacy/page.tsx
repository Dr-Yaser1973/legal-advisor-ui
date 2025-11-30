 "use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-10 text-right max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">سياسة الخصوصية</h1>

        <p className="mb-4 leading-8 text-zinc-300">
          هذه صفحة سياسة الخصوصية الخاصة بمنصة المستشار القانوني. نلتزم بحماية
          بيانات المستخدمين واستخدامها فقط للأغراض القانونية والخدمات التي
          تقدمها المنصة.
        </p>

        <p className="mb-4 leading-8 text-zinc-300">
          يتم تخزين البيانات وفقًا لمعايير الأمان المتبعة، ولا يتم مشاركتها مع
          أي طرف ثالث إلا وفقًا للقانون أو بموافقة المستخدم.
        </p>

        <p className="leading-8 text-zinc-300">
          باستخدامك للمنصة فإنك توافق على سياسة الخصوصية هذه، ويمكن تحديثها
          من وقت لآخر بما يتناسب مع تطوير الخدمات.
        </p>
      </div>
    </div>
  );
}

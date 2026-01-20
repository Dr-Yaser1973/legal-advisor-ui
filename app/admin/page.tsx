 // app/admin/page.tsx
import Link from "next/link";
import { BookOpen, Users, MessageCircle } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LibraryStatsPanel from "@/components/admin/LibraryStatsPanel";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  return (
    <div className="flex gap-0">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-6">
        {/* العنوان الرئيسي */}
        <header className="border-b border-white/10 pb-4 mb-2">
          <h1 className="text-2xl font-bold">مرحباً بك في لوحة الإدارة</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            من هذه الواجهة يمكنك إدارة المحتوى القانوني في المكتبة، مراجعة
            وتفعيل حسابات المستخدمين والمحامين، ومتابعة طلبات الاستشارات
            القانونية.
          </p>
        </header>

        {/* البطاقات الرئيسية */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* إدارة المكتبة */}
          <Link
            href="/admin/library"
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 hover:border-emerald-500/60 hover:bg-zinc-900 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-semibold">
                  إدارة المكتبة القانونية
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  إضافة وتعديل وحذف المواد القانونية، الكتب، والدراسات، ومراجعة
                  المحتوى المرفوع.
                </p>
              </div>
              <BookOpen className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              استخدم هذه الصفحة لمتابعة محتوى المكتبة وضبط جودته قبل ظهوره
              للمستخدمين.
            </p>
 
          </Link>

          {/* إدارة المستخدمين والأدوار */}
          <Link
            href="/admin/users"
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 hover:border-emerald-500/60 hover:bg-zinc-900 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-semibold">المستخدمون والأدوار</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  تفعيل أو إيقاف الحسابات، تعيين الأدوار (محامٍ، مستخدم، مكتب
                  ترجمة، أدمن)، والتحكم بحالة الاشتراك.
                </p>
              </div>
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              هذه الصفحة هي مركز التحكم في من يمكنه دخول المنصة، وما هي
              الصلاحيات الممنوحة له.
            </p>
          </Link>

          {/* إدارة الاستشارات */}
          <Link
            href="/admin/consultations"
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 hover:border-emerald-500/60 hover:bg-zinc-900 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-semibold">
                  الاستشارات القانونية
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  متابعة طلبات الاستشارات، مراقبة عمل المحامين، ومراجعة الحالات
                  الخاصة أو الشكاوى.
                </p>
              </div>
              <MessageCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              يمكنك من هنا رؤية حركة الاستشارات، ومراقبة جودة الخدمة وتتبع أداء
              المحامين.
            </p>
          </Link>

          
        </section>
                   <h1 className="text-3xl font-bold mb-6">
           احصائيات ادارة المكتبة
</h1>
              <LibraryStatsPanel />
      </section>
    </div>
  );
}

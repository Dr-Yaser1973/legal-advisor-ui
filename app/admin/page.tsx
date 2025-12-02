 // app/(admin)/admin/page.tsx
import Link from "next/link";
import {
  BookOpen,
  Users,
  MessageCircle,
  FileText,
  Languages,
  Briefcase,
  Scale,
} from "lucide-react";

export const dynamic = "force-dynamic";

type AdminLink = {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const adminLinks: AdminLink[] = [
  {
    href: "/library",
    title: "المكتبة القانونية",
    description: "إدارة وإضافة وتحديث المواد القانونية، الكتب والدراسات.",
    icon: <BookOpen className="h-6 w-6 text-emerald-400" />,
  },
  {
    href: "/contracts",
    title: "العقود الذكية",
    description: "مراجعة قوالب العقود، اختبار التوليد الآلي، وضبط النماذج.",
    icon: <FileText className="h-6 w-6 text-emerald-400" />,
  },
  {
    href: "/consultations",
    title: "الاستشارات الذكية",
    description: "متابعة الاستشارات القانونية المولدة بالذكاء الاصطناعي.",
    icon: <Scale className="h-6 w-6 text-emerald-400" />,
  },
  {
    href: "/consultations/human",
    title: "الاستشارات من محامين معتمدين",
    description: "مراجعة طلبات الاستشارات البشرية ومراقبة تنفيذها.",
    icon: <MessageCircle className="h-6 w-6 text-emerald-400" />,
  },
  {
    href: "/lawyers",
    title: "المحامون",
    description: "إدارة ملفات المحامين وتقييمهم واعتمادهم.",
    icon: <Users className="h-6 w-6 text-emerald-400" />,
  },
  {
    href: "/translation-office/requests",
    title: "طلبات الترجمة الرسمية",
    description: "متابعة الطلبات المحوّلة لمكاتب الترجمة واعتماد إنجازها.",
    icon: <Languages className="h-6 w-6 text-emerald-400" />,
  },
  {
    href: "/cases",
    title: "القضايا والمتابعات",
    description: "إدارة قضايا الشركات والمتابعة مع المحامين.",
    icon: <Briefcase className="h-6 w-6 text-emerald-400" />,
  },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      {/* العنوان الرئيسي */}
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">مرحباً بك في لوحة الإدارة</h2>
        <p className="text-sm text-zinc-400 max-w-2xl">
          من هذه الواجهة يمكنك الوصول بسرعة إلى جميع أقسام المنصة لإدارة المحتوى
          القانوني، المستخدمين، الاستشارات، الترجمة، والقضايا.
        </p>
      </section>

      {/* البطاقات الرئيسية */}
      <section className="grid gap-4 md:grid-cols-3">
        {adminLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 hover:border-emerald-500/60 hover:bg-zinc-900 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {item.description}
                </p>
              </div>
              {item.icon}
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              اضغط للوصول إلى هذا القسم وإدارته من واجهة واحدة مخصصة للإدارة.
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}

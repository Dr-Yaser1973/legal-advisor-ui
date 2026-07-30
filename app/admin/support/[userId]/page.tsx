// app/admin/support/[userId]/page.tsx
// محادثة الأدمن مع مستخدم معيّن.
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SupportChat from "@/components/SupportChat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "أدمن",
  LAWYER: "محامٍ",
  CLIENT: "عميل",
  COMPANY: "شركة",
  LAW_FIRM: "مكتب محاماة",
  TRANSLATION_OFFICE: "مكتب ترجمة",
};

export default async function AdminSupportThreadPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session: any = await getServerSession(authOptions as any);
  const admin = session?.user as any;
  if (!admin) redirect("/login");
  if (admin.role !== "ADMIN") redirect("/unauthorized");

  const { userId } = await params;
  const threadUserId = Number(userId);
  if (!Number.isFinite(threadUserId) || threadUserId <= 0) notFound();

  const threadUser = await prisma.user.findUnique({
    where: { id: threadUserId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!threadUser) notFound();

  return (
    <div className="flex gap-0" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 px-6 py-2">
        <Link
          href="/admin/support"
          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 mb-4"
        >
          <ChevronRight className="w-3.5 h-3.5" /> عودة إلى رسائل الدعم
        </Link>

        <div className="mb-4">
          <h1 className="text-xl font-bold">
            {threadUser.name || threadUser.email || `مستخدم #${threadUser.id}`}
          </h1>
          <div className="text-xs text-zinc-400 mt-1">
            {ROLE_LABEL[threadUser.role] || threadUser.role} · {threadUser.email}
          </div>
        </div>

        <SupportChat
          endpoint={`/api/admin/support/${threadUserId}/messages`}
          viewerIsAdmin={true}
        />
      </div>
    </div>
  );
}

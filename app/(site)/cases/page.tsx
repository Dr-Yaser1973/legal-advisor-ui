// app/(site)/cases/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CasesPageClient from "./CasesPageClient";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  // الزائر → ممنوع من القضايا
  if (!user) {
    redirect("/login");
  }

  // نسمح فقط للشركة + المحامي + الأدمن
  if (
    user.role !== "COMPANY" &&
    user.role !== "LAWYER" &&
    user.role !== "ADMIN"
  ) {
    redirect("/unauthorized");
  }

  // هنا نعرض الـ client component
  return <CasesPageClient />;
}


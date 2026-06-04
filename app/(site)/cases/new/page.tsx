// app/(site)/cases/new/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewCaseForm from "./NewCaseForm";

export const dynamic = "force-dynamic";

export default async function NewCasePage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "COMPANY" && user.role !== "LAWYER" && user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // جلب عضويات المستخدم الفعّالة (التي يمكنه إنشاء قضايا فيها)
  const rawMemberships = await prisma.orgMember.findMany({
    where: {
      userId: Number(user.id),
      isActive: true,
      role: { not: "VIEWER" }, // المطّلع لا ينشئ قضايا
    },
    include: {
      org: {
        select: {
          id: true,
          name: true,
          branches: {
            where: { isActive: true },
            select: { id: true, name: true, city: true },
          },
          members: {
            where: { isActive: true },
            select: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
    },
  });

  // تحويل لصيغة مبسّطة للنموذج
  const memberships = rawMemberships.map((m) => ({
    orgId: m.org.id,
    orgName: m.org.name,
    role: m.role,
    branches: m.org.branches,
    members: m.org.members.map((mm) => ({
      id: mm.user.id,
      name: mm.user.name,
      email: mm.user.email,
    })),
  }));

  return <NewCaseForm memberships={memberships} />;
}

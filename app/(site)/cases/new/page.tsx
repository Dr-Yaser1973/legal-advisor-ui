 // app/(site)/cases/new/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import NewCaseForm from "./NewCaseForm";

export const dynamic = "force-dynamic";

export default async function NewCasePage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (
    user.role !== "COMPANY" &&
    user.role !== "LAWYER" &&
    user.role !== "LAW_FIRM" &&
    user.role !== "ADMIN"
  ) {
    redirect("/unauthorized");
  }

  return <NewCaseForm />;
}
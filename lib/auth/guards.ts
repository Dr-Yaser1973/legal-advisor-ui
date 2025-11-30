// lib/auth/guards.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export type AppRole =
  | "ADMIN"
  | "LAWYER"
  | "CLIENT"
  | "COMPANY"
  | "TRANSLATION_OFFICE";

export async function requireSession() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) {
    redirect("/login");
  }

  return user as { id: number; role: AppRole; status?: string };
}

export async function requireRoles(roles: AppRole[]) {
  const user = await requireSession();

  if (!roles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}


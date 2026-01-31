 // lib/auth/guards.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export type DbAuthUser = {
  id: number;
  email: string;
  role: UserRole;
  isApproved: boolean;
};

type Ok<T> = { ok: true } & T;
type Fail = { ok: false; res: NextResponse };

function json401(message = "غير مصرح. يرجى تسجيل الدخول.") {
  return NextResponse.json({ ok: false, error: message }, { status: 401 });
}
function json403(message = "ليست لديك صلاحية الوصول.") {
  return NextResponse.json({ ok: false, error: message }, { status: 403 });
}
function json404(message = "غير موجود.") {
  return NextResponse.json({ ok: false, error: message }, { status: 404 });
}

/** يجلب الجلسة + المستخدم من قاعدة البيانات */
export async function requireUser(): Promise<
  Ok<{ user: DbAuthUser }> | Fail
> {
  const session = (await getServerSession(authOptions as any)) as any;
  const email = session?.user?.email?.toLowerCase?.().trim?.();

  if (!session || !email) {
    return { ok: false, res: json401() };
  }

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      isApproved: true,
    },
  });

  if (!dbUser || !dbUser.email) {
    return {
      ok: false,
      res: json401("الحساب غير مكتمل (بريد إلكتروني مفقود)."),
    };
  }

  if (!dbUser.isApproved && dbUser.role !== UserRole.CLIENT) {
    return { ok: false, res: json403("الحساب قيد المراجعة.") };
  }

  return {
    ok: true,
    user: {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      isApproved: dbUser.isApproved,
    },
  };
}

export async function requireRole(
  roles: UserRole[],
): Promise<Ok<{ user: DbAuthUser }> | Fail> {
  const auth = await requireUser();
  if (!auth.ok) return auth;

  if (!roles.includes(auth.user.role)) {
    return { ok: false, res: json403() };
  }

  return auth;
}

/** يمنع Debug في الإنتاج */
export function blockIfProduction() {
  if (process.env.NODE_ENV === "production") {
    return {
      ok: false as const,
      res: NextResponse.json({ ok: false, error: "Not found" }, { status: 404 }),
    };
  }
  return { ok: true as const };
}

/** صلاحية الوصول إلى قضية */
export async function requireCaseAccess(caseId: number) {
  const auth = await requireRole([
    UserRole.ADMIN,
    UserRole.LAWYER,
    UserRole.COMPANY,
  ]);
  if (!auth.ok) return auth;

  if (auth.user.role === UserRole.ADMIN) return auth;

  const c = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, userId: true },
  });

  if (!c) {
    return { ok: false as const, res: json404("القضية غير موجودة.") };
  }

  if (c.userId !== auth.user.id) {
    return {
      ok: false as const,
      res: json403("ليست لديك صلاحية الوصول إلى هذه القضية."),
    };
  }

  return auth;
}

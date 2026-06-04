 // lib/caseAccess.ts
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type AccessLevel = "NONE" | "READ" | "WRITE";

/**
 * يجلب orgId الخاص بمستخدم عبر فرعه (إن وُجد).
 */
async function getUserOrgId(userId: number): Promise<number | null> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { branch: { select: { orgId: true } } },
  });
  return u?.branch?.orgId ?? null;
}

/**
 * يجلب orgId الخاص بمالك القضية (منشئها) عبر فرعه.
 */
async function getCaseOrgId(caseOwnerId: number): Promise<number | null> {
  return getUserOrgId(caseOwnerId);
}

/**
 * الدالة المركزية: مستوى وصول المستخدم لقضية.
 *  - أدمن المنصة → WRITE
 *  - منشئ القضية → WRITE
 *  - المدير العام لنفس الشركة → WRITE (يرى كل قضايا شركته)
 *  - مكلّف بالقضية → WRITE
 *  - غير ذلك → NONE
 */
export async function getCaseAccess(
  userId: number,
  isPlatformAdmin: boolean,
  c: { id: number; userId: number }
): Promise<AccessLevel> {
  if (isPlatformAdmin) return "WRITE";

  // منشئ القضية
  if (c.userId === userId) return "WRITE";

  // المدير العام لنفس شركة القضية
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { isManager: true, branch: { select: { orgId: true } } },
  });

  if (me?.isManager && me.branch?.orgId) {
    const caseOrgId = await getCaseOrgId(c.userId);
    if (caseOrgId && caseOrgId === me.branch.orgId) return "WRITE";
  }

  // مكلّف بالقضية
  const assignment = await prisma.caseAssignment.findUnique({
    where: { caseId_userId: { caseId: c.id, userId } },
    select: { role: true },
  });
  if (assignment) return "WRITE";

  return "NONE";
}

/**
 * حذف القضية: منشئها، أو المدير العام لشركتها، أو الأدمن.
 */
export async function canDeleteCase(
  userId: number,
  isPlatformAdmin: boolean,
  c: { userId: number }
): Promise<boolean> {
  if (isPlatformAdmin) return true;
  if (c.userId === userId) return true;

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { isManager: true, branch: { select: { orgId: true } } },
  });

  if (me?.isManager && me.branch?.orgId) {
    const caseOrgId = await getCaseOrgId(c.userId);
    if (caseOrgId && caseOrgId === me.branch.orgId) return true;
  }

  return false;
}

/**
 * فلتر قائمة القضايا — استدعاء واحد.
 *  - أدمن منصة → الكل
 *  - مدير عام → كل قضايا شركته (أي قضية مالكها ضمن نفس orgId)
 *  - موظف عادي → قضاياه كمنشئ + المكلّف بها
 */
export async function buildCaseListFilter(
  userId: number,
  isPlatformAdmin: boolean
): Promise<Prisma.CaseWhereInput> {
  if (isPlatformAdmin) return {};

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { isManager: true, branch: { select: { orgId: true } } },
  });

  // المدير العام: كل قضايا شركته
  if (me?.isManager && me.branch?.orgId) {
    const orgId = me.branch.orgId;
    return {
      OR: [
        { userId },                                       // قضاياه هو
        { assignments: { some: { userId } } },            // المكلّف بها
        { user: { branch: { orgId } } },                  // كل قضايا الشركة
      ],
    };
  }

  // موظف عادي: قضاياه + المكلّف بها فقط
  return {
    OR: [
      { userId },
      { assignments: { some: { userId } } },
    ],
  };
}
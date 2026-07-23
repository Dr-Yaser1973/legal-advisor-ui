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
  c: {
    id: number;
    userId: number;
    orgId?: number | null;
    branchId?: number | null;
    visibility?: string | null;
  }
): Promise<AccessLevel> {
  if (isPlatformAdmin) return "WRITE";

  // منشئ القضية
  if (c.userId === userId) return "WRITE";

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { isManager: true, branchId: true, branch: { select: { orgId: true } } },
  });
  const myOrgId = me?.branch?.orgId ?? null;

  // المدير العام لنفس شركة القضية
  if (me?.isManager && myOrgId) {
    const caseOrgId = await getCaseOrgId(c.userId);
    if (caseOrgId && caseOrgId === myOrgId) return "WRITE";
  }

  // مكلّف بالقضية
  const assignment = await prisma.caseAssignment.findUnique({
    where: { caseId_userId: { caseId: c.id, userId } },
    select: { role: true },
  });
  if (assignment) return "WRITE";

  // مشاركة على مستوى المنظمة/الفرع → اطّلاع فقط (READ)
  if (c.visibility === "ORG" && c.orgId && myOrgId && c.orgId === myOrgId) {
    return "READ";
  }
  if (c.visibility === "BRANCH" && c.branchId && me?.branchId && c.branchId === me.branchId) {
    return "READ";
  }

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
    select: { isManager: true, branchId: true, branch: { select: { orgId: true } } },
  });

  const orgId = me?.branch?.orgId ?? null;
  const branchId = me?.branchId ?? null;

  const or: Prisma.CaseWhereInput[] = [
    { userId },                             // قضاياه هو
    { assignments: { some: { userId } } },  // المكلّف بها
  ];

  // قضايا مُشارَكة على مستوى منظمته/فرعه (اطّلاع)
  if (orgId) or.push({ visibility: "ORG", orgId });
  if (branchId) or.push({ visibility: "BRANCH", branchId });

  // المدير العام: كل قضايا شركته
  if (me?.isManager && orgId) {
    or.push({ user: { branch: { orgId } } });
  }

  return { OR: or };
}
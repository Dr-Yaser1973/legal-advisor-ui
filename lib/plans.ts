// lib/plans.ts
import { UserPlan, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// ===============================
// تعريف الباقات
// ===============================
export const PLAN_CONFIG = {
  FREE: {
    label: "مجاني",
    points: 0,
    monthlyPoints: 0,
    weeklyAiConsults: 1, // استشارة ذكية واحدة أسبوعياً
  },
  INDIVIDUAL: {
    label: "أفراد",
    points: 50,
    monthlyPoints: 50,
    weeklyAiConsults: null, // غير محدود (يستهلك نقاط)
  },
  LAWYER: {
    label: "محامون",
    points: 0,
    monthlyPoints: 0,
    weeklyAiConsults: null, // بالنقاط فقط
  },
  TRANSLATION: {
    label: "مكاتب الترجمة",
    points: 0,
    monthlyPoints: 0,
    weeklyAiConsults: null,
  },
  BUSINESS: {
    label: "شركات",
    points: -1, // غير محدود
    monthlyPoints: -1,
    weeklyAiConsults: null,
  },
} satisfies Record<UserPlan, {
  label: string;
  points: number;
  monthlyPoints: number;
  weeklyAiConsults: number | null;
}>;

// ===============================
// تكلفة كل عملية بالنقاط
// ===============================
export const POINTS_COST = {
  AI_CONSULT: 1,
  AI_TRANSLATION: 2,
  HUMAN_CONSULT: 5,
  HUMAN_TRANSLATION: 5,
} as const;

export type PointsAction = keyof typeof POINTS_COST;

// ===============================
// صلاحيات كل باقة
// ===============================
export const PLAN_PERMISSIONS = {
  FREE: {
    aiConsult: true,        // محدود أسبوعياً
    aiTranslation: false,
    contracts: false,
    caseManagement: false,
    humanConsult: false,    // عرض فقط
    humanTranslation: false,
    viewLawyers: true,
    submitOffers: false,
    receiveTranslations: false,
  },
  INDIVIDUAL: {
    aiConsult: true,
    aiTranslation: true,
    contracts: true,
    caseManagement: false,
    humanConsult: true,     // يستهلك نقاط
    humanTranslation: true, // يستهلك نقاط
    viewLawyers: true,
    submitOffers: false,
    receiveTranslations: false,
  },
  LAWYER: {
    aiConsult: true,        // بنقاط إضافية
    aiTranslation: true,    // بنقاط إضافية
    contracts: true,
    caseManagement: true,
    humanConsult: false,
    humanTranslation: false,
    viewLawyers: false,
    submitOffers: true,     // تقديم عروض
    receiveTranslations: false,
  },
  TRANSLATION: {
    aiConsult: false,
    aiTranslation: false,
    contracts: false,
    caseManagement: false,
    humanConsult: false,
    humanTranslation: false,
    viewLawyers: false,
    submitOffers: false,
    receiveTranslations: true, // استقبال طلبات ترجمة
  },
  BUSINESS: {
    aiConsult: true,
    aiTranslation: true,
    contracts: true,
    caseManagement: true,
    humanConsult: true,
    humanTranslation: true,
    viewLawyers: true,
    submitOffers: false,
    receiveTranslations: false,
  },
} satisfies Record<UserPlan, Record<string, boolean>>;

export type Permission = keyof typeof PLAN_PERMISSIONS.FREE;

// ===============================
// التحقق من صلاحية المستخدم
// ===============================
export function hasPermission(plan: UserPlan, permission: Permission): boolean {
  return PLAN_PERMISSIONS[plan][permission] ?? false;
}

// ===============================
// التحقق من النقاط (BUSINESS = غير محدود)
// ===============================
export function isUnlimited(plan: UserPlan): boolean {
  return plan === "BUSINESS";
}

// ===============================
// جلب بيانات المستخدم مع الباقة والنقاط
// ===============================
export async function getUserPlanData(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      points: true,
      pointsExpiresAt: true,
      subscriptionEndsAt: true,
      role: true,
    },
  });

  if (!user) return null;

  const isSubscriptionActive =
    !user.subscriptionEndsAt || user.subscriptionEndsAt > new Date();

  const effectivePlan: UserPlan =
    isSubscriptionActive ? user.plan : "FREE";

  return {
    ...user,
    effectivePlan,
    isSubscriptionActive,
    isUnlimited: isUnlimited(effectivePlan),
    permissions: PLAN_PERMISSIONS[effectivePlan],
  };
}

// ===============================
// التحقق قبل تنفيذ عملية تستهلك نقاطاً
// ===============================
export async function canPerformAction(
  userId: number,
  action: PointsAction
): Promise<{ allowed: boolean; reason?: string; cost: number }> {
  const userData = await getUserPlanData(userId);
  if (!userData) return { allowed: false, reason: "المستخدم غير موجود", cost: 0 };

  const cost = POINTS_COST[action];

  // BUSINESS = غير محدود
  if (userData.isUnlimited) return { allowed: true, cost: 0 };

  // FREE = استشارة ذكية واحدة أسبوعياً فقط
  if (userData.effectivePlan === "FREE") {
    if (action === "AI_CONSULT") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const recentConsult = await prisma.consultation.findFirst({
        where: {
          userId,
          createdAt: { gte: oneWeekAgo },
        },
      });

      if (recentConsult) {
        return {
          allowed: false,
          reason: "استنفدت استشارتك المجانية هذا الأسبوع. اشترك في باقة الأفراد للحصول على المزيد.",
          cost,
        };
      }
      return { allowed: true, cost: 0 };
    }
    return {
      allowed: false,
      reason: "هذه الخدمة غير متاحة في الباقة المجانية. يرجى الترقية.",
      cost,
    };
  }

  // التحقق من النقاط لباقة الأفراد والمحامين
  if (userData.points < cost) {
    return {
      allowed: false,
      reason: `نقاطك غير كافية. تحتاج ${cost} نقاط وعندك ${userData.points} نقطة فقط.`,
      cost,
    };
  }

  return { allowed: true, cost };
}

// ===============================
// استهلاك النقاط
// ===============================
export async function consumePoints(
  userId: number,
  action: PointsAction
): Promise<{ success: boolean; remainingPoints: number }> {
  const { allowed, cost, reason } = await canPerformAction(userId, action);

  if (!allowed) throw new Error(reason);
  if (cost === 0) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } });
    return { success: true, remainingPoints: user?.points ?? 0 };
  }

  const [updated] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: cost } },
    }),
    prisma.pointsTransaction.create({
      data: {
        userId,
        amount: -cost,
        reason: action,
      },
    }),
  ]);

  return { success: true, remainingPoints: updated.points };
}

// ===============================
// إضافة نقاط (عند الشراء أو التجديد)
// ===============================
export async function addPoints(
  userId: number,
  amount: number,
  reason: string
): Promise<{ success: boolean; newBalance: number }> {
  const [updated] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { points: { increment: amount } },
    }),
    prisma.pointsTransaction.create({
      data: { userId, amount, reason },
    }),
  ]);

  return { success: true, newBalance: updated.points };
}

// ===============================
// تفعيل باقة جديدة للمستخدم
// ===============================
export async function activatePlan(
  userId: number,
  plan: UserPlan
): Promise<void> {
  const config = PLAN_CONFIG[plan];
  const now = new Date();
  const endsAt = new Date(now.setMonth(now.getMonth() + 1));

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        plan,
        subscriptionEndsAt: endsAt,
        // إضافة النقاط الشهرية إذا وجدت
        ...(config.monthlyPoints > 0
          ? { points: { increment: config.monthlyPoints } }
          : {}),
      },
    });

    if (config.monthlyPoints > 0) {
      await tx.pointsTransaction.create({
        data: {
          userId,
          amount: config.monthlyPoints,
          reason: `subscription_${plan.toLowerCase()}`,
        },
      });
    }
  });
}

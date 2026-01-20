 // lib/library/relations.ts
import { prisma } from "@/lib/prisma";
import { LawCategory, LawRelationType } from "@prisma/client";

export type RelationEdge = {
  id: number;
  type: LawRelationType;
  note: string | null;

  // ✅ نفس شكل الواجهة الحالية (RelationsPanel / Link)
  toId: number;
  toTitle: string;
  toCategory: LawCategory;

  // ✅ لمعرفة هل هي علاقة خارجة أم داخلة (اختياري للعرض)
  direction: "OUT" | "IN";

  createdAt: string; // ISO
};

export async function getDocRelations(lawUnitId: number): Promise<RelationEdge[]> {
  // 1) علاقات خارجة: from = الحالي -> to = مادة أخرى
  const outRows = await prisma.lawRelation.findMany({
    where: { fromId: lawUnitId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      note: true,
      createdAt: true,
      to: {
        select: { id: true, title: true, category: true },
      },
    },
  });

  // 2) علاقات داخلة: مادة أخرى -> الحالي
  const inRows = await prisma.lawRelation.findMany({
    where: { toId: lawUnitId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      note: true,
      createdAt: true,
      from: {
        select: { id: true, title: true, category: true },
      },
    },
  });

  const outEdges: RelationEdge[] = outRows.map((r) => ({
    id: r.id,
    type: r.type,
    note: r.note,
    toId: r.to.id,
    toTitle: r.to.title,
    toCategory: r.to.category,
    direction: "OUT",
    createdAt: r.createdAt.toISOString(),
  }));

  // لاحظ: في العلاقات الداخلة نُرجع الطرف الآخر كـ to*
  // حتى الـ UI يبقى يربط على toId دائمًا بدون تعديل كبير
  const inEdges: RelationEdge[] = inRows.map((r) => ({
    id: r.id,
    type: r.type,
    note: r.note,
    toId: r.from.id,
    toTitle: r.from.title,
    toCategory: r.from.category,
    direction: "IN",
    createdAt: r.createdAt.toISOString(),
  }));

  // دمج + ترتيب نهائي (الأحدث أولًا)
  return [...outEdges, ...inEdges].sort((a, b) => {
    const ta = Date.parse(a.createdAt);
    const tb = Date.parse(b.createdAt);
    return tb - ta;
  });
}

export async function addDocRelation(args: {
  fromDocId: number;
  toDocId: number;
  type: LawRelationType;
  note?: string;
}) {
  const fromId = Number(args.fromDocId);
  const toId = Number(args.toDocId);

  if (!Number.isInteger(fromId) || !Number.isInteger(toId)) {
    throw new Error("Bad ids");
  }
  if (fromId === toId) {
    throw new Error("لا يمكن ربط المادة بنفسها");
  }

  return prisma.lawRelation.upsert({
    where: {
      fromId_toId_type: {
        fromId,
        toId,
        type: args.type,
      },
    },
    update: {
      note: args.note ?? null,
    },
    create: {
      fromId,
      toId,
      type: args.type,
      note: args.note ?? null,
    },
  });
}

export async function deleteDocRelation(args: {
  fromDocId: number;
  toDocId: number;
  type: LawRelationType;
}) {
  const fromId = Number(args.fromDocId);
  const toId = Number(args.toDocId);

  return prisma.lawRelation.delete({
    where: {
      fromId_toId_type: {
        fromId,
        toId,
        type: args.type,
      },
    },
  });
}

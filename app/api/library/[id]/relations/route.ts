 import { prisma } from "@/lib/prisma";
 import type { RelationEdge, LawRelationType } from "@/lib/library/types";

import { LawCategory } from "@prisma/client";

export async function getDocRelations(
  docId: number
): Promise<RelationEdge[]> {
  const rows = await prisma.lawRelation.findMany({
    where: {
      fromId: docId, // اسم الحقل الصحيح
    },
    orderBy: { id: "desc" },
    include: {
      to: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    note: r.note,
    to: {
      id: r.to.id,
      title: r.to.title,
      section: r.to.category as LawCategory,
    },
  }));
}

export async function addDocRelation(args: {
  fromDocId: number;
  toDocId: number;
  type: LawRelationType;
  note?: string;
}) {
  return prisma.lawRelation.upsert({
    where: {
      fromId_toId_type: {
        fromId: args.fromDocId,
        toId: args.toDocId,
        type: args.type,
      },
    },
    update: {
      note: args.note ?? null,
    },
    create: {
      fromId: args.fromDocId,
      toId: args.toDocId,
      type: args.type,
      note: args.note ?? null,
    },
  });
}

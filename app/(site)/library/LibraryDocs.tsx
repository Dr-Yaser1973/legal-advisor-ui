 import { prisma } from "@/lib/prisma";

export async function getLibraryUnits() {
  return prisma.lawUnit.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      createdAt: true,
    },
  });
}

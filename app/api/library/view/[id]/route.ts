import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: any) {
  try {
    const id = Number(params.id);

    const doc = await prisma.lawDoc.findUnique({
      where: { id },
      include: { articles: { orderBy: { ordinal: "asc" } } },
    });

    return Response.json(doc);
  } catch (e) {
    return Response.json({ error: "فشل عرض القانون" }, { status: 500 });
  }
}


 import { prisma } from "./lib/prisma";
import { OrgRole } from "@prisma/client";

async function main() {
  const member = await prisma.orgMember.create({
    data: {
      orgId: 1,
      userId: 1,
      role: OrgRole.OWNER,
      isActive: true,
    },
  });
  console.log("تم إنشاء العضوية:", member);
}

main()
  .catch((e) => console.error("خطأ:", e))
  .finally(() => prisma.$disconnect());
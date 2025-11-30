 // prisma/seed.ts
import {
  PrismaClient,
  UserRole,
  LawCategory,
  Language,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ============= 1️⃣ إنشاء أدمن =============
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "pass1234";
  const name = process.env.ADMIN_NAME || "مدير النظام";

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      // لو موجود نضمن أن دوره أدمن ومفعّل
      role: UserRole.ADMIN,
      isApproved: true,
    },
    create: {
      email,
      name,
      password: hashed,
      role: UserRole.ADMIN,
      isApproved: true,
    },
  });

  console.log(`✅ Admin created or already exists: ${admin.email}`);

  // ============= 2️⃣ إنشاء مستخدمين تجريبيين لكل دور =============
  const demoPassword = process.env.DEMO_PASSWORD || "Pass1234!";
  const demoHashed = await bcrypt.hash(demoPassword, 10);

  const demoUsers = [
    {
      email: "client@example.com",
      name: "مستخدم عادي تجريبي",
      role: UserRole.CLIENT,
      isApproved: true,
    },
    {
      email: "lawyer@example.com",
      name: "محامٍ تجريبي",
      role: UserRole.LAWYER,
      isApproved: true, // كأن الأدمن وافق عليه
    },
    {
      email: "company@example.com",
      name: "شركة تجريبية",
      role: UserRole.COMPANY,
      isApproved: true,
    },
    {
      email: "office@example.com",
      name: "مكتب ترجمة تجريبي",
      role: UserRole.TRANSLATION_OFFICE,
      isApproved: true,
    },
  ] as const;

  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        isApproved: u.isApproved,
      },
      create: {
        email: u.email,
        name: u.name,
        password: demoHashed,
        role: u.role,
        isApproved: u.isApproved,
      },
    });
    console.log(`✅ ${u.role} user seeded: ${user.email}`);
  }

  console.log(
    `🔐 Demo password for all demo users: ${demoPassword}`
  );

  // ============= 3️⃣ إدخال قوالب العقود الجاهزة =============
  await prisma.contractTemplate.createMany({
    data: [
      {
        title: "عقد عمل محدد المدة",
        slug: "fixed-term-employment",
        bodyHtml: "<p>هذا نموذج عقد عمل محدد المدة بين طرفين...</p>",
        language: Language.AR,
      },
      {
        title: "عقد إيجار شقة سكنية",
        slug: "residential-lease",
        bodyHtml: "<p>هذا نموذج عقد إيجار شقة سكنية...</p>",
        language: Language.AR,
      },
      {
        title: "عقد بيع منقول",
        slug: "movable-sale",
        bodyHtml:
          "<p>هذا نموذج عقد بيع منقول (سيارة، معدات، ...)</p>",
        language: Language.AR,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Contract templates seeded (or already exist).");

  // ============= 4️⃣ قوانين تجريبية للمكتبة (LawDoc + LawArticle) =============

  // قانون 1: مثال قانون عراقي
  const law1 = await prisma.lawDoc.create({
    data: {
      title:
        "قانون إدارة المحافظات غير المنتظمة في إقليم (مثال تجريبي)",
      category: LawCategory.LAW,
      jurisdiction: "العراق",
      year: 2008,
      text:
        "هذا نص تجريبي لقانون إدارة المحافظات غير المنتظمة في إقليم. " +
        "يمكنك استبداله لاحقًا بالنص الحقيقي من خلال واجهة الأدمن أو رفع ملف PDF.",
      articles: {
        create: [
          {
            ordinal: 1,
            number: "1",
            text:
              "المادة الأولى: تسري أحكام هذا القانون على جميع المحافظات غير المنتظمة في إقليم.",
          },
          {
            ordinal: 2,
            number: "2",
            text:
              "المادة الثانية: تتمتع المحافظة بالشخصية المعنوية والاستقلال المالي والإداري ضمن الحدود المقررة في الدستور.",
          },
        ],
      },
    },
  });

  // قانون 2: مثال كتاب فقهي
  const fiqh1 = await prisma.lawDoc.create({
    data: {
      title: "كتاب فقهي تجريبي في أحكام البيوع",
      category: LawCategory.FIQH,
      jurisdiction: "فقه إسلامي",
      year: 2020,
      text:
        "هذا نص تجريبي لكتاب فقهي في أحكام البيوع، الغرض منه فقط اختبار عرض النصوص في المكتبة.",
      articles: {
        create: [
          {
            ordinal: 1,
            number: "باب 1",
            text:
              "الباب الأول: تعريف البيع وشروط صحته وفقًا لأقوال الفقهاء.",
          },
          {
            ordinal: 2,
            number: "باب 2",
            text:
              "الباب الثاني: أحكام الخيار والعيب في عقد البيع.",
          },
        ],
      },
    },
  });

  // قانون 3: مثال دراسة أكاديمية
  const study1 = await prisma.lawDoc.create({
    data: {
      title:
        "دراسة أكاديمية تجريبية في النظام الدستوري العراقي",
      category: LawCategory.ACADEMIC_STUDY,
      jurisdiction: "العراق",
      year: 2015,
      text:
        "هذه دراسة أكاديمية تجريبية في النظام الدستوري العراقي، فقط لأغراض الاختبار في مكتبة المستشار القانوني.",
      articles: {
        create: [
          {
            ordinal: 1,
            number: "فصل 1",
            text:
              "الفصل الأول: التطور التاريخي للنظام الدستوري في العراق بعد عام 2003.",
          },
          {
            ordinal: 2,
            number: "فصل 2",
            text:
              "الفصل الثاني: مبدأ الفصل بين السلطات في الدستور العراقي النافذ.",
          },
        ],
      },
    },
  });

  console.log("✅ LawDocs seeded with sample articles:", {
    law1: law1.id,
    fiqh1: fiqh1.id,
    study1: study1.id,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

 // prisma/seed.js
const {
  PrismaClient,
  UserRole,
  LawCategory,
  Language,
} = require("@prisma/client");
const bcrypt = require("bcrypt");

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

  // ============= 2️⃣ مستخدمين تجريبيين =============
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
      isApproved: true,
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
  ];

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

  console.log(`🔐 Demo password for all demo users: ${demoPassword}`);

  // ============= 3️⃣ قوالب العقود =============
  await prisma.contractTemplate.createMany({
    data: [
      {
        title: "عقد عمل محدد المدة",
        slug: "fixed-term-employment",
        bodyHtml: "<p>هذا نموذج عقد عمل محدد المدة بين طرفين...</p>",
        language: Language.AR,
        createdById: admin.id,
      },
      {
        title: "عقد إيجار شقة سكنية",
        slug: "residential-lease",
        bodyHtml: "<p>هذا نموذج عقد إيجار شقة سكنية...</p>",
        language: Language.AR,
        createdById: admin.id,
      },
      {
        title: "عقد بيع منقول",
        slug: "movable-sale",
        bodyHtml: "<p>هذا نموذج عقد بيع منقول (سيارة، معدات، ...)</p>",
        language: Language.AR,
        createdById: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Contract templates seeded (or already exist).");

  // ============= 4️⃣ مكتبة قانونية تجريبية =============

  const law1 = await prisma.lawDoc.create({
    data: {
      title: "قانون إدارة المحافظات غير المنتظمة في إقليم (مثال)",
      category: LawCategory.LAW,
      jurisdiction: "العراق",
      year: 2008,
      text:
        "هذا نص تجريبي لقانون إدارة المحافظات غير المنتظمة في إقليم.",
      articles: {
        create: [
          {
            ordinal: 1,
            number: "1",
            text:
              "المادة الأولى: تسري أحكام هذا القانون على جميع المحافظات.",
          },
          {
            ordinal: 2,
            number: "2",
            text:
              "المادة الثانية: تتمتع المحافظة بالشخصية المعنوية.",
          },
        ],
      },
    },
  });

  const fiqh1 = await prisma.lawDoc.create({
    data: {
      title: "كتاب فقهي تجريبي في أحكام البيوع",
      category: LawCategory.FIQH,
      jurisdiction: "فقه إسلامي",
      year: 2020,
      text:
        "هذا نص تجريبي لكتاب فقهي في أحكام البيوع.",
      articles: {
        create: [
          {
            ordinal: 1,
            number: "باب 1",
            text:
              "تعريف البيع وشروط صحته.",
          },
          {
            ordinal: 2,
            number: "باب 2",
            text:
              "أحكام الخيار والعيب.",
          },
        ],
      },
    },
  });

  const study1 = await prisma.lawDoc.create({
    data: {
      title: "دراسة أكاديمية تجريبية في النظام الدستوري العراقي",
      category: LawCategory.ACADEMIC_STUDY,
      jurisdiction: "العراق",
      year: 2015,
      text:
        "هذه دراسة أكاديمية تجريبية في النظام الدستوري العراقي.",
      articles: {
        create: [
          {
            ordinal: 1,
            number: "فصل 1",
            text:
              "التطور التاريخي للنظام الدستوري بعد 2003.",
          },
          {
            ordinal: 2,
            number: "فصل 2",
            text:
              "مبدأ الفصل بين السلطات.",
          },
        ],
      },
    },
  });

  console.log("✅ LawDocs seeded:", {
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
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

// prisma/scripts/seed-promo-banners.mjs
// بذرة الإعلانات الافتراضية — تُدرَج مرة واحدة فقط إن كان الجدول فارغاً.
// التشغيل: node prisma/scripts/seed-promo-banners.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const banners = [
  {
    sortOrder: 0,
    enabled: true,
    href: "/translate",
    emoji: "🌐",
    gradient: "linear-gradient(135deg,#059669 0%,#0d9488 50%,#0891b2 100%)",
    titleAr: "الترجمة القانونية المعتمدة",
    subtitleAr:
      "ترجمة رسمية معتمدة لعقودك ووثائقك عبر مكاتب مسجّلة — بسرعة وموثوقية.",
    ctaAr: "اطلب الآن",
    titleEn: "Certified Legal Translation",
    subtitleEn:
      "Official certified translation of your contracts and documents via registered offices.",
    ctaEn: "Request now",
  },
  {
    sortOrder: 1,
    enabled: true,
    href: "/contracts",
    emoji: "📄",
    gradient: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#9333ea 100%)",
    titleAr: "مكتبة العقود الجاهزة",
    subtitleAr: "أكثر من ٤٠ عقداً احترافياً ثنائي اللغة، جاهز للتخصيص والتحميل.",
    ctaAr: "تصفّح العقود",
    titleEn: "Ready-Made Contracts Library",
    subtitleEn:
      "40+ professional bilingual contracts, ready to customize and download.",
    ctaEn: "Browse contracts",
  },
  {
    sortOrder: 2,
    enabled: true,
    href: "/consultations",
    emoji: "⚖️",
    gradient: "linear-gradient(135deg,#0b1f3a 0%,#1e3a8a 50%,#2563eb 100%)",
    titleAr: "استشارة قانونية أولى مجاناً",
    subtitleAr: "استشر مستشاراً ذكياً فوراً، أو تواصل مع محامٍ متخصص.",
    ctaAr: "ابدأ استشارتك",
    titleEn: "First Legal Consultation Free",
    subtitleEn: "Get instant AI advice, or connect with a specialized lawyer.",
    ctaEn: "Start now",
  },
];

async function main() {
  const count = await prisma.promoBanner.count();
  if (count > 0) {
    console.log(`⏭️  الجدول يحتوي ${count} إعلاناً بالفعل — لا بذر.`);
    return;
  }
  await prisma.promoBanner.createMany({ data: banners });
  console.log(`✅ تمت إضافة ${banners.length} إعلانات افتراضية.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

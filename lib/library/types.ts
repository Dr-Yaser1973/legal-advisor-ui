 import {
  LawCategory,
  LawRelationType as PrismaLawRelationType,
} from "@prisma/client";

// القسم في الواجهة = نفس Enum قاعدة البيانات
export type LibrarySection = LawCategory;

// أوضاع البحث
export type SearchMode = "hybrid" | "fts" | "simple";

// نتيجة البحث
export type SearchHit = {
  id: number;
  title: string;
  section: LibrarySection;
  snippet: string;
  score: number;
};

// نعيد تصدير نوع العلاقات من Prisma
export type LawRelationType = PrismaLawRelationType;

// شكل العلاقة للواجهة
export type RelationEdge = {
  id: number;
  type: LawRelationType;
  note?: string | null;
  to: {
    id: number;
    title: string;
    section: LibrarySection;
  };
};

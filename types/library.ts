// types/library.ts

export type MainCategory = "LAW" | "FIQH" | "ACADEMIC" | "CONTRACT";

export type ItemType = 
  | "CONSTITUTION" 
  | "STATUTE" 
  | "REGULATION"
  | "PHD_THESIS" 
  | "MASTER_THESIS" 
  | "RESEARCH_PAPER"
  | "LOCAL_CONTRACT" 
  | "INTERNATIONAL_CONTRACT"
  | "COURT_RULING";

 // للعرض الكامل (صفحة التفاصيل)
export interface LibraryItem {
  id: string;
  titleAr: string;
  titleEn?: string | null;
  abstractAr?: string | null;
  abstractEn?: string | null;
  basicExplanation?: string | null;
  professionalExplanation?: string | null;
  commercialExplanation?: string | null;
  mainCategory: MainCategory;
  subCategory?: string | null;
  itemType: string;
  hasPDF: boolean;
  pdfUrl?: string | null;
  hasWord: boolean;
  wordUrl?: string | null;
  jurisdiction?: string | null;
  year?: number | null;
  author?: string | null;
  university?: string | null;
  keywords: string[];
  views: number;
  downloads: number;
  saves: number;
  rating: number;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById?: number | null;
  
}

// للبطاقات فقط (صفحة القائمة)
export interface LibraryCardItem {
  id: string;
  titleAr: string;
  titleEn?: string | null;
  mainCategory: MainCategory;
  itemType: string;
  hasPDF: boolean;
  hasWord: boolean;
  views: number;
  downloads: number;
  rating: number;
  year?: number | null;
  author?: string | null;
  createdAt: string;
  basicExplanation?: string | null;
  professionalExplanation?: string | null;
  commercialExplanation?: string | null;
}

export interface RelatedItem {
  id: string;
  titleAr: string;
   titleEn?: string | null;
  mainCategory: MainCategory;
}

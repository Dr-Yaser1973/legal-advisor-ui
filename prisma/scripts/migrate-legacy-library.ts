 // prisma/scripts/migrate-legacy-library.ts
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
 import * as dotenv from "dotenv";
import * as path from "path";

// ✅ تحميل المتغيرات مباشرة من المسار المطلق
dotenv.config({ 
  path: path.resolve(process.cwd(), '.env'),
  override: true  // فرض القراءة
});

console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "✅" : "❌");

const prisma = new PrismaClient();

// ✅ التحقق من وجود المتغيرات
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ✅ طباعة بالأحرف الإنجليزية لتجنب مشاكل الترميز
if (!supabaseUrl || !supabaseKey) {
  console.error("\n❌ ERROR: Supabase environment variables not found in .env file");
  console.error("Please make sure your .env file contains:");
  console.error("  SUPABASE_URL=https://your-project.supabase.co");
  console.error("  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key");
  console.error("\nCurrent .env location:", process.cwd() + "/.env");
  process.exit(1);
}

console.log("✅ Supabase connected successfully");
console.log("📁 Supabase URL:", supabaseUrl.substring(0, 20) + "...");

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateLegacyLibrary() {
  console.log("\n🚀 Starting library migration...\n");

  let stats = {
    lawUnits: 0,
    lawDocs: 0,
    articles: 0,
    documents: 0,
    migrated: 0,
    skipped: 0,
    errors: 0
  };

  try {
    // 1. جلب جميع البيانات القديمة
    console.log("📊 Fetching old data...");
    
    const [lawUnits, lawDocs, lawArticles, legalDocuments, lawUnitDocs] = await Promise.all([
      prisma.lawUnit.findMany(),
      prisma.lawDoc.findMany(),
      prisma.lawArticle.findMany(),
      prisma.legalDocument.findMany(),
      prisma.lawUnitDocument.findMany()
    ]);

    stats.lawUnits = lawUnits.length;
    stats.lawDocs = lawDocs.length;
    stats.articles = lawArticles.length;
    stats.documents = legalDocuments.length;

    console.log(`   - LawUnit: ${stats.lawUnits}`);
    console.log(`   - LawDoc: ${stats.lawDocs}`);
    console.log(`   - LawArticle: ${stats.articles}`);
    console.log(`   - LegalDocument: ${stats.documents}\n`);

    // 2. إنشاء خريطة للربط
    const unitToDocMap = new Map();
    lawUnitDocs.forEach(rel => {
      unitToDocMap.set(rel.lawUnitId, rel.documentId);
    });

    // 3. ترحيل LawUnit
    console.log("📦 Migrating LawUnit items...");

    for (const lawUnit of lawUnits) {
      try {
        const mainCategory = mapMainCategory(lawUnit.category);
        const itemType = mapItemType(lawUnit.category);

        const documentId = unitToDocMap.get(lawUnit.id);
        const legalDoc = documentId 
          ? legalDocuments.find(d => d.id === documentId)
          : null;

        let hasPDF = false;
        let pdfUrl = null;

        if (legalDoc) {
          hasPDF = true;
          const { data: urlData } = supabase.storage
            .from('library')
            .getPublicUrl(legalDoc.source || "");
          pdfUrl = urlData?.publicUrl || null;
        }

        const newItem = await prisma.libraryItem.create({
          data: {
            id: `legacy-${lawUnit.id}`,
            
            titleAr: lawUnit.title,
            titleEn: null,
            
            basicExplanation: lawUnit.simplified || null,
            professionalExplanation: lawUnit.content || null,
            commercialExplanation: lawUnit.practicalUse || null,
            
            mainCategory: mainCategory as any,
            itemType: itemType as any,
            
            hasPDF: hasPDF,
            pdfUrl: pdfUrl,
            hasWord: false,
            
            jurisdiction: null,
            year: null,
            author: null,
            
            views: 0,
            downloads: 0,
            saves: 0,
            rating: 0,
            
            isPublished: lawUnit.status === "PUBLISHED",
            createdAt: lawUnit.createdAt,
            updatedAt: lawUnit.updatedAt
          }
        });

        if (legalDoc) {
          await prisma.libraryItemDocument.create({
            data: {
              libraryItemId: newItem.id,
              documentId: legalDoc.id
            }
          });
        }

        stats.migrated++;
        console.log(`✅ Migrated: ${lawUnit.title.substring(0, 30)}...`);

      } catch (error) {
        console.error(`❌ Error migrating ${lawUnit.id}:`, error);
        stats.errors++;
      }
    }

    // 4. ترحيل LawDoc
    console.log("\n📄 Migrating LawDoc items...");

    for (const lawDoc of lawDocs) {
      try {
        const mainCategory = mapMainCategory(lawDoc.category);
        
        const articles = lawArticles.filter(a => a.lawDocId === lawDoc.id);
        
        let explanationText = lawDoc.text || "";
        if (articles.length > 0) {
          explanationText = articles.map(a => 
            `Article ${a.number || a.ordinal}: ${a.text}`
          ).join('\n\n');
        }

        const newItem = await prisma.libraryItem.create({
          data: {
            id: `lawdoc-${lawDoc.id}`,
            
            titleAr: lawDoc.title,
            titleEn: null,
            
            basicExplanation: explanationText || null,
            
            mainCategory: mainCategory as any,
            itemType: "STATUTE" as any,
            
            jurisdiction: lawDoc.jurisdiction || null,
            year: lawDoc.year || null,
            
            hasPDF: false,
            hasWord: false,
            
            views: 0,
            downloads: 0,
            saves: 0,
            rating: 0,
            
            isPublished: true,
            createdAt: lawDoc.createdAt,
            updatedAt: lawDoc.updatedAt
          }
        });

        stats.migrated++;
        console.log(`✅ Migrated text: ${lawDoc.title.substring(0, 30)}... (${articles.length} articles)`);

      } catch (error) {
        console.error(`❌ Error migrating ${lawDoc.id}:`, error);
        stats.errors++;
      }
    }

    // 5. عرض النتائج
    console.log("\n" + "=".repeat(60));
    console.log("🎉 MIGRATION COMPLETED!");
    console.log("=".repeat(60));
    console.log(`📊 Total items migrated: ${stats.migrated}`);
    console.log(`❌ Errors: ${stats.errors}`);
    console.log("=".repeat(60));

  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function mapMainCategory(oldCategory: string): string {
  const map: Record<string, string> = {
    "LAW": "LAW",
    "FIQH": "FIQH",
    "ACADEMIC_STUDY": "ACADEMIC",
    "STUDY": "ACADEMIC"
  };
  return map[oldCategory] || "LAW";
}

function mapItemType(oldCategory: string): string {
  const map: Record<string, string> = {
    "LAW": "STATUTE",
    "FIQH": "FIQH_BOOK",
    "ACADEMIC_STUDY": "RESEARCH_PAPER",
    "STUDY": "RESEARCH_PAPER"
  };
  return map[oldCategory] || "STATUTE";
}

migrateLegacyLibrary()
  .catch(console.error)
  .finally(() => process.exit(0));
/*
  Warnings:

  - You are about to drop the column `docId` on the `LawArticle` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `LawArticle` table. All the data in the column will be lost.
  - Added the required column `lawDocId` to the `LawArticle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LawArticle" DROP CONSTRAINT "LawArticle_docId_fkey";

-- DropIndex
DROP INDEX "LawArticle_docId_ordinal_idx";

-- AlterTable
ALTER TABLE "LawArticle" DROP COLUMN "docId",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lawDocId" INTEGER NOT NULL,
ADD COLUMN     "number" TEXT;

-- AddForeignKey
ALTER TABLE "LawArticle" ADD CONSTRAINT "LawArticle_lawDocId_fkey" FOREIGN KEY ("lawDocId") REFERENCES "LawDoc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

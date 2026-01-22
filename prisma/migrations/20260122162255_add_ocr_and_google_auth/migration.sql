/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `LegalDocument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('CREDENTIALS', 'GOOGLE');

-- CreateEnum
CREATE TYPE "DocumentKind" AS ENUM ('PDF', 'IMAGE');

-- CreateEnum
CREATE TYPE "OCRStatus" AS ENUM ('NONE', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "LegalDocument" ADD COLUMN     "checksum" TEXT,
ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "extractedText" TEXT,
ADD COLUMN     "isScanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kind" "DocumentKind" NOT NULL DEFAULT 'PDF',
ADD COLUMN     "ocrLanguage" TEXT,
ADD COLUMN     "ocrStatus" "OCRStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "textPath" TEXT,
 ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();


-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT 'CREDENTIALS',
ADD COLUMN     "providerId" TEXT;

-- CreateIndex
CREATE INDEX "LegalDocument_kind_idx" ON "LegalDocument"("kind");

-- CreateIndex
CREATE INDEX "LegalDocument_ocrStatus_idx" ON "LegalDocument"("ocrStatus");

-- CreateIndex
CREATE INDEX "LegalDocument_createdById_idx" ON "LegalDocument"("createdById");

-- CreateIndex
CREATE INDEX "LegalDocument_checksum_idx" ON "LegalDocument"("checksum");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");

-- AddForeignKey
ALTER TABLE "LegalDocument" ADD CONSTRAINT "LegalDocument_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

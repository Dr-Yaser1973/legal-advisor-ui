-- CreateEnum
CREATE TYPE "TranslationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'COMPANY';
ALTER TYPE "UserRole" ADD VALUE 'TRANSLATION_OFFICE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "TranslationRequest" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "officeId" INTEGER,
    "sourceDocId" INTEGER NOT NULL,
    "targetLang" "Language" NOT NULL,
    "status" "TranslationStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "price" INTEGER,
    "currency" TEXT DEFAULT 'IQD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "TranslationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationOffer" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "officeId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IQD',
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TranslationRequest_clientId_idx" ON "TranslationRequest"("clientId");

-- CreateIndex
CREATE INDEX "TranslationRequest_officeId_idx" ON "TranslationRequest"("officeId");

-- CreateIndex
CREATE INDEX "TranslationRequest_status_createdAt_idx" ON "TranslationRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "TranslationOffer_requestId_idx" ON "TranslationOffer"("requestId");

-- CreateIndex
CREATE INDEX "TranslationOffer_officeId_idx" ON "TranslationOffer"("officeId");

-- AddForeignKey
ALTER TABLE "TranslationRequest" ADD CONSTRAINT "TranslationRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationRequest" ADD CONSTRAINT "TranslationRequest_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationRequest" ADD CONSTRAINT "TranslationRequest_sourceDocId_fkey" FOREIGN KEY ("sourceDocId") REFERENCES "LegalDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationOffer" ADD CONSTRAINT "TranslationOffer_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "TranslationRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationOffer" ADD CONSTRAINT "TranslationOffer_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "TranslationRequest" ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "receivedAt" TIMESTAMP(3),
ADD COLUMN     "translatedFilePath" TEXT,
ADD COLUMN     "translatedFileUrl" TEXT;

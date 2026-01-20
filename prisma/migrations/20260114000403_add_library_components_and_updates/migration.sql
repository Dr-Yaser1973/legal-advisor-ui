-- CreateEnum
CREATE TYPE "LawRelationType" AS ENUM ('AMENDS', 'REPEALS', 'INTERPRETS', 'REFERENCES', 'RELATED', 'APPLIES_TO');

-- DropIndex
DROP INDEX "LawDoc_title_trgm";

-- CreateTable
CREATE TABLE "LawUnitDocument" (
    "id" SERIAL NOT NULL,
    "lawUnitId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LawUnitDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LawUnit" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "simplified" TEXT,
    "practicalUse" TEXT,
    "category" "LawCategory" NOT NULL,
    "status" "DocStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LawUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LawRelation" (
    "id" SERIAL NOT NULL,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "type" "LawRelationType" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LawRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LawUnitDocument_lawUnitId_idx" ON "LawUnitDocument"("lawUnitId");

-- CreateIndex
CREATE INDEX "LawUnitDocument_documentId_idx" ON "LawUnitDocument"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "LawUnitDocument_lawUnitId_documentId_key" ON "LawUnitDocument"("lawUnitId", "documentId");

-- CreateIndex
CREATE INDEX "LawUnit_category_idx" ON "LawUnit"("category");

-- CreateIndex
CREATE INDEX "LawUnit_status_idx" ON "LawUnit"("status");

-- CreateIndex
CREATE INDEX "LawRelation_fromId_idx" ON "LawRelation"("fromId");

-- CreateIndex
CREATE INDEX "LawRelation_toId_idx" ON "LawRelation"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "LawRelation_fromId_toId_type_key" ON "LawRelation"("fromId", "toId", "type");

-- AddForeignKey
ALTER TABLE "LawUnitDocument" ADD CONSTRAINT "LawUnitDocument_lawUnitId_fkey" FOREIGN KEY ("lawUnitId") REFERENCES "LawUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawUnitDocument" ADD CONSTRAINT "LawUnitDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "LegalDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawRelation" ADD CONSTRAINT "LawRelation_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "LawUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawRelation" ADD CONSTRAINT "LawRelation_toId_fkey" FOREIGN KEY ("toId") REFERENCES "LawUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

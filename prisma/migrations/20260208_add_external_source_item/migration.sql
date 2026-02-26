-- Create enum for external sources
CREATE TYPE "ExternalSourceKind" AS ENUM (
  'OPENALEX',
  'COURTLISTENER',
  'EURLEX',
  'WORLDLII'
);

-- Create table ExternalSourceItem
CREATE TABLE "ExternalSourceItem" (
  "id" SERIAL PRIMARY KEY,
  "source" "ExternalSourceKind" NOT NULL,
  "externalId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,

  "jurisdiction" TEXT,
  "publishedAt" TIMESTAMP(3),
  "docType" TEXT,
  "language" TEXT,
  "summary" TEXT,
  "raw" JSONB,

  "lawUnitId" INTEGER,

  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Unique constraint
CREATE UNIQUE INDEX "ExternalSourceItem_source_externalId_key"
ON "ExternalSourceItem" ("source", "externalId");

-- Index for relation
CREATE INDEX "ExternalSourceItem_lawUnitId_idx"
ON "ExternalSourceItem" ("lawUnitId");

-- Foreign key to LawUnit
ALTER TABLE "ExternalSourceItem"
ADD CONSTRAINT "ExternalSourceItem_lawUnitId_fkey"
FOREIGN KEY ("lawUnitId") REFERENCES "LawUnit"("id")
ON DELETE SET NULL ON UPDATE CASCADE;


-- CreateTable
CREATE TABLE "LawDocFaq" (
    "id" SERIAL NOT NULL,
    "docId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LawDocFaq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LawDocFaq_docId_idx" ON "LawDocFaq"("docId");

-- AddForeignKey
ALTER TABLE "LawDocFaq" ADD CONSTRAINT "LawDocFaq_docId_fkey" FOREIGN KEY ("docId") REFERENCES "LawDoc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

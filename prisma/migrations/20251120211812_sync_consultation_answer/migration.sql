-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "answer" TEXT;

-- AlterTable
ALTER TABLE "LawyerProfile" ADD COLUMN     "consultCurrency" TEXT DEFAULT 'IQD',
ADD COLUMN     "consultFee" INTEGER,
ADD COLUMN     "officeAddress" TEXT;

-- CreateTable
CREATE TABLE "HumanConsultOffer" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "lawyerId" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IQD',
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HumanConsultOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HumanConsultOffer_requestId_idx" ON "HumanConsultOffer"("requestId");

-- CreateIndex
CREATE INDEX "HumanConsultOffer_lawyerId_idx" ON "HumanConsultOffer"("lawyerId");

-- AddForeignKey
ALTER TABLE "HumanConsultOffer" ADD CONSTRAINT "HumanConsultOffer_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "HumanConsultRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanConsultOffer" ADD CONSTRAINT "HumanConsultOffer_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

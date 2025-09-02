/*
  Warnings:

  - You are about to drop the column `txHash` on the `TaskExecutionProof` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProofType" AS ENUM ('TEXT', 'IMAGE', 'TRANSACTION');

-- CreateEnum
CREATE TYPE "ProofStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "TaskExecutionProof" DROP COLUMN "txHash",
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "proofType" "ProofType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "uploadedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "TaskExecutionProof" ADD CONSTRAINT "TaskExecutionProof_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

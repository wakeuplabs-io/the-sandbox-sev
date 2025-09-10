/*
  Warnings:

  - The values [TRANSACTION] on the enum `ProofType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `proofDescription` on the `TaskExecutionProof` table. All the data in the column will be lost.
  - You are about to drop the column `proofHash` on the `TaskExecutionProof` table. All the data in the column will be lost.
  - You are about to drop the column `proofImageUrl` on the `TaskExecutionProof` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProofType_new" AS ENUM ('TEXT', 'IMAGE');
ALTER TABLE "TaskExecutionProof" ALTER COLUMN "proofType" DROP DEFAULT;
ALTER TABLE "TaskExecutionProof" ALTER COLUMN "proofType" TYPE "ProofType_new" USING ("proofType"::text::"ProofType_new");
ALTER TYPE "ProofType" RENAME TO "ProofType_old";
ALTER TYPE "ProofType_new" RENAME TO "ProofType";
DROP TYPE "ProofType_old";
ALTER TABLE "TaskExecutionProof" ALTER COLUMN "proofType" SET DEFAULT 'TEXT';
COMMIT;

-- AlterTable
ALTER TABLE "TaskExecutionProof" DROP COLUMN "proofDescription",
DROP COLUMN "proofHash",
DROP COLUMN "proofImageUrl",
ADD COLUMN     "proofValue" TEXT;

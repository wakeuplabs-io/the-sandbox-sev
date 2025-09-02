/*
  Warnings:

  - You are about to drop the column `hash` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `txHash` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskHash]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionHash]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `taskData` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskHash` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionHash` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "hash",
DROP COLUMN "state",
DROP COLUMN "txHash",
ADD COLUMN     "taskData" JSONB NOT NULL,
ADD COLUMN     "taskHash" TEXT NOT NULL,
ADD COLUMN     "transactionHash" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "priority" DROP NOT NULL,
ALTER COLUMN "technicalVerification" DROP NOT NULL,
ALTER COLUMN "technicalVerification" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Task_taskHash_key" ON "Task"("taskHash");

-- CreateIndex
CREATE UNIQUE INDEX "Task_transactionHash_key" ON "Task"("transactionHash");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

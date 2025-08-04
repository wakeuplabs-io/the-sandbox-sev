-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CONSULTANT', 'MEMBER');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('LIQUIDATION', 'ACQUISITION', 'AUTHORIZATION', 'ARBITRAGE');

-- CreateEnum
CREATE TYPE "TaskState" AS ENUM ('STORED', 'EXECUTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT,
    "address" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "state" "TaskState" NOT NULL DEFAULT 'STORED',
    "transactionId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "executionData" TEXT,
    "proofData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_hash_key" ON "Task"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Task_transactionId_key" ON "Task"("transactionId");

-- CreateIndex
CREATE INDEX "Task_type_idx" ON "Task"("type");

-- CreateIndex
CREATE INDEX "Task_state_idx" ON "Task"("state");

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");

-- CreateIndex
CREATE INDEX "Task_type_state_idx" ON "Task"("type", "state");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
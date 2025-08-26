-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CONSULTANT', 'MEMBER');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('LIQUIDATION', 'ACQUISITION', 'AUTHORIZATION', 'ARBITRAGE');

-- CreateEnum
CREATE TYPE "TaskState" AS ENUM ('STORED', 'EXECUTED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'LOW', 'MEDIUM');

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
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "priority" "Priority" NOT NULL,
    "tokenType" TEXT,
    "chain" TEXT,
    "platform" TEXT,
    "typeOfTx" TEXT,
    "details" TEXT,
    "companyAndArtist" TEXT,
    "collectionName" TEXT,
    "tokenId" TEXT,
    "targetPriceEth" TEXT,
    "dateDeadline" TEXT,
    "technicalVerification" BOOLEAN NOT NULL DEFAULT false,
    "nftName" TEXT,
    "targetPriceBudget" TEXT,
    "transactionExecutionDate" TEXT,
    "priorityDeadline" TEXT,
    "targetPricePerToken" TEXT,
    "amount" TEXT,
    "currencyName" TEXT,
    "proportion" TEXT,
    "duration" TEXT,
    "deadline" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "txHash" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskExecutionProof" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "proofHash" TEXT,
    "proofImageUrl" TEXT,
    "proofDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskExecutionProof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_transactionId_key" ON "Task"("transactionId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskExecutionProof" ADD CONSTRAINT "TaskExecutionProof_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

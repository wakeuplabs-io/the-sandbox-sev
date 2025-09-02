import prisma from '@/lib/prisma'
import { keccak256, stringToHex } from 'viem'
import { VerifierService } from '@/services/verifier-service'
import { z } from 'zod'
import {
  LiquidationTaskInput,
  AcquisitionTaskInput,
  AuthorizationTaskInput,
  ArbitrageTaskInput,
  CreateTaskInput,
  GetTasksQuerySchema,
} from './tasks.schema'
import { getPublicHttpsClient } from '@/services/wallet-clients'
import { getWalletHttpsClient } from '@/services/wallet-clients'
import { CHAIN_BY_ENV } from '@/constants'
import env from '@/env'
import { TaskType, User } from '@/generated/prisma'

const chain = CHAIN_BY_ENV[env.NODE_ENV];
const contractAddress = env.EXECUTION_VERIFIER_ADDRESS as `0x${string}`;

const publicClient = getPublicHttpsClient(chain);
const walletClient = getWalletHttpsClient(chain);

const verifierService = new VerifierService({
  contractAddress,
  publicClient,
  walletClient,
});

/**
 * Creates a liquidation task
 */
export const createLiquidationTask = async (
  data: LiquidationTaskInput, 
  user: User,
): Promise<any> => {
  const taskData = { taskType: TaskType.LIQUIDATION, ...data }
  const taskHash = hashTaskData(taskData)
  
  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: user.address as any
  })
  
  // Save to database
  const task = await prisma.task.create({
    data: {
      transactionId: data.transactionId,
      taskType: TaskType.LIQUIDATION,
      taskData: taskData,
      taskHash: taskHash,
      transactionHash: transactionHash,
      tokenType: data.tokenType,
      chain: data.chain,
      platform: data.platform,
      typeOfTx: data.typeOfTx,
      details: data.details,
      companyAndArtist: data.companyAndArtist,
      collectionName: data.collectionName,
      tokenId: data.tokenId,
      targetPriceEth: data.targetPriceEth,
      dateDeadline: data.dateDeadline,
      technicalVerification: data.technicalVerification,
      priority: data.priority,
      userId: user.id,
    },
  })
  
  return task
}

/**
 * Creates an acquisition task
 */
export const createAcquisitionTask = async (
  data: AcquisitionTaskInput, 
  user: User,
): Promise<any> => {
  const taskData = { taskType: TaskType.ACQUISITION, ...data }
  const taskHash = hashTaskData(taskData)
  
  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: user.address as any
  })
  
  // Save to database
  const task = await prisma.task.create({
    data: {
      transactionId: data.transactionId,
      taskType: TaskType.ACQUISITION,
      taskData: taskData,
      taskHash: taskHash,
      transactionHash: transactionHash,
      tokenType: data.tokenType,
      chain: data.chain,
      platform: data.platform,
      typeOfTx: data.typeOfTx,
      details: data.details,
      nftName: data.nftName,
      collectionName: data.collectionName,
      tokenId: data.tokenId,
      targetPriceBudget: data.targetPriceBudget,
      transactionExecutionDate: data.transactionExecutionDate,
      priorityDeadline: data.priorityDeadline,
      priority: data.priority,
      userId: user.id,
    },
  })
  
  return task
}

/**
 * Creates an authorization task
 */
export const createAuthorizationTask = async (
  data: AuthorizationTaskInput, 
  user: User,
): Promise<any> => {
  const taskData = { taskType: TaskType.AUTHORIZATION, ...data }
  const taskHash = hashTaskData(taskData)
  
  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: user.address as any
  })
  
  // Save to database
  const task = await prisma.task.create({
    data: {
      transactionId: data.transactionId,
      taskType: TaskType.AUTHORIZATION,
      taskData: taskData,
      taskHash: taskHash,
      transactionHash: transactionHash,
      tokenType: data.tokenType,
      chain: data.chain,
      platform: data.platform,
      typeOfTx: data.typeOfTx,
      details: data.details,
      collectionName: data.collectionName,
      tokenId: data.tokenId,
      targetPriceBudget: data.targetPriceBudget,
      dateDeadline: data.dateDeadline,
      priority: data.priority,
      userId: user.id,
    },
  })
  
  return task
}

/**
 * Creates an arbitrage task
 */
export const createArbitrageTask = async (
  data: ArbitrageTaskInput, 
  user: User,
): Promise<any> => {
  const taskData = { taskType: TaskType.ARBITRAGE, ...data }
  const taskHash = hashTaskData(taskData)
  
  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: user.address as any
  })
  
  // Save to database
  const task = await prisma.task.create({
    data: {
      transactionId: data.transactionId,
      taskType: TaskType.ARBITRAGE,
      taskData: taskData,
      taskHash: taskHash,
      transactionHash: transactionHash,
      chain: data.chain,
      platform: data.platform,
      typeOfTx: data.typeOfTx,
      details: data.details,
      targetPricePerToken: data.targetPricePerToken,
      amount: data.amount,
      currencyName: data.currencyName,
      proportion: data.proportion,
      duration: data.duration,
      deadline: data.deadline,
      priority: data.priority,
      userId: user.id,
    },
  })
  
  return task
}

/**
 * Main function that delegates to specific task type functions
 */
export const createTask = async (
  data: CreateTaskInput, 
  user: User,
): Promise<any> => {
  // Check if task already exists
  const existingTask = await checkTaskExists(data.transactionId)
  if (existingTask) {
    throw new Error(`Task with transaction ID ${data.transactionId} already exists`)
  }

  switch (data.taskType) {
    case TaskType.LIQUIDATION:
      return createLiquidationTask(data, user)
    case TaskType.ACQUISITION:
      return createAcquisitionTask(data, user)
    case TaskType.AUTHORIZATION:
      return createAuthorizationTask(data, user)
    case TaskType.ARBITRAGE:
      return createArbitrageTask(data, user)
    default:
      throw new Error(`Invalid task type: ${(data as any).taskType}`)
  }
}

/**
 * Hashes task data using keccak256
 */
const hashTaskData = (taskData: any) => {
  const jsonString = JSON.stringify(taskData, Object.keys(taskData).sort())
  return keccak256(stringToHex(jsonString))
}

/**
 * Checks if a task exists by transaction ID
 */
export const checkTaskExists = async (transactionId: string): Promise<boolean> => {
  const task = await prisma.task.findUnique({
    where: { transactionId },
  })
  return !!task
}

/**
 * Gets a task by transaction ID
 */
export const getTaskByTransactionId = async (transactionId: string): Promise<any> => {
  return prisma.task.findUnique({
    where: { transactionId },
  })
}

/**
 * Gets all tasks
 */
export const getAllTasks = async (): Promise<any[]> => {
  return prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Gets tasks with filtering and pagination
 */
export const getTasks = async (query: z.infer<typeof GetTasksQuerySchema>) => {
  const { page, limit, taskType, search, dateFrom, dateTo, status, state } = query
  
  // Build where clause for filters
  const where: any = {}
  
  if (taskType) {
    where.taskType = taskType
  }
  
  if (search) {
    where.OR = [
      { transactionId: { contains: search, mode: 'insensitive' } },
      { taskHash: { contains: search, mode: 'insensitive' } },
      { transactionHash: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  if (dateFrom || dateTo) {
    where.createdAt = {}
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom)
    }
    if (dateTo) {
      where.createdAt.lte = new Date(dateTo)
    }
  }
  
  if (status) {
    where.status = status
  }
  
  if (state) {
    where.state = state
  }
  
  // Get total count for pagination
  const total = await prisma.task.count({ where })
  
  // Calculate pagination
  const totalPages = Math.ceil(total / limit)
  const hasNext = page < totalPages
  const hasPrev = page > 1
  
  // Get tasks with pagination
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          address: true,
          nickname: true,
          email: true,
        },
      },
    },
  })
  
  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
  }
}

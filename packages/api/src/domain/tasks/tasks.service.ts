import prisma from '@/lib/prisma'
import { keccak256, stringToHex } from 'viem'
import { VerifierService } from '@/services/verifier-service'
import {
  LiquidationTaskInput,
  AcquisitionTaskInput,
  AuthorizationTaskInput,
  ArbitrageTaskInput,
  CreateTaskInput,
} from './tasks.schema'

/**
 * Creates a liquidation task
 */
export const createLiquidationTask = async (
  data: LiquidationTaskInput, 
  userAddress: string,
  verifierService: VerifierService
): Promise<any> => {
  const taskData = { taskType: 'LIQUIDATION', ...data }
  const taskHash = hashTaskData(taskData)
  
  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: userAddress as any
  })
  
  // Save to database
  const task = await prisma.task.create({
    data: {
      transactionId: data.transactionId,
      taskType: 'LIQUIDATION',
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
      userId: null, // TODO: Add user relation when needed
    },
  })
  
  return task
}

/**
 * Creates an acquisition task
 */
export const createAcquisitionTask = async (
  data: AcquisitionTaskInput, 
  userAddress: string,
  verifierService: VerifierService
): Promise<any> => {
  const taskData = { taskType: 'ACQUISITION', ...data }
  const taskHash = hashTaskData(taskData)
  
  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: userAddress as any
  })
  
  // Save to database
  const task = await prisma.task.create({
    data: {
      transactionId: data.transactionId,
      taskType: 'ACQUISITION',
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
      userId: null, // TODO: Add user relation when needed
    },
  })
  
  return task
}

/**
 * Creates an authorization task
 */
export const createAuthorizationTask = async (
  data: AuthorizationTaskInput, 
  userAddress: string,
  verifierService: VerifierService
): Promise<any> => {
  const taskData = { taskType: 'AUTHORIZATION', ...data }
  const taskHash = hashTaskData(taskData)
  
  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: userAddress as any
  })
  
  // Save to database
  const task = await prisma.task.create({
    data: {
      transactionId: data.transactionId,
      taskType: 'AUTHORIZATION',
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
      userId: null, // TODO: Add user relation when needed
    },
  })
  
  return task
}

/**
 * Creates an arbitrage task
 */
export const createArbitrageTask = async (
  data: ArbitrageTaskInput, 
  userAddress: string,
  verifierService: VerifierService
): Promise<any> => {
  const taskData = { taskType: 'ARBITRAGE', ...data }
  const taskHash = hashTaskData(taskData)
  
  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: userAddress as any
  })
  
  // Save to database
  const task = await prisma.task.create({
    data: {
      transactionId: data.transactionId,
      taskType: 'ARBITRAGE',
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
      userId: null, // TODO: Add user relation when needed
    },
  })
  
  return task
}

/**
 * Main function that delegates to specific task type functions
 */
export const createTask = async (
  data: CreateTaskInput, 
  userAddress: string,
  verifierService: VerifierService
): Promise<any> => {
  // Check if task already exists
  const existingTask = await checkTaskExists(data.transactionId)
  if (existingTask) {
    throw new Error(`Task with transaction ID ${data.transactionId} already exists`)
  }

  switch (data.taskType) {
    case 'LIQUIDATION':
      return createLiquidationTask(data, userAddress, verifierService)
    case 'ACQUISITION':
      return createAcquisitionTask(data, userAddress, verifierService)
    case 'AUTHORIZATION':
      return createAuthorizationTask(data, userAddress, verifierService)
    case 'ARBITRAGE':
      return createArbitrageTask(data, userAddress, verifierService)
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

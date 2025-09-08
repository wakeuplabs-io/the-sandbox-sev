import prisma from "@/lib/prisma";
import { keccak256, stringToHex } from "viem";
import { VerifierService } from "@/services/verifier-service";
import { z } from "zod";
import {
  LiquidationTaskInput,
  AcquisitionTaskInput,
  AuthorizationTaskInput,
  ArbitrageTaskInput,
  CreateTaskInput,
  GetTasksQuerySchema,
  GetPublicTasksQuery,
  ExecuteTaskInput,
  BatchExecuteTasksInput,
  ProofData,
} from "./tasks.schema";
import { getPublicHttpsClient } from "@/services/wallet-clients";
import { getWalletHttpsClient } from "@/services/wallet-clients";
import { CHAIN_BY_ENV } from "@/constants";
import env from "@/env";
import { TaskState, TaskType, User } from "@/generated/prisma";
import { BaseTaskNormalizer } from "./normalizers/base-task-normalizer";
import { LiquidationTaskNormalizer } from "./normalizers/liquidation-task-normalizer";
import { AcquisitionTaskNormalizer } from "./normalizers/acquisition-task-normalizer";
import { AuthorizationTaskNormalizer } from "./normalizers/authorization-task-normalizer";
import { ArbitrageTaskNormalizer } from "./normalizers/arbitrage-task-normalizer";

const chain = CHAIN_BY_ENV[env.NODE_ENV];
const contractAddress = env.EXECUTION_VERIFIER_ADDRESS as `0x${string}`;

const publicClient = getPublicHttpsClient(chain);
const walletClient = getWalletHttpsClient(chain);

const verifierService = new VerifierService({
  contractAddress,
  publicClient,
  walletClient,
});

// Tipos para batch operations
export interface NormalizedTask {
  transactionId: string
  taskType: TaskType
  taskData: any
  taskHash: string
  tokenType: string
  chain: string
  platform: string
  typeOfTx: string
  details: string
  priority: string
  userId: number
  [key: string]: any
}

export interface BatchTaskResult {
  successful: any[]
  failed: Array<{
    taskData: any
    error: string
  }>
  summary: {
    total: number
    successful: number
    failed: number
  }
}

// Task Factory
class TaskFactory {
  private normalizers: Map<TaskType, BaseTaskNormalizer> = new Map()
  
  constructor() {
    this.normalizers.set(TaskType.LIQUIDATION, new LiquidationTaskNormalizer())
    this.normalizers.set(TaskType.ACQUISITION, new AcquisitionTaskNormalizer())
    this.normalizers.set(TaskType.AUTHORIZATION, new AuthorizationTaskNormalizer())
    this.normalizers.set(TaskType.ARBITRAGE, new ArbitrageTaskNormalizer())
  }
  
  normalizeTask(data: CreateTaskInput, userId: number): NormalizedTask {
    const normalizer = this.normalizers.get(data.taskType)
    if (!normalizer) {
      throw new Error(`No normalizer found for task type: ${data.taskType}`)
    }
    
    return normalizer.normalize(data, userId)
  }
  
  normalizeTasksBatch(tasksData: CreateTaskInput[], userId: number): NormalizedTask[] {
    return tasksData.map(data => this.normalizeTask(data, userId))
  }
}

// Task Repository
class TaskRepository {
  async createTask(task: NormalizedTask, transactionHash: string): Promise<any> {
    return prisma.task.create({
      data: {
        transactionId: task.transactionId,
        taskType: task.taskType,
        taskData: task.taskData,
        taskHash: task.taskHash,
        transactionHash,
        tokenType: task.tokenType,
        chain: task.chain,
        platform: task.platform,
        typeOfTx: task.typeOfTx,
        details: task.details,
        priority: task.priority,
        userId: task.userId,
        ...this.getSpecificFields(task),
      },
    })
  }
  
  async createTasksBatch(tasks: NormalizedTask[], blockchainTransactionHash: string): Promise<any[]> {
    return prisma.$transaction(
      tasks.map(task => 
        prisma.task.create({
          data: {
            transactionId: task.transactionId,
            taskType: task.taskType,
            taskData: task.taskData,
            taskHash: task.taskHash,
            transactionHash: blockchainTransactionHash, // Hash de la transacción blockchain
            tokenType: task.tokenType,
            chain: task.chain,
            platform: task.platform,
            typeOfTx: task.typeOfTx,
            details: task.details,
            priority: task.priority,
            userId: task.userId,
            ...this.getSpecificFields(task),
          },
        })
      )
    )
  }
  
  async checkTaskExists(transactionId: string): Promise<boolean> {
    const task = await prisma.task.findUnique({
      where: { transactionId },
    })
    return !!task
  }
  
  async checkTasksExist(transactionIds: string[]): Promise<string[]> {
    const existingTasks = await prisma.task.findMany({
      where: { transactionId: { in: transactionIds } },
      select: { transactionId: true },
    })
    return existingTasks.map(t => t.transactionId)
  }
  
  private getSpecificFields(task: NormalizedTask): any {
    switch (task.taskType) {
      case TaskType.LIQUIDATION:
        return {
          companyAndArtist: task.companyAndArtist,
          collectionName: task.collectionName,
          tokenId: task.tokenId,
          targetPriceEth: task.targetPriceEth,
          dateDeadline: task.dateDeadline,
          technicalVerification: task.technicalVerification,
        }
      case TaskType.ACQUISITION:
        return {
          nftName: task.nftName,
          collectionName: task.collectionName,
          tokenId: task.tokenId,
          targetPriceBudget: task.targetPriceBudget,
          transactionExecutionDate: task.transactionExecutionDate,
          priorityDeadline: task.priorityDeadline,
        }
      case TaskType.AUTHORIZATION:
        return {
          collectionName: task.collectionName,
          tokenId: task.tokenId,
          targetPriceBudget: task.targetPriceBudget,
          dateDeadline: task.dateDeadline,
        }
      case TaskType.ARBITRAGE:
        return {
          targetPricePerToken: task.targetPricePerToken,
          amount: task.amount,
          currencyName: task.currencyName,
          proportion: task.proportion,
          duration: task.duration,
          deadline: task.deadline,
        }
      default:
        return {}
    }
  }
}

// Instancias
const taskFactory = new TaskFactory()
const taskRepository = new TaskRepository()

// Constantes
const MAX_BATCH_SIZE = 20

/**
 * Creates a liquidation task
 */
export const createLiquidationTask = async (
  data: LiquidationTaskInput,
  user: User
): Promise<any> => {
  const taskData = { taskType: TaskType.LIQUIDATION, ...data };
  const taskHash = hashTaskData(taskData);

  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: user.address as any,
  });

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
  });

  return task;
};

/**
 * Creates an acquisition task
 */
export const createAcquisitionTask = async (
  data: AcquisitionTaskInput,
  user: User
): Promise<any> => {
  const taskData = { taskType: TaskType.ACQUISITION, ...data };
  const taskHash = hashTaskData(taskData);

  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: user.address as any,
  });

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
  });

  return task;
};

/**
 * Creates an authorization task
 */
export const createAuthorizationTask = async (
  data: AuthorizationTaskInput,
  user: User
): Promise<any> => {
  const taskData = { taskType: TaskType.AUTHORIZATION, ...data };
  const taskHash = hashTaskData(taskData);

  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: user.address as any,
  });

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
  });

  return task;
};

/**
 * Creates an arbitrage task
 */
export const createArbitrageTask = async (data: ArbitrageTaskInput, user: User): Promise<any> => {
  const taskData = { taskType: TaskType.ARBITRAGE, ...data };
  const taskHash = hashTaskData(taskData);

  // Store hash on chain
  const transactionHash = await verifierService.storeHash({
    hash: taskHash as any,
    userAddress: user.address as any,
  });

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
  });

  return task;
};

/**
 * Main function that delegates to specific task type functions
 */
export const createTask = async (data: CreateTaskInput, user: User): Promise<any> => {
  // Check if task already exists
  const existingTask = await checkTaskExists(data.transactionId);
  if (existingTask) {
    throw new Error(`Task with transaction ID ${data.transactionId} already exists`);
  }

  switch (data.taskType) {
    case TaskType.LIQUIDATION:
      return createLiquidationTask(data, user);
    case TaskType.ACQUISITION:
      return createAcquisitionTask(data, user);
    case TaskType.AUTHORIZATION:
      return createAuthorizationTask(data, user);
    case TaskType.ARBITRAGE:
      return createArbitrageTask(data, user);
    default:
      throw new Error(`Invalid task type: ${(data as any).taskType}`);
  }
};

/**
 * Hashes task data using keccak256
 */
const hashTaskData = (taskData: any) => {
  const jsonString = JSON.stringify(taskData, Object.keys(taskData).sort());
  return keccak256(stringToHex(jsonString));
};

/**
 * Checks if a task exists by transaction ID
 */
export const checkTaskExists = async (transactionId: string): Promise<boolean> => {
  const task = await prisma.task.findUnique({
    where: { transactionId },
  });
  return !!task;
};

/**
 * Gets a task by transaction ID
 */
export const getTaskByTransactionId = async (transactionId: string): Promise<any> => {
  return prisma.task.findUnique({
    where: { transactionId },
  });
};

/**
 * Gets all tasks
 */
export const getAllTasks = async (): Promise<any[]> => {
  return prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Gets tasks with filtering and pagination
 */
export const getTasks = async (query: z.infer<typeof GetTasksQuerySchema>) => {
  const { page, limit, taskType, search, dateFrom, dateTo, status, state } = query;

  // Build where clause for filters
  const where: any = {};

  if (taskType) {
    where.taskType = taskType;
  }

  if (search) {
    where.OR = [
      { transactionId: { contains: search, mode: "insensitive" } },
      { taskHash: { contains: search, mode: "insensitive" } },
      { transactionHash: { contains: search, mode: "insensitive" } },
    ];
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      where.createdAt.lte = new Date(dateTo);
    }
  }

  if (status) {
    where.status = status;
  }

  if (state) {
    where.state = state;
  }

  // Get total count for pagination
  const total = await prisma.task.count({ where });

  // Calculate pagination
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  // Get tasks with pagination
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
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
      executionProofs: {
        orderBy: { createdAt: "desc" },
        include: {
          uploadedByUser: {
            select: {
              id: true,
              email: true,
              nickname: true,
            },
          },
        },
      },
    },
  });

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
  };
};

/**
 * Executes a single task by creating proofs and updating state
 */
export const executeTask = async (data: ExecuteTaskInput, user: User): Promise<any> => {
  // Verify task exists and is in STORED state
  const task = await prisma.task.findUnique({
    where: { id: data.taskId },
  });

  if (!task) {
    throw new Error(`Task with ID ${data.taskId} not found`);
  }

  // Create proofs
  const createdProofs = await Promise.all(
    data.proofs.map(async (proofData: ProofData) => {
      return prisma.taskExecutionProof.create({
        data: {
          taskId: data.taskId,
          proofType: proofData.proofType,
          proofValue: proofData.proofValue,
          fileName: proofData.fileName,
          fileSize: proofData.fileSize,
          mimeType: proofData.mimeType,
          uploadedBy: user.id,
        },
      });
    })
  );

  let updatedTask = task;

  if (task.state === TaskState.STORED) {
    // Update task state to EXECUTED
    updatedTask = await prisma.task.update({
      where: { id: data.taskId },
      data: { state: TaskState.EXECUTED },
      include: {
        executionProofs: {
          include: {
            uploadedByUser: true,
          },
        },

        user: {
          select: {
            id: true,
            address: true,
            nickname: true,
            email: true,
          },
        },
      },
    });
  }

  return {
    task: updatedTask,
    proofs: createdProofs,
  };
};

/**
 * Executes multiple tasks in batch
 */
export const batchExecuteTasks = async (data: BatchExecuteTasksInput, user: User): Promise<any> => {
  const results = [];
  const errors = [];

  for (const taskData of data.tasks) {
    try {
      const result = await executeTask(taskData, user);
      results.push(result);
    } catch (error) {
      errors.push({
        taskId: taskData.taskId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    successful: results,
    failed: errors,
    summary: {
      total: data.tasks.length,
      successful: results.length,
      failed: errors.length,
    },
  };
};

/**
 * Gets public executed tasks (no authentication required)
 */
export const getPublicTasks = async (query: GetPublicTasksQuery) => {
  const { page, limit, taskType, search } = query;

  const where: any = {
    state: TaskState.EXECUTED,
  };

  if (taskType) {
    where.taskType = taskType;
  }

  if (search) {
    where.OR = [
      { transactionId: { contains: search, mode: "insensitive" } },
      { collectionName: { contains: search, mode: "insensitive" } },
      { nftName: { contains: search, mode: "insensitive" } },
      { companyAndArtist: { contains: search, mode: "insensitive" } },
    ];
  }

  // Get total count for pagination
  const total = await prisma.task.count({ where });

  // Calculate pagination
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  // Get tasks with pagination - include only public-safe data
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      executionProofs: {
        include: {
          uploadedByUser: true,
        },
      },
      user: {
        select: {
          id: true,
          address: true,
          nickname: true,
          email: true,
        },
      },
    },
  });

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
  };
};

/**
 * Creates multiple tasks in batch
 */
export const batchCreateTasks = async (
  tasksData: CreateTaskInput[], 
  user: User
): Promise<BatchTaskResult> => {
  // Validar tamaño del batch
  if (tasksData.length > MAX_BATCH_SIZE) {
    throw new Error(`Batch size cannot exceed ${MAX_BATCH_SIZE} tasks`)
  }
  
  if (tasksData.length === 0) {
    throw new Error('At least one task is required')
  }
  
  // Normalizar todas las tasks
  const normalizedTasks = taskFactory.normalizeTasksBatch(tasksData, user.id)
  
  // Verificar que no existan tasks duplicadas
  const transactionIds = normalizedTasks.map(t => t.transactionId)
  const existingIds = await taskRepository.checkTasksExist(transactionIds)
  
  if (existingIds.length > 0) {
    throw new Error(`Tasks with transaction IDs already exist: ${existingIds.join(', ')}`)
  }
  
  try {
    // Una sola transacción blockchain
    const hashes = normalizedTasks.map(task => task.taskHash as any)
    const transactionHash = await verifierService.storeHashBatch({
      hashes,
      userAddress: user.address as any,
    })
    
    // Una sola operación de batch en DB
    const createdTasks = await taskRepository.createTasksBatch(normalizedTasks, transactionHash)
    
    return {
      successful: createdTasks,
      failed: [],
      summary: {
        total: tasksData.length,
        successful: createdTasks.length,
        failed: 0,
      },
    }
  } catch (error) {
    // En caso de error, retornar todas como fallidas
    return {
      successful: [],
      failed: tasksData.map((taskData, index) => ({
        taskData,
        error: error instanceof Error ? error.message : 'Unknown error',
      })),
      summary: {
        total: tasksData.length,
        successful: 0,
        failed: tasksData.length,
      },
    }
  }
}

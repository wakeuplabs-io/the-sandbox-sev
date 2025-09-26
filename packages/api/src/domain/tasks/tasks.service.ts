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
import { VaultTaskNormalizer } from "./normalizers/vault-task-normalizer";

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
  transactionId: string;
  taskType: TaskType;
  taskData: any;
  taskHash: string;
  tokenType: string;
  chain: string;
  platform: string;
  typeOfTx: string;
  details: string;
  priority: string;
  userId: number;
  [key: string]: any;
}

export interface BatchTaskResult {
  successful: any[];
  failed: Array<{
    taskData: any;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// Task Factory
class TaskFactory {
  private normalizers: Map<TaskType, BaseTaskNormalizer> = new Map();

  constructor() {
    this.normalizers.set(TaskType.LIQUIDATION, new LiquidationTaskNormalizer());
    this.normalizers.set(TaskType.ACQUISITION, new AcquisitionTaskNormalizer());
    this.normalizers.set(TaskType.AUTHORIZATION, new AuthorizationTaskNormalizer());
    this.normalizers.set(TaskType.ARBITRAGE, new ArbitrageTaskNormalizer());
    this.normalizers.set(TaskType.VAULT, new VaultTaskNormalizer());
  }

  normalizeTask(data: CreateTaskInput, userId: number): NormalizedTask {
    const normalizer = this.normalizers.get(data.taskType);
    if (!normalizer) {
      throw new Error(`No normalizer found for task type: ${data.taskType}`);
    }

    return normalizer.normalize(data, userId);
  }

  normalizeTasksBatch(tasksData: CreateTaskInput[], userId: number): NormalizedTask[] {
    return tasksData.map(data => this.normalizeTask(data, userId));
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
    });
  }

  async createTasksBatch(
    tasks: NormalizedTask[],
    blockchainTransactionHash: string
  ): Promise<any[]> {
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
    );
  }

  async checkTaskExists(transactionId: string): Promise<boolean> {
    const task = await prisma.task.findUnique({
      where: { transactionId },
    });
    return !!task;
  }

  async checkTasksExist(transactionIds: string[]): Promise<string[]> {
    const existingTasks = await prisma.task.findMany({
      where: { transactionId: { in: transactionIds } },
      select: { transactionId: true },
    });
    return existingTasks.map(t => t.transactionId);
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
          tokenLink: task.tokenLink,
        };
      case TaskType.ACQUISITION:
        return {
          nftName: task.nftName,
          collectionName: task.collectionName,
          tokenId: task.tokenId,
          targetPriceBudget: task.targetPriceBudget,
          transactionExecutionDate: task.transactionExecutionDate,
          priorityDeadline: task.priorityDeadline,
          tokenLink: task.tokenLink,
        };
      case TaskType.AUTHORIZATION:
        return {
          collectionName: task.collectionName,
          tokenId: task.tokenId,
          targetPriceBudget: task.targetPriceBudget,
          dateDeadline: task.dateDeadline,
          tokenLink: task.tokenLink,
        };
      case TaskType.ARBITRAGE:
        return {
          targetPricePerToken: task.targetPricePerToken,
          amount: task.amount,
          currencyName: task.currencyName,
          proportion: task.proportion,
          duration: task.duration,
          deadline: task.deadline,
        };
      case TaskType.VAULT:
        return {
          companyAndArtist: task.companyAndArtist,
          collectionName: task.collectionName,
          tokenId: task.tokenId,
          technicalVerification: task.technicalVerification,
        };
      default:
        return {};
    }
  }
}

// Instancias
const taskFactory = new TaskFactory();
const taskRepository = new TaskRepository();

// Constantes
const MAX_BATCH_SIZE = 20;

/**
 * Main function that creates a single task using Factory + Repository pattern
 */
export const createTask = async (data: CreateTaskInput, user: User): Promise<any> => {
  // Check if task already exists
  const existingTask = await taskRepository.checkTaskExists(data.transactionId);
  if (existingTask) {
    throw new Error(`Task with transaction ID ${data.transactionId} already exists`);
  }

  // Normalize task data using factory
  const normalizedTask = taskFactory.normalizeTask(data, user.id);
  
  // Create hash and store on blockchain
  const transactionHash = await verifierService.storeHash({
    hash: normalizedTask.taskHash as any,
    userAddress: user.address as any,
  });

  // Save to database using repository
  return taskRepository.createTask(normalizedTask, transactionHash);
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
  const { page, limit, taskType, search, dateFrom, dateTo, status, state, priority } = query;
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

  if (priority) {
    where.priority = {
      mode: 'insensitive',
      contains: priority,
    };
  }

  const total = await prisma.task.count({ where });

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: {
        select: {
          address: true,
          nickname: true,
        },
      },
      executionProofs: {
        orderBy: { createdAt: "desc" },
        include: {
          uploadedByUser: {
            select: {
              nickname: true,
              address: true,
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
  const task = await prisma.task.findUnique({
    where: { id: data.taskId },
  });

  if (!task) {
    throw new Error(`Task with ID ${data.taskId} not found`);
  }

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
            address: true,
            nickname: true,
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
  const { page, limit, taskType, search, dateFrom, dateTo } = query;

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

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      where.createdAt.lte = new Date(dateTo);
    }
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
          address: true,
          nickname: true,
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
 * Gets public executed tasks as CSV (no authentication required)
 */
export const getPublicTasksCSV = async (query: Omit<GetPublicTasksQuery, 'page' | 'limit'>) => {
  const { taskType, search, dateFrom, dateTo } = query;

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

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      where.createdAt.lte = new Date(dateTo);
    }
  }

  // Get all tasks without pagination - include only public-safe data
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      executionProofs: {
        include: {
          uploadedByUser: {
            select: {
              nickname: true,
              address: true,
            },
          },
        },
      },
      user: {
        select: {
          address: true,
          nickname: true,
        },
      },
    },
  });

  // Generate CSV content
  const csvHeaders = [
    'Transaction ID',
    'Task Type',
    'State',
    'Token Type',
    'Chain',
    'Platform',
    'Type of Transaction',
    'Details',
    'Priority',
    'Created At',
    'Updated At',
    // User fields
    'User Address',
    'User Nickname',
    // Liquidation specific fields
    'Company and Artist',
    'Collection Name',
    'Token ID',
    'Token Link',
    'Target Price ETH',
    'Date Deadline',
    'Technical Verification',
    // Acquisition specific fields
    'NFT Name',
    'Target Price Budget',
    'Transaction Execution Date',
    'Priority Deadline',
    // Arbitrage specific fields
    'Target Price Per Token',
    'Amount',
    'Currency Name',
    'Proportion',
    'Duration',
    'Deadline',
    // Task data (JSON)
    'Task Data',
    'Task Hash',
    'Transaction Hash',
    // Execution proofs summary
    'Execution Proofs Count',
    'Execution Proofs Details'
  ];

  const csvRows = tasks.map(task => {
    const executionProofsDetails = task.executionProofs
      .map(proof => `${proof.proofType}: ${proof.proofValue || 'N/A'} (by ${proof.uploadedByUser?.nickname || 'Unknown'})`)
      .join('; ');

    return [
      task.transactionId,
      task.taskType,
      task.state,
      task.tokenType || '',
      task.chain || '',
      task.platform || '',
      task.typeOfTx || '',
      task.details || '',
      task.priority || '',
      task.createdAt.toISOString(),
      task.updatedAt.toISOString(),
      // User fields
      task.user?.address || '',
      task.user?.nickname || '',
      // Liquidation specific fields
      task.companyAndArtist || '',
      task.collectionName || '',
      task.tokenId || '',
      task.tokenLink || '',
      task.targetPriceEth || '',
      task.dateDeadline || '',
      task.technicalVerification || '',
      // Acquisition specific fields
      task.nftName || '',
      task.targetPriceBudget || '',
      task.transactionExecutionDate || '',
      task.priorityDeadline || '',
      // Arbitrage specific fields
      task.targetPricePerToken || '',
      task.amount || '',
      task.currencyName || '',
      task.proportion || '',
      task.duration || '',
      task.deadline || '',
      // Task data and hashes
      JSON.stringify(task.taskData),
      task.taskHash,
      task.transactionHash,
      // Execution proofs
      task.executionProofs.length.toString(),
      executionProofsDetails
    ];
  });

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCsvValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    csvHeaders.map(escapeCsvValue).join(','),
    ...csvRows.map(row => row.map(value => escapeCsvValue(String(value))).join(','))
  ].join('\n');

  return {
    csvContent,
    totalTasks: tasks.length,
    filename: `tasks-export-${new Date().toISOString().split('T')[0]}.csv`
  };
};

/**
 * Gets admin tasks as CSV (authentication required)
 */
export const getTasksCSV = async (query: Omit<z.infer<typeof GetTasksQuerySchema>, 'page' | 'limit'>) => {
  const { taskType, search, dateFrom, dateTo, status, state, priority } = query;
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

  if (priority) {
    // Use exact match for priority to avoid "High" matching "Super-High"
    where.priority = {
      mode: 'insensitive',
      equals: priority,
    };
  }

  // Get all tasks without pagination - include all data for admin
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      executionProofs: {
        orderBy: { createdAt: "desc" },
        include: {
          uploadedByUser: {
            select: {
              nickname: true,
              address: true,
            },
          },
        },
      },
      user: {
        select: {
          address: true,
          nickname: true,
        },
      },
    },
  });

  // Generate CSV content
  const csvHeaders = [
    'Transaction ID',
    'Task Type',
    'State',
    'Status',
    'Token Type',
    'Chain',
    'Platform',
    'Type of Transaction',
    'Details',
    'Priority',
    'Created At',
    'Updated At',
    // User fields
    'User Address',
    'User Nickname',
    // Liquidation specific fields
    'Company and Artist',
    'Collection Name',
    'Token ID',
    'Token Link',
    'Target Price ETH',
    'Date Deadline',
    'Technical Verification',
    // Acquisition specific fields
    'NFT Name',
    'Target Price Budget',
    'Transaction Execution Date',
    'Priority Deadline',
    // Arbitrage specific fields
    'Target Price Per Token',
    'Amount',
    'Currency Name',
    'Proportion',
    'Duration',
    'Deadline',
    // Task data (JSON)
    'Task Data',
    'Task Hash',
    'Transaction Hash',
    // Execution proofs summary
    'Execution Proofs Count',
    'Execution Proofs Details'
  ];

  const csvRows = tasks.map(task => {
    const executionProofsDetails = task.executionProofs
      .map(proof => `${proof.proofType}: ${proof.proofValue || 'N/A'} (by ${proof.uploadedByUser?.nickname || 'Unknown'})`)
      .join('; ');

    return [
      task.transactionId,
      task.taskType,
      task.state,
      '', // Status field doesn't exist in Task model
      task.tokenType || '',
      task.chain || '',
      task.platform || '',
      task.typeOfTx || '',
      task.details || '',
      task.priority || '',
      task.createdAt.toISOString(),
      task.updatedAt.toISOString(),
      // User fields
      task.user?.address || '',
      task.user?.nickname || '',
      // Liquidation specific fields
      task.companyAndArtist || '',
      task.collectionName || '',
      task.tokenId || '',
      task.tokenLink || '',
      task.targetPriceEth || '',
      task.dateDeadline || '',
      task.taskType === 'VAULT' ? (task.technicalVerification || '') : '',
      // Acquisition specific fields
      task.nftName || '',
      task.targetPriceBudget || '',
      task.transactionExecutionDate || '',
      task.priorityDeadline || '',
      // Arbitrage specific fields
      task.targetPricePerToken || '',
      task.amount || '',
      task.currencyName || '',
      task.proportion || '',
      task.duration || '',
      task.deadline || '',
      // Task data and hashes
      JSON.stringify(task.taskData),
      task.taskHash,
      task.transactionHash,
      // Execution proofs
      task.executionProofs.length.toString(),
      executionProofsDetails
    ];
  });

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCsvValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    csvHeaders.map(escapeCsvValue).join(','),
    ...csvRows.map(row => row.map(value => escapeCsvValue(String(value))).join(','))
  ].join('\n');

  return {
    csvContent,
    totalTasks: tasks.length,
    filename: `admin-tasks-export-${new Date().toISOString().split('T')[0]}.csv`
  };
};

/**
 * Creates multiple tasks in batch
 */
export const batchCreateTasks = async (
  tasksData: CreateTaskInput[],
  user: User
): Promise<BatchTaskResult> => {
  if (tasksData.length > MAX_BATCH_SIZE) {
    throw new Error(`Batch size cannot exceed ${MAX_BATCH_SIZE} tasks`);
  }

  if (tasksData.length === 0) {
    throw new Error("At least one task is required");
  }

  const normalizedTasks = taskFactory.normalizeTasksBatch(tasksData, user.id);

  const transactionIds = normalizedTasks.map(t => t.transactionId);
  const existingIds = await taskRepository.checkTasksExist(transactionIds);

  if (existingIds.length > 0) {
    throw new Error(`Tasks with transaction IDs already exist: ${existingIds.join(", ")}`);
  }

  const hashes = normalizedTasks.map(task => task.taskHash as any);
  const transactionHash = await verifierService.storeHashBatch({
    hashes,
    userAddress: user.address as any,
  });

  const createdTasks = await taskRepository.createTasksBatch(normalizedTasks, transactionHash);

  return {
    successful: createdTasks,
    failed: [],
    summary: {
      total: tasksData.length,
      successful: createdTasks.length,
      failed: 0,
    },
  };
};

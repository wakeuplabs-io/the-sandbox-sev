import { z } from 'zod'

const PRIORITY_VALUES = ['Super-High', 'High', 'Medium', 'Low'] as const
export type TaskPriority = typeof PRIORITY_VALUES[number]

export const LiquidationTaskSchema = z.object({
  transactionId: z.string(),
  companyAndArtist: z.string(),
  collectionName: z.string(),
  tokenId: z.string(),
  tokenType: z.string(),
  chain: z.string(),
  platform: z.string(),
  targetPriceEth: z.string(),
  typeOfTx: z.string(),
  details: z.string(),
  dateDeadline: z.string(),
  priority: z.string(),
  tokenLink: z.string(),
})

export const AcquisitionTaskSchema = z.object({
  transactionId: z.string(),
  nftName: z.string(),
  collectionName: z.string(),
  tokenId: z.string(),
  tokenType: z.string(),
  chain: z.string(),
  platform: z.string(),
  targetPriceBudget: z.string(),
  typeOfTx: z.string(),
  details: z.string(),
  transactionExecutionDate: z.string(),
  priorityDeadline: z.string(),
  priority: z.string(),
  tokenLink: z.string(),
})

export const AuthorizationTaskSchema = z.object({
  transactionId: z.string(),
  collectionName: z.string(),
  tokenId: z.string(),
  tokenType: z.string(),
  chain: z.string(),
  platform: z.string(),
  targetPriceBudget: z.string(),
  typeOfTx: z.string(),
  details: z.string(),
  dateDeadline: z.string(),
  priority: z.string(),
  tokenLink: z.string(),
})

export const ArbitrageTaskSchema = z.object({
  transactionId: z.string(),
  chain: z.string(),
  platform: z.string(),
  targetPricePerToken: z.string(),
  amount: z.string(),
  currencyName: z.string(),
  proportion: z.string(),
  typeOfTx: z.string(),
  details: z.string(),
  duration: z.string(),
  deadline: z.string(),
  priority: z.string(),
})

export const VaultTaskSchema = z.object({
  transactionId: z.string(),
  companyAndArtist: z.string(),
  collectionName: z.string(),
  tokenId: z.string(),
  typeOfTx: z.string(),
  technicalVerification: z.string(),
})

export const CreateTaskSchema = z.discriminatedUnion('taskType', [
  LiquidationTaskSchema.extend({ taskType: z.literal('LIQUIDATION') }),
  AcquisitionTaskSchema.extend({ taskType: z.literal('ACQUISITION') }),
  AuthorizationTaskSchema.extend({ taskType: z.literal('AUTHORIZATION') }),
  ArbitrageTaskSchema.extend({ taskType: z.literal('ARBITRAGE') }),
  VaultTaskSchema.extend({ taskType: z.literal('VAULT') }),
])


export type LiquidationTaskInput = z.infer<typeof LiquidationTaskSchema>
export type AcquisitionTaskInput = z.infer<typeof AcquisitionTaskSchema>
export type AuthorizationTaskInput = z.infer<typeof AuthorizationTaskSchema>
export type ArbitrageTaskInput = z.infer<typeof ArbitrageTaskSchema>
export type VaultTaskInput = z.infer<typeof VaultTaskSchema>
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>

export const GetTasksQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  taskType: z.enum(['LIQUIDATION', 'ACQUISITION', 'AUTHORIZATION', 'ARBITRAGE', 'VAULT']).optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  status: z.string().optional(),
  state: z.enum(['STORED', 'EXECUTED', 'BLOCKED', 'CANCELLED']).optional(),
  priority: z.enum(PRIORITY_VALUES).optional(),
})

export const TasksListResponseSchema = z.object({
  tasks: z.array(z.any()), // Will be the Task model from Prisma
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
})

export const ProofDataSchema = z.object({
  proofType: z.enum(['TEXT', 'IMAGE']),
  proofValue: z.string(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
})

export const ExecuteTaskSchema = z.object({
  taskId: z.string(),
  proofs: z.array(ProofDataSchema).min(1, 'At least one proof is required'),
})

export const BatchExecuteTasksSchema = z.object({
  tasks: z.array(ExecuteTaskSchema).min(1, 'At least one task is required'),
})

export const GetPublicTasksQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  taskType: z.enum(['LIQUIDATION', 'ACQUISITION', 'AUTHORIZATION', 'ARBITRAGE', 'VAULT']).optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export const BatchCreateTasksSchema = z.object({
  tasks: z.array(CreateTaskSchema).min(1, 'At least one task is required').max(20, 'Maximum 20 tasks per batch')
})

export type ProofData = z.infer<typeof ProofDataSchema>
export type ExecuteTaskInput = z.infer<typeof ExecuteTaskSchema>
export type BatchExecuteTasksInput = z.infer<typeof BatchExecuteTasksSchema>
export type BatchCreateTasksInput = z.infer<typeof BatchCreateTasksSchema>
export type GetPublicTasksQuery = z.infer<typeof GetPublicTasksQuerySchema>

import { z } from 'zod'

// Schema para LIQUIDATION (columnas A-M)
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
  technicalVerification: z.string(),
})

// Schema para ACQUISITION (columnas A-M)
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
})

// Schema para AUTHORIZATION (columnas A-K)
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
})

// Schema para ARBITRAGE (columnas A-L)
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

// Schema principal que discrimina por tipo
export const CreateTaskSchema = z.discriminatedUnion('taskType', [
  LiquidationTaskSchema.extend({ taskType: z.literal('LIQUIDATION') }),
  AcquisitionTaskSchema.extend({ taskType: z.literal('ACQUISITION') }),
  AuthorizationTaskSchema.extend({ taskType: z.literal('AUTHORIZATION') }),
  ArbitrageTaskSchema.extend({ taskType: z.literal('ARBITRAGE') }),
])

// Tipos TypeScript
export type LiquidationTaskInput = z.infer<typeof LiquidationTaskSchema>
export type AcquisitionTaskInput = z.infer<typeof AcquisitionTaskSchema>
export type AuthorizationTaskInput = z.infer<typeof AuthorizationTaskSchema>
export type ArbitrageTaskInput = z.infer<typeof ArbitrageTaskSchema>
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>

// Query schema for getting tasks with filters and pagination
export const GetTasksQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  taskType: z.enum(['LIQUIDATION', 'ACQUISITION', 'AUTHORIZATION', 'ARBITRAGE']).optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  status: z.string().optional(),
})

// Response schema for paginated tasks
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

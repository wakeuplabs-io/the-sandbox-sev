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
  targetPriceEth: z.number(),
  typeOfTx: z.string(),
  details: z.string(),
  dateDeadline: z.string(),
  priority: z.enum(['HIGH', 'LOW', 'MEDIUM']),
  technicalVerification: z.boolean(),
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
  priority: z.enum(['HIGH', 'LOW', 'MEDIUM']),
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
  priority: z.enum(['HIGH', 'LOW', 'MEDIUM']),
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
  priority: z.enum(['HIGH', 'LOW', 'MEDIUM']),
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

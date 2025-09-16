import { z } from 'zod'
import { TaskTypeEnum } from '@/shared/constants'
import { ValidationError } from '../types/tasks-new.types'
import { TaskType } from '@the-sandbox-sev/api'

// Schemas Zod para cada tipo de tarea con validaciones estrictas

const LiquidationTaskUISchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  companyAndArtist: z.string().min(1, "Company & Artist is required"),
  collectionName: z.string().min(1, "Collection Name is required"),
  tokenId: z.string().min(1, "Token ID is required"),
  tokenLink: z.string().url("Token Link must be a valid URL"),
  tokenType: z.string().optional(),
  chain: z.string().min(1, "Chain is required"),
  platform: z.string().min(1, "Platform is required"),
  targetPriceEth: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Target Price ETH must be a valid positive number"),
  typeOfTx: z.string().min(1, "Type of TX is required"),
  details: z.string().optional(),
  dateDeadline: z.string().min(1, "Date Deadline is required"),
  priority: z.string().optional(),
  technicalVerification: z.string().refine(val => 
    ['true', 'false', 'TRUE', 'FALSE'].includes(val),
    "Technical Verification must be true or false"
  ),
})

const AcquisitionTaskUISchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  nftName: z.string().min(1, "NFT Name is required"),
  collectionName: z.string().min(1, "Collection Name is required"),
  tokenId: z.string().min(1, "Token ID is required"),
  tokenLink: z.string().url("Token Link must be a valid URL"),
  tokenType: z.string().optional(),
  chain: z.string().min(1, "Chain is required"),
  platform: z.string().min(1, "Platform is required"),
  targetPriceBudget: z.string().min(1, "Target Price Budget is required"),
  typeOfTx: z.string().min(1, "Type of TX is required"),
  details: z.string().optional(),
  transactionExecutionDate: z.string().optional(),
  priorityDeadline: z.string().optional(),
  priority: z.string().min(1, "Priority is required"),
})

const AuthorizationTaskUISchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  collectionName: z.string().min(1, "Collection Name is required"),
  tokenId: z.string().optional(),
  tokenLink: z.string().url("Token Link must be a valid URL").optional().or(z.literal("")),
  tokenType: z.string().optional(),
  chain: z.string().min(1, "Chain is required"),
  platform: z.string().min(1, "Platform is required"),
  targetPriceBudget: z.string().optional(),
  typeOfTx: z.string().min(1, "Type of TX is required"),
  details: z.string().optional(),
  dateDeadline: z.string().optional(),
  priority: z.string().min(1, "Priority is required"),
})

const ArbitrageTaskUISchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  chain: z.string().min(1, "Chain is required"),
  platform: z.string().min(1, "Platform is required"),
  targetPricePerToken: z.string().min(1, "Target Price Per Token is required"),
  amount: z.string().min(1, "Amount is required"),
  currencyName: z.string().min(1, "Currency Name is required"),
  proportion: z.string().refine(val => {
    if (!val || val.trim() === '') return true; // Optional field
    return val.includes('%');
  }, "Proportion should include % symbol").optional(),
  typeOfTx: z.string().min(1, "Type of TX is required"),
  details: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  deadline: z.string().min(1, "Deadline is required"),
  priority: z.string().min(1, "Priority is required"),
})

// Función para obtener el schema correcto según el tipo de tarea
function getSchemaForTaskType(taskType: TaskType) {
  switch (taskType) {
    case TaskTypeEnum.LIQUIDATION:
      return LiquidationTaskUISchema
    case TaskTypeEnum.ACQUISITION:
      return AcquisitionTaskUISchema
    case TaskTypeEnum.AUTHORIZATION:
      return AuthorizationTaskUISchema
    case TaskTypeEnum.ARBITRAGE:
      return ArbitrageTaskUISchema
    default:
      throw new Error(`Unknown task type: ${taskType}`)
  }
}

// Función para convertir errores de Zod a ValidationError[]
function convertZodErrorsToValidationErrors(zodError: z.ZodError, rowIndex: number): ValidationError[] {
  return zodError.issues.map((err: z.ZodIssue) => ({
    rowIndex,
    columnName: err.path[0] as string,
    message: err.message,
    type: 'error' as const
  }))
}

// Función principal de validación (misma interfaz que antes)
export function validateTaskData(data: Record<string, any>, rowIndex: number, taskType: TaskType): ValidationError[] {
  try {
    const schema = getSchemaForTaskType(taskType)
    const result = schema.safeParse(data)
    
    if (result.success) {
      return []
    }
    
    return convertZodErrorsToValidationErrors(result.error, rowIndex)
  } catch (error) {
    console.error(`Error validating task data for row ${rowIndex}:`, error)
    return [{
      rowIndex,
      columnName: 'general',
      message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      type: 'error'
    }]
  }
}

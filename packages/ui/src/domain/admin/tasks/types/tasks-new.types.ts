export type TaskType = 'LIQUIDATION' | 'ACQUISITION' | 'AUTHORIZATION' | 'ARBITRAGE'

export interface ParsedRow {
  rowIndex: number
  transactionId: string
  data: Record<string, any>
  isValid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  rowIndex: number
  columnName: string
  message: string
  type: 'error' | 'warning'
}

export interface TaskTypeConfig {
  name: string
  columns: string[]
  requiredColumns: string[]
}

export const TASK_TYPE_CONFIGS: Record<TaskType, TaskTypeConfig> = {
  LIQUIDATION: {
    name: 'Liquidation',
    columns: [
      'transactionId',
      'companyAndArtist',
      'collectionName',
      'tokenId',
      'tokenType',
      'chain',
      'platform',
      'targetPriceEth',
      'typeOfTx',
      'details',
      'dateDeadline',
      'priority',
      'technicalVerification'
    ],
    requiredColumns: [
      'transactionId',
      'companyAndArtist',
      'collectionName',
      'tokenId',
      'tokenType',
      'chain',
      'platform',
      'targetPriceEth',
      'typeOfTx',
      'dateDeadline',
      'technicalVerification'
    ]
  },
  ACQUISITION: {
    name: 'Acquisition',
    columns: [
      'transactionId',           // A
      'nftName',                 // B
      'collectionName',          // C
      'tokenId',                 // D
      'tokenType',               // E
      'chain',                   // F
      'platform',                // G
      'targetPriceBudget',       // H
      'typeOfTx',                // I
      'details',                 // J
      'transactionExecutionDate', // K
      'priorityDeadline',        // L
      'priority'                 // M
    ],
    requiredColumns: [
      'transactionId',
      'nftName',
      'collectionName',
      'tokenType',
      'chain',
      'platform',
      'targetPriceBudget',
      'typeOfTx',
      'details',
      'priority'
    ]
  },
  AUTHORIZATION: {
    name: 'Authorization',
    columns: [
      'transactionId',           // A
      'collectionName',          // B
      'tokenId',                 // C (Optional)
      'tokenType',               // D (Optional)
      'chain',                   // E
      'platform',                // F
      'targetPriceBudget',       // G (Optional)
      'typeOfTx',                // H
      'details',                 // I
      'dateDeadline',            // J (Optional)
      'priority'                 // K
    ],
    requiredColumns: [
      'transactionId',
      'collectionName',
      // 'tokenId', // Now optional
      // 'tokenType', // Now optional
      'chain',
      'platform',
      // 'targetPriceBudget', // Now optional
      'typeOfTx',
      'details',
      // 'dateDeadline', // Now optional
      'priority'
    ]
  },
  ARBITRAGE: {
    name: 'Arbitrage',
    columns: [
      'transactionId',           // A
      'chain',                   // B
      'platform',                // C
      'targetPricePerToken',     // D
      'amount',                  // E
      'currencyName',            // F
      'proportion',              // G
      'typeOfTx',                // H
      'details',                 // I
      'duration',                // J
      'deadline',                // K
      'priority'                 // L
    ],
    requiredColumns: [
      'transactionId',
      'chain',
      'platform',
      'targetPricePerToken',
      'amount',
      'currencyName',
      'proportion',
      'typeOfTx',
      'details',
      'duration',
      'deadline',
      'priority'
    ]
  }
}

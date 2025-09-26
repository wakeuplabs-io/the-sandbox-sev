import { TaskType } from "@the-sandbox-sev/api"

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
      'tokenLink',
      'tokenType',
      'chain',
      'platform',
      'targetPriceEth',
      'typeOfTx',
      'details',
      'dateDeadline',
      'priority'
    ],
    requiredColumns: [
      'transactionId',
      'companyAndArtist',
      'collectionName',
      'tokenId',
      'tokenLink',
      'tokenType',
      'chain',
      'platform',
      'targetPriceEth',
      'typeOfTx',
      'dateDeadline'
    ]
  },
  ACQUISITION: {
    name: 'Acquisition',
    columns: [
      'transactionId',           // A
      'nftName',                 // B
      'collectionName',          // C
      'tokenId',                 // D
      'tokenLink',               // E
      'tokenType',               // F
      'chain',                   // G
      'platform',                // H
      'targetPriceBudget',       // I
      'typeOfTx',                // J
      'details',                 // K
      'transactionExecutionDate', // L
      'priorityDeadline',        // M
      'priority'                 // N
    ],
    requiredColumns: [
      'transactionId',
      'nftName',
      'collectionName',
      'tokenId',
      'tokenLink',
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
      'tokenLink',               // D (Optional)
      'tokenType',               // E (Optional)
      'chain',                   // F
      'platform',                // G
      'targetPriceBudget',       // H (Optional)
      'typeOfTx',                // I
      'details',                 // J
      'dateDeadline',            // K (Optional)
      'priority'                 // L
    ],
    requiredColumns: [
      'transactionId',
      'collectionName',
      // 'tokenId', // Now optional
      // 'tokenLink', // Now optional
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
  },
  VAULT: {
    name: 'Vault',
    columns: [
      'transactionId',           // A
      'companyAndArtist',        // B
      'collectionName',          // C
      'tokenId',                 // D
      'typeOfTx',                // E
      'technicalVerification'    // F
    ],
    requiredColumns: [
      'transactionId',
      'companyAndArtist',
      'collectionName',
      'tokenId',
      'typeOfTx',
      'technicalVerification'
    ]
  }
}

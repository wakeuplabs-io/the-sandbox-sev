import { ValidationError } from '../types/tasks-new.types'

// Shared validation functions for common fields
function validateTransactionId(data: Record<string, any>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = []
  const transactionId = data.transactionId
  if (!transactionId || transactionId.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'transactionId',
      message: 'Transaction ID is required',
      type: 'error'
    })
  }
  return errors
}

function validatePriority(data: Record<string, any>, rowIndex: number): ValidationError[] {
  // Priority is completely optional - no validation needed
  return []
}

function validateTokenType(data: Record<string, any>, rowIndex: number): ValidationError[] {
  // Token type is completely optional - no validation needed
  return []
}

function validateChain(data: Record<string, any>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = []
  const chain = data.chain
  if (!chain || chain.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'chain',
      message: 'Chain is required',
      type: 'error'
    })
  }
  return errors
}

function validatePlatform(data: Record<string, any>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = []
  const platform = data.platform
  if (!platform || platform.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'platform',
      message: 'Platform is required',
      type: 'error'
    })
  }
  return errors
}

function validateTypeOfTx(data: Record<string, any>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = []
  const typeOfTx = data.typeOfTx
  if (!typeOfTx || typeOfTx.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'typeOfTx',
      message: 'Type of TX is required',
      type: 'error'
    })
  }
  return errors
}

function validateDetails(data: Record<string, any>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = []
  const details = data.details
  if (details && details.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'details',
      message: 'Details cannot be empty if provided',
      type: 'error'
    })
  }
  return errors
}

// Specific validation functions for each task type
function validateLiquidationData(data: Record<string, any>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Common validations
  errors.push(...validateTransactionId(data, rowIndex))
  errors.push(...validateChain(data, rowIndex))
  errors.push(...validatePlatform(data, rowIndex))
  errors.push(...validateTypeOfTx(data, rowIndex))
  errors.push(...validateDetails(data, rowIndex))
  errors.push(...validatePriority(data, rowIndex))
  
  // Liquidation-specific validations
  const companyAndArtist = data.companyAndArtist
  if (!companyAndArtist || companyAndArtist.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'companyAndArtist',
      message: 'Company & Artist is required',
      type: 'error'
    })
  }

  const collectionName = data.collectionName
  if (!collectionName || collectionName.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'collectionName',
      message: 'Collection Name is required',
      type: 'error'
    })
  }

  const tokenId = data.tokenId
  if (!tokenId || tokenId.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'tokenId',
      message: 'Token ID is required',
      type: 'error'
    })
  }

  const tokenType = data.tokenType
  if (tokenType && tokenType.toString().trim() !== '') {
    errors.push(...validateTokenType(data, rowIndex))
  }

  const targetPriceEth = data.targetPriceEth
  if (targetPriceEth !== undefined && targetPriceEth !== null && targetPriceEth !== '') {
    const numValue = parseFloat(targetPriceEth.toString())
    if (isNaN(numValue) || numValue < 0) {
      errors.push({
        rowIndex,
        columnName: 'targetPriceEth',
        message: 'Target Price ETH must be a valid positive number',
        type: 'error'
      })
    }
  }

  const dateDeadline = data.dateDeadline
  if (!dateDeadline || dateDeadline.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'dateDeadline',
      message: 'Date Deadline is required',
      type: 'error'
    })
  }

  const technicalVerification = data.technicalVerification
  if (technicalVerification !== undefined && technicalVerification !== null && technicalVerification !== '') {
    if (typeof technicalVerification !== 'boolean' && !['true', 'false', 'TRUE', 'FALSE'].includes(technicalVerification.toString())) {
      errors.push({
        rowIndex,
        columnName: 'technicalVerification',
        message: 'Technical Verification must be true or false',
        type: 'error'
      })
    }
  }

  return errors
}

function validateAcquisitionData(data: Record<string, any>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Common validations
  errors.push(...validateTransactionId(data, rowIndex))
  errors.push(...validateChain(data, rowIndex))
  errors.push(...validatePlatform(data, rowIndex))
  errors.push(...validateTypeOfTx(data, rowIndex))
  errors.push(...validateDetails(data, rowIndex))
  errors.push(...validatePriority(data, rowIndex))
  
  // Acquisition-specific validations
  const nftName = data.nftName
  if (!nftName || nftName.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'nftName',
      message: 'NFT Name is required',
      type: 'error'
    })
  }

  const collectionName = data.collectionName
  if (!collectionName || collectionName.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'collectionName',
      message: 'Collection Name is required',
      type: 'error'
    })
  }

  const tokenType = data.tokenType
  if (tokenType && tokenType.toString().trim() !== '') {
    errors.push(...validateTokenType(data, rowIndex))
  }

  const targetPriceBudget = data.targetPriceBudget
  if (!targetPriceBudget || targetPriceBudget.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'targetPriceBudget',
      message: 'Target Price Budget is required',
      type: 'error'
    })
  }

  return errors
}

function validateAuthorizationData(data: Record<string, any>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Common validations
  errors.push(...validateTransactionId(data, rowIndex))
  errors.push(...validateChain(data, rowIndex))
  errors.push(...validatePlatform(data, rowIndex))
  errors.push(...validateTypeOfTx(data, rowIndex))
  errors.push(...validateDetails(data, rowIndex))
  errors.push(...validatePriority(data, rowIndex))
  
  // Authorization-specific validations
  const collectionName = data.collectionName
  if (!collectionName || collectionName.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'collectionName',
      message: 'Collection Name is required',
      type: 'error'
    })
  }

  // Optional fields validation (if provided, validate format)
  const tokenType = data.tokenType
  if (tokenType && tokenType.toString().trim() !== '') {
    errors.push(...validateTokenType(data, rowIndex))
  }

  const targetPriceBudget = data.targetPriceBudget
  if (targetPriceBudget && targetPriceBudget.toString().trim() !== '') {
    // Could add price format validation here if needed
  }

  const dateDeadline = data.dateDeadline
  if (dateDeadline && dateDeadline.toString().trim() !== '') {
    // Could add date format validation here if needed
  }

  return errors
}

function validateArbitrageData(data: Record<string, any>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Common validations
  errors.push(...validateTransactionId(data, rowIndex))
  errors.push(...validateChain(data, rowIndex))
  errors.push(...validateTypeOfTx(data, rowIndex))
  errors.push(...validateDetails(data, rowIndex))
  errors.push(...validatePriority(data, rowIndex))
  
  // Arbitrage-specific validations
  const targetPricePerToken = data.targetPricePerToken
  if (!targetPricePerToken || targetPricePerToken.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'targetPricePerToken',
      message: 'Target Price Per Token is required',
      type: 'error'
    })
  }

  const amount = data.amount
  if (!amount || amount.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'amount',
      message: 'Amount is required',
      type: 'error'
    })
  }

  const currencyName = data.currencyName
  if (!currencyName || currencyName.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'currencyName',
      message: 'Currency Name is required',
      type: 'error'
    })
  }

  const proportion = data.proportion
  if (proportion && proportion.toString().trim() !== '') {
    if (!proportion.toString().includes('%')) {
      errors.push({
        rowIndex,
        columnName: 'proportion',
        message: 'Proportion should include % symbol',
        type: 'warning'
      })
    }
  }

  const duration = data.duration
  if (!duration || duration.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'duration',
      message: 'Duration is required',
      type: 'error'
    })
  }

  const deadline = data.deadline
  if (!deadline || deadline.toString().trim() === '') {
    errors.push({
      rowIndex,
      columnName: 'deadline',
      message: 'Deadline is required',
      type: 'error'
    })
  }

  return errors
}

export function validateTaskData(data: Record<string, any>, rowIndex: number, taskType: string): ValidationError[] {
  console.log(`Validating task data for type: "${taskType}" (typeof: ${typeof taskType})`)
  
  switch (taskType) {
    case 'LIQUIDATION':
      return validateLiquidationData(data, rowIndex)
    case 'ACQUISITION':
      return validateAcquisitionData(data, rowIndex)
    case 'AUTHORIZATION':
      return validateAuthorizationData(data, rowIndex)
    case 'ARBITRAGE':
      return validateArbitrageData(data, rowIndex)
    default:
      console.error(`Unknown task type: "${taskType}" (typeof: ${typeof taskType})`)
      return [{
        rowIndex,
        columnName: 'general',
        message: `Unknown task type: ${taskType}`,
        type: 'error'
      }]
  }
}

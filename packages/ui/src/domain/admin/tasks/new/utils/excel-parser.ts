import { TaskTypeEnum } from '@/shared/constants'
import { ParsedRow, TASK_TYPE_CONFIGS } from '../types/tasks-new.types'
import { TaskType } from '@the-sandbox-sev/api'

export function parseExcelData(rawData: string, taskType: TaskType): ParsedRow[] {
  // First, let's clean and normalize the data
  const cleanedData = rawData.trim()
  
  if (cleanedData.length === 0) {
    return []
  }

  const config = TASK_TYPE_CONFIGS[taskType]
  const parsedRows: ParsedRow[] = []

  console.log(`=== PARSER DEBUG ===`)
  console.log(`Input taskType: "${taskType}" (typeof: ${typeof taskType})`)
  console.log(`Config found:`, config)
  console.log(`Raw data length: ${cleanedData.length}`)
  console.log(`First 200 chars: "${cleanedData.substring(0, 200)}"`)
  console.log(`Full raw data:`, cleanedData)

  // Use different parsing strategies for different task types
  switch (taskType) {
    case TaskTypeEnum.ARBITRAGE:
      return parseArbitrageData(cleanedData, config, parsedRows)
    case TaskTypeEnum.ACQUISITION:
      return parseAcquisitionData(cleanedData, config, parsedRows)
    case TaskTypeEnum.LIQUIDATION:
      return parseLiquidationData(cleanedData, config, parsedRows)
    case TaskTypeEnum.AUTHORIZATION:
      return parseAuthorizationData(cleanedData, config, parsedRows)
    default:
      console.error(`Unknown task type: ${taskType}`)
      return []
  }
}

function parseArbitrageData(cleanedData: string, config: any, parsedRows: ParsedRow[]): ParsedRow[] {
  console.log('Using ARBITRAGE-specific parsing logic')
  
  // Split by lines and group them into rows
  const lines = cleanedData
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  console.log(`Total lines after split: ${lines.length}`)

  let currentRowLines: string[] = []
  let rowIndex = 0
  const expectedTabs = config.columns.length - 1 // Number of tabs needed for a complete row

  lines.forEach((line, index) => {
    console.log(`Line ${index}: "${line}"`)
    
    const tabCount = (line.match(/\t/g) || []).length
    console.log(`  tabCount: ${tabCount}, expectedTabs: ${expectedTabs}`)
    
    // If we have accumulated lines and this line has enough tabs for a complete row,
    // process the previous row first
    if (tabCount >= expectedTabs && currentRowLines.length > 0) {
      console.log(`Processing previous row ${rowIndex}:`, currentRowLines)
      processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.ARBITRAGE)
      currentRowLines = []
      rowIndex++
    }
    
    // Only add lines that have meaningful content (not just quotes or empty content)
    if (line.trim() !== '"' && line.trim().length > 1) {
      currentRowLines.push(line)
    } else {
      console.log(`  Skipping line with insufficient content: "${line}"`)
    }
    
    // If this line is complete, process it immediately
    if (tabCount >= expectedTabs && currentRowLines.length > 0) {
      console.log(`Processing complete row ${rowIndex}:`, currentRowLines)
      processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.ARBITRAGE)
      currentRowLines = []
      rowIndex++
    }
  })

  // Process any remaining incomplete row
  if (currentRowLines.length > 0) {
    console.log(`Processing final incomplete row ${rowIndex}:`, currentRowLines)
    processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.ARBITRAGE)
  }

  console.log(`Total rows parsed: ${parsedRows.length}`)
  return parsedRows
}

function parseAcquisitionData(cleanedData: string, config: any, parsedRows: ParsedRow[]): ParsedRow[] {
  console.log('Using ACQUISITION-specific parsing logic')
  
  // Split by lines and group them into rows
  const lines = cleanedData
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  console.log(`Total lines after split: ${lines.length}`)

  let currentRowLines: string[] = []
  let rowIndex = 0
  const expectedTabs = config.columns.length - 1 // Number of tabs needed for a complete row

  lines.forEach((line, index) => {
    console.log(`Line ${index}: "${line}"`)
    
    const tabCount = (line.match(/\t/g) || []).length
    console.log(`  tabCount: ${tabCount}, expectedTabs: ${expectedTabs}`)
    
    // If we have accumulated lines and this line has enough tabs for a complete row,
    // process the previous row first
    if (tabCount >= expectedTabs && currentRowLines.length > 0) {
      console.log(`Processing previous row ${rowIndex}:`, currentRowLines)
      processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.ACQUISITION)
      currentRowLines = []
      rowIndex++
    }
    
    // Add this line to current row (skip empty or meaningless lines)
    if (line.trim() !== '"' && line.trim().length > 1) {
      currentRowLines.push(line)
    } else {
      console.log(`  Skipping line with insufficient content: "${line}"`)
    }
    
    // If this line is complete, process it immediately
    if (tabCount >= expectedTabs && currentRowLines.length > 0) {
      console.log(`Processing complete row ${rowIndex}:`, currentRowLines)
      processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.ACQUISITION)
      currentRowLines = []
      rowIndex++
    }
  })

  // Process any remaining incomplete row
  if (currentRowLines.length > 0) {
    console.log(`Processing final incomplete row ${rowIndex}:`, currentRowLines)
    processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.ACQUISITION)
  }

  console.log(`Total rows parsed: ${parsedRows.length}`)
  return parsedRows
}

function parseLiquidationData(cleanedData: string, config: any, parsedRows: ParsedRow[]): ParsedRow[] {
  console.log('Using LIQUIDATION-specific parsing logic')
  
  // Split by lines and group them into rows
  const lines = cleanedData
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  console.log(`Total lines after split: ${lines.length}`)

  let currentRowLines: string[] = []
  let rowIndex = 0
  const expectedTabs = config.columns.length - 1 // Number of tabs needed for a complete row

  lines.forEach((line, index) => {
    console.log(`Line ${index}: "${line}"`)
    
    const tabCount = (line.match(/\t/g) || []).length
    console.log(`  tabCount: ${tabCount}, expectedTabs: ${expectedTabs}`)
    
    // If we have accumulated lines and this line has enough tabs for a complete row,
    // process the previous row first
    if (tabCount >= expectedTabs && currentRowLines.length > 0) {
      console.log(`Processing previous row ${rowIndex}:`, currentRowLines)
      processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.LIQUIDATION)
      currentRowLines = []
      rowIndex++
    }
    
    // Only add lines that have meaningful content (not just quotes or empty content)
    if (line.trim() !== '"' && line.trim().length > 1) {
      currentRowLines.push(line)
    } else {
      console.log(`  Skipping line with insufficient content: "${line}"`)
    }
    
    // If this line is complete, process it immediately
    if (tabCount >= expectedTabs && currentRowLines.length > 0) {
      console.log(`Processing complete row ${rowIndex}:`, currentRowLines)
      processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.LIQUIDATION)
      currentRowLines = []
      rowIndex++
    }
  })

  // Process any remaining incomplete row
  if (currentRowLines.length > 0) {
    console.log(`Processing final incomplete row ${rowIndex}:`, currentRowLines)
    processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.LIQUIDATION)
  }

  console.log(`Total rows parsed: ${parsedRows.length}`)
  return parsedRows
}

function parseAuthorizationData(cleanedData: string, config: any, parsedRows: ParsedRow[]): ParsedRow[] {
  console.log('Using AUTHORIZATION-specific parsing logic')
  
  // First, let's try to identify complete rows by looking for transaction ID patterns
  // This helps us handle multi-line content within cells
  const transactionIdPattern = /^\d{4}_Authorization\d*_/
  
  // Split by lines but be smarter about multi-line content
  const lines = cleanedData.split('\n')
  console.log(`Total lines after split: ${lines.length}`)

  let currentRowLines: string[] = []
  let rowIndex = 0
  const expectedTabs = config.columns.length - 1 // Number of tabs needed for a complete row

  lines.forEach((line, index) => {
    console.log(`Line ${index}: "${line}"`)
    
    const tabCount = (line.match(/\t/g) || []).length
    const isNewTransaction = transactionIdPattern.test(line.trim())
    
    console.log(`  tabCount: ${tabCount}, expectedTabs: ${expectedTabs}, isNewTransaction: ${isNewTransaction}`)
    
    // If this is a new transaction and we have accumulated lines, process the previous row
    if (isNewTransaction && currentRowLines.length > 0) {
      console.log(`Processing previous row ${rowIndex}:`, currentRowLines)
      processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.AUTHORIZATION)
      currentRowLines = []
      rowIndex++
    }
    
    // Add this line to current row (skip empty lines)
    if (line.trim().length > 0) {
      currentRowLines.push(line)
    }
    
    // If this line has enough tabs and is a new transaction, process it immediately
    if (tabCount >= expectedTabs && isNewTransaction && currentRowLines.length > 0) {
      console.log(`Processing complete row ${rowIndex}:`, currentRowLines)
        processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.AUTHORIZATION)
      currentRowLines = []
      rowIndex++
    }
  })

  // Process any remaining incomplete row
  if (currentRowLines.length > 0) {
    console.log(`Processing final incomplete row ${rowIndex}:`, currentRowLines)
    processRow(currentRowLines.join('\n'), rowIndex, config, parsedRows, TaskTypeEnum.AUTHORIZATION)
  }

  console.log(`Total rows parsed: ${parsedRows.length}`)
  return parsedRows
}

// Removed parseGenericData function as all task types now use specific parsing logic

function processRow(rowData: string, rowIndex: number, config: any, parsedRows: ParsedRow[], taskType: TaskType) {
  console.log(`processRow called with taskType: "${taskType}" (typeof: ${typeof taskType})`)
  
  try {
    // Split by tabs and clean values
    const values = rowData.split('\t').map(val => val.trim())
    
    console.log(`Row ${rowIndex} values:`, values)
    
    // Take only the columns we need (in the correct order)
    const neededColumns = config.columns.length
    const availableValues = values.slice(0, neededColumns)
    
    // Fill missing columns with empty strings if we don't have enough
    while (availableValues.length < neededColumns) {
      availableValues.push('')
    }
    
    // Map values to column names
    const data: Record<string, any> = {}
    config.columns.forEach((columnName: string, colIndex: number) => {
      data[columnName] = availableValues[colIndex] || ''
    })

    console.log(`Row ${rowIndex} mapped data:`, data)

    // Extract transaction ID for identification
    const transactionId = data.transactionId || `row_${rowIndex}`

    parsedRows.push({
      rowIndex,
      transactionId,
      data,
      isValid: true, // Will be validated later
      errors: []
    })
  } catch (error) {
    console.error(`Error processing row ${rowIndex}:`, error)
    parsedRows.push({
      rowIndex,
      transactionId: `row_${rowIndex}`,
      data: {},
      isValid: false,
      errors: [{
        rowIndex,
        columnName: 'general',
        message: `Error parsing this row: ${error}`,
        type: 'error'
      }]
    })
  }
}

import { ParsedRow, ValidationError, TASK_TYPE_CONFIGS } from '../types/tasks-new.types'
import { FaExclamationTriangle } from 'react-icons/fa'
import { TaskType } from '@the-sandbox-sev/api'

interface DataPreviewTableProps {
  data: ParsedRow[]
  errors: ValidationError[]
  taskType: TaskType
}

export function DataPreviewTable({ data, errors, taskType }: DataPreviewTableProps) {
  const config = TASK_TYPE_CONFIGS[taskType]
  
  // Group errors by row and column
  const errorMap = new Map<string, ValidationError[]>()
  errors.forEach(error => {
    const key = `${error.rowIndex}-${error.columnName}`
    if (!errorMap.has(key)) {
      errorMap.set(key, [])
    }
    errorMap.get(key)!.push(error)
  })

  const getCellErrors = (rowIndex: number, columnName: string): ValidationError[] => {
    const key = `${rowIndex}-${columnName}`
    return errorMap.get(key) || []
  }

  const hasRowErrors = (rowIndex: number): boolean => {
    return errors.some(error => error.rowIndex === rowIndex)
  }

  const getCellClassName = (rowIndex: number, columnName: string): string => {
    const cellErrors = getCellErrors(rowIndex, columnName)
    const hasError = cellErrors.some(error => error.type === 'error')
    const hasWarning = cellErrors.some(error => error.type === 'warning')
    
    if (hasError) {
      return 'bg-error/10 border-error/50'
    }
    if (hasWarning) {
      return 'bg-warning/10 border-warning/50'
    }
    return ''
  }

  const getRowClassName = (rowIndex: number): string => {
    const hasErrors = hasRowErrors(rowIndex)
    return hasErrors ? 'border-l-4 border-l-error' : ''
  }

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '-'
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false'
    }
    return value.toString()
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex gap-4 text-sm">
        <div className="badge badge-neutral">
          {data.length} total row{data.length !== 1 ? 's' : ''}
        </div>
        <div className="badge badge-success">
          {data.filter(row => row.isValid).length} valid
        </div>
        <div className="badge badge-error">
          {data.filter(row => !row.isValid).length} invalid
        </div>
        {errors.length > 0 && (
          <div className="badge badge-warning">
            {errors.length} error{errors.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-16">Row</th>
              {config.columns.map((column) => (
                <th key={column} className="text-xs">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.rowIndex} className={getRowClassName(row.rowIndex)}>
                <td className="text-xs font-mono">
                  {row.rowIndex + 1}
                </td>
                {config.columns.map((column) => {
                  const cellErrors = getCellErrors(row.rowIndex, column)
                  const value = row.data[column] || ''
                  
                  return (
                    <td 
                      key={column} 
                      className={`relative ${getCellClassName(row.rowIndex, column)}`}
                    >
                      <div className="text-xs">
                        {formatCellValue(value)}
                      </div>
                      
                      {/* Error indicator */}
                      {cellErrors.length > 0 && (
                        <div className="absolute -top-1 -right-1">
                          <div className="badge badge-error badge-xs">
                            {cellErrors.length}
                          </div>
                        </div>
                      )}
                      
                      {/* Error tooltip */}
                      {cellErrors.length > 0 && (
                        <div className="tooltip tooltip-left" data-tip={cellErrors.map(e => e.message).join(', ')}>
                          <div className="absolute inset-0 cursor-help"></div>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error details */}
      {errors.length > 0 && (
        <div className="alert alert-error">
          <FaExclamationTriangle className="stroke-current shrink-0 h-6 w-6" />
          <div>
            <h3 className="font-bold">Validation Errors</h3>
            <div className="text-xs space-y-1">
              {errors.map((error, index) => (
                <div key={index}>
                  <strong>Row {error.rowIndex + 1}, {error.columnName}:</strong> {error.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

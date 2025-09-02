import { TaskType, TASK_TYPE_CONFIGS } from '../../types/tasks-new.types'
import { FaInfoCircle } from 'react-icons/fa'

interface ExcelInputProps {
  value: string
  onChange: (value: string) => void
  taskType: TaskType
  validationStatus: 'idle' | 'validating' | 'valid' | 'invalid'
  parsedRowCount?: number // Add this prop to get the actual parsed row count
}

export function ExcelInput({ value, onChange, taskType, validationStatus, parsedRowCount }: ExcelInputProps) {
  const config = TASK_TYPE_CONFIGS[taskType]
  
  // Use the actual parsed row count if available, otherwise fallback to line count
  const displayRowCount = parsedRowCount !== undefined ? parsedRowCount : 
    (value ? value.split('\n').filter(line => line.trim()).length : 0)

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'validating':
        return 'border-warning'
      case 'valid':
        return 'border-success'
      case 'invalid':
        return 'border-error'
      default:
        return 'border-base-300'
    }
  }

  const getStatusText = () => {
    switch (validationStatus) {
      case 'validating':
        return 'Validating...'
      case 'valid':
        return 'Valid data'
      case 'invalid':
        return 'Invalid data'
      default:
        return 'Paste your Excel data here'
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-base-content/70">
        <p>Expected columns for <strong>{config.name}</strong> tasks:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {config.columns.map((column) => (
            <span
              key={column}
              className="px-2 py-1 bg-base-200 rounded text-xs font-mono"
            >
              {column}
            </span>
          ))}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste your Excel data here...
          
Example format:
Transaction ID | Company & Artist | Collection Name | Token ID | Token Type | Chain | Platform | Target Price ETH | Type of TX | Details | Date Deadline | Priority | Technical Verification

0001_Liquidation_Potatoz | Potatoz #5056 | Potatoz | #5056 | ERC721 | ETH | Opensea | 0.24 | Public List |  | 14/05/2025 | HIGH | true`}
          className={`
            textarea textarea-bordered w-full h-64 font-mono text-sm
            ${getStatusColor()}
          `}
        />
        
        <div className="absolute top-2 right-2">
          <div className={`
            badge badge-sm
            ${validationStatus === 'validating' ? 'badge-warning' : ''}
            ${validationStatus === 'valid' ? 'badge-success' : ''}
            ${validationStatus === 'invalid' ? 'badge-error' : ''}
            ${validationStatus === 'idle' ? 'badge-neutral' : ''}
          `}>
            {getStatusText()}
          </div>
        </div>
      </div>

      {displayRowCount > 0 && (
        <div className="text-sm text-base-content/70">
          Detected {displayRowCount} row{displayRowCount !== 1 ? 's' : ''} of data
        </div>
      )}

      <div className="alert alert-info">
        <FaInfoCircle className="stroke-current shrink-0 w-6 h-6" />
        <div>
          <h3 className="font-bold">Instructions</h3>
          <div className="text-xs">
            <p>1. Copy multiple rows from your Excel file</p>
            <p>2. Paste them in the textarea above</p>
            <p>3. The system will automatically parse and validate the data</p>
            <p>4. Review the preview table below before submitting</p>
          </div>
        </div>
      </div>
    </div>
  )
}

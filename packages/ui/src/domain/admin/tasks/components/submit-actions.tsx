import { FaPlus, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'

interface SubmitActionsProps {
  onSubmit: () => void
  hasErrors: boolean
  validTasksCount: number
  totalTasksCount: number
}

export function SubmitActions({ onSubmit, hasErrors, validTasksCount, totalTasksCount }: SubmitActionsProps) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-semibold">Ready to create:</span>
          <span className="ml-2 badge badge-success">
            {validTasksCount} of {totalTasksCount} tasks
          </span>
        </div>
        
        {hasErrors && (
          <div className="text-sm text-error">
            Please fix validation errors before submitting
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="flex gap-4">
        <button
          onClick={onSubmit}
          disabled={hasErrors || validTasksCount === 0}
          className={`
            btn btn-primary
            ${hasErrors || validTasksCount === 0 ? 'btn-disabled' : ''}
          `}
        >
          <FaPlus className="h-5 w-5" />
          Create {validTasksCount} Task{validTasksCount !== 1 ? 's' : ''}
        </button>

        {hasErrors && (
          <div className="alert alert-warning">
            <FaExclamationTriangle className="stroke-current shrink-0 h-6 w-6" />
            <div>
              <h3 className="font-bold">Cannot Submit</h3>
              <div className="text-xs">
                There are validation errors that need to be fixed before you can create tasks.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="alert alert-info">
        <FaInfoCircle className="stroke-current shrink-0 w-6 h-6" />
        <div>
          <h3 className="font-bold">What happens next?</h3>
          <div className="text-xs">
            <p>1. Tasks will be created in the database</p>
            <p>2. Each task will be hashed and stored on the blockchain</p>
            <p>3. You'll receive confirmation for each successful task creation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

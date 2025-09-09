import { FaPlus, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

interface SubmitActionsProps {
  onSubmit: () => void;
  validTasksCount: number;
  totalTasksCount: number;
  isLoading?: boolean;
  canSubmit?: boolean;
  exceedsBatchLimit?: boolean;
  maxBatchSize?: number;
}

export function SubmitActions({
  onSubmit,
  validTasksCount,
  totalTasksCount,
  isLoading = false,
  canSubmit = true,
  exceedsBatchLimit = false,
  maxBatchSize = 20,
}: SubmitActionsProps) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-semibold">Ready to create:</span>
          <span className="ml-2 badge badge-success">
            {validTasksCount} of {totalTasksCount} tasks
          </span>
          {validTasksCount > 0 && (
            <span className="ml-2 badge badge-info">
              {validTasksCount === 1 ? "Individual" : "Batch"} method
            </span>
          )}
        </div>

        {exceedsBatchLimit && (
          <div className="text-sm text-error">
            Too many tasks! Maximum {maxBatchSize} tasks per batch
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="flex gap-4">
        <button
          onClick={onSubmit}
          disabled={!canSubmit || isLoading}
          className={`
            btn btn-primary
            ${!canSubmit || isLoading ? "btn-disabled" : ""}
          `}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {validTasksCount === 1
                ? "Creating Task..."
                : `Creating ${validTasksCount} Tasks in Batch...`}
            </>
          ) : (
            <>
              <FaPlus className="h-5 w-5" />
              Create {validTasksCount} Task{validTasksCount !== 1 ? "s" : ""}
            </>
          )}
        </button>

        {exceedsBatchLimit && (
          <div className="alert alert-error">
            <FaExclamationTriangle className="stroke-current shrink-0 h-6 w-6" />
            <div>
              <h3 className="font-bold">Too Many Tasks</h3>
              <div className="text-xs">
                You have {validTasksCount} valid tasks, but the maximum batch size is {maxBatchSize}
                . Please reduce the number of valid tasks or split them into multiple batches.
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
            {validTasksCount === 1 ? (
              <>
                <p>1. Task will be created in the database</p>
                <p>2. Task will be hashed and stored on the blockchain</p>
                <p>3. You'll receive confirmation for successful task creation</p>
              </>
            ) : (
              <>
                <p>1. All tasks will be created in a single batch operation</p>
                <p>2. All task hashes will be stored on blockchain in one transaction</p>
                <p>3. You'll receive confirmation for the entire batch</p>
                <p className="text-warning">⚠️ Maximum {maxBatchSize} tasks per batch</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

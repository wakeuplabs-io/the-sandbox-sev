import { FaFilter, FaTrash, FaPlay } from "react-icons/fa";

interface BatchActionsPanelProps {
  readyTasksCount: number;
  isExecuting: boolean;
  onExecuteAll: () => void;
  onClearAllProofs: () => void;
}

export function BatchActionsPanel({
  readyTasksCount,
  isExecuting,
  onExecuteAll,
  onClearAllProofs,
}: BatchActionsPanelProps) {
  const isReadyTasksPlural = readyTasksCount !== 1;

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FaFilter className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">
              {readyTasksCount}{" "}
              stored task{isReadyTasksPlural ? "s" : ""}{" "}
              ready for execution
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClearAllProofs}
              className="btn btn-outline btn-sm"
              disabled={isExecuting}
            >
              <FaTrash className="h-4 w-4 mr-2" />
              Clear All Proofs
            </button>
            <button
              onClick={onExecuteAll}
              className="btn btn-primary btn-sm"
              disabled={isExecuting}
            >
              <FaPlay className="h-4 w-4 mr-2" />
              {isExecuting ? "Executing..." : "Execute All Ready Tasks"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

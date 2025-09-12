import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { clsx } from "clsx";
import { ProofUploadArea } from "./proof-upload-area";
import { TaskActionButtons } from "./task-action-buttons";
import type { Task } from "@the-sandbox-sev/api";
import { useTaskPriority } from "@/hooks/use-task-priority";
import { useTaskExecution } from "../hooks/use-task-execution";
import { formatDate } from "@/shared/lib/utils";
import { TaskStateLabelEnum } from "@/shared/constants";

interface TaskExecutionCardProps {
  task: Task;
  onProofReady: (hasProof: boolean) => void;
  onProofsChange?: (proofs: any[]) => void;
  onViewTask: (task: Task) => void;
  clearInputsRef?: any | null;
  taskProofs?: any[];
}

export function TaskExecutionCard({
  task,
  onProofReady,
  onProofsChange,
  onViewTask,
  clearInputsRef,
  taskProofs,
}: TaskExecutionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasProof, setHasProof] = useState(false);
  const { getPriorityBadgeClasses } = useTaskPriority();
  const { executeTask, isExecuting } = useTaskExecution();

  const proofUploadClearRef = useRef<any | null>(null);

  useEffect(() => {
    if (clearInputsRef) {
      clearInputsRef.current = () => {
        if (proofUploadClearRef.current) {
          proofUploadClearRef.current();
        }
      };
    }
  }, [clearInputsRef]);

  const handleProofChange = (hasProofData: boolean) => {
    setHasProof(hasProofData);
    onProofReady(hasProofData);
  };

  const handleProofsChange = (newProofs: any[]) => {
    handleProofChange(newProofs.length > 0);
    onProofsChange?.(newProofs);
  };

  const handleExecuteTask = async () => {
    const currentProofs = taskProofs || [];
    if (currentProofs.length === 0) return;
    const result = await executeTask(task.id, currentProofs);
    if (result) {
      // Clear the proofs from the input area
      if (proofUploadClearRef.current) {
        proofUploadClearRef.current();
      }
    }
  };

  return (
    <div className="border border-[#ffffff1a] rounded-[8px] hover:bg-gray-800/70 transition-colors duration-200">
      <div className="p-4">
        {/* Header - Always visible */}
        <div
          className="cursor-pointer hover:bg-gray-700/30 rounded-lg p-2 -m-2 transition-colors duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="grid grid-cols-12 items-center gap-4">
            {/* Expand/Collapse Icon */}
            <div className="col-span-1 flex justify-center">
              {isExpanded ? (
                <FaChevronDown className="h-4 w-4 text-base-content/60" />
              ) : (
                <FaChevronRight className="h-4 w-4 text-base-content/60" />
              )}
            </div>

            {/* Transaction ID */}
            <div className="col-span-3 overflow-hidden text-ellipsis">
              <span className="font-mono text-sm font-semibold ">{task.transactionId}</span>
            </div>

            {/* Task Type - Clean text with color indicator */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/80 font-medium">{task.taskType}</span>
              </div>
            </div>

            {/* Priority - Icon + text only */}
            <div className="col-span-2">
              {task.priority && (
                <div className="flex items-center gap-1">
                  <span className={clsx("badge text-xs", getPriorityBadgeClasses(task.priority))}>{task.priority}</span>
                </div>
              )}
            </div>

            {/* State Badge - Only badge we keep */}
            <div className="col-span-2">
              <span className={clsx("badge text-xs badge-outline")}>
                {TaskStateLabelEnum[task.state as keyof typeof TaskStateLabelEnum]}
              </span>
            </div>

            {/* View Details Button */}
            <div className="col-span-2 flex justify-end">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onViewTask(task);
                }}
                className="btn btn-ghost btn-sm"
                title="View Task Details"
              >
                View More
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4 pt-4 border-t border-gray-700/30 space-y-4">
            {/* Task Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-base-content/70">Task ID:</span>
                <span className="ml-2 font-mono">{task.id}</span>
              </div>
              <div>
                <span className="font-semibold text-base-content/70">Created:</span>
                <span className="ml-2">{formatDate(task.createdAt)}</span>
              </div>
              {task.chain && (
                <div>
                  <span className="font-semibold text-base-content/70">Chain:</span>
                  <span className="ml-2">{task.chain}</span>
                </div>
              )}
              {task.platform && (
                <div>
                  <span className="font-semibold text-base-content/70">Platform:</span>
                  <span className="ml-2">{task.platform}</span>
                </div>
              )}
            </div>

            {/* Proof Upload Area - Show for all tasks */}
            <ProofUploadArea
              taskId={task.id}
              onProofChange={handleProofChange}
              onProofsChange={handleProofsChange}
              clearInputsRef={proofUploadClearRef}
            />

            {/* Action Buttons - Different based on task state */}
            <TaskActionButtons
              task={task}
              hasProof={hasProof}
              isExecuting={isExecuting}
              onExecute={handleExecuteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

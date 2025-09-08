import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronRight, FaPlay, FaEye } from "react-icons/fa";
import { clsx } from "clsx";
import { ProofUploadArea } from "./proof-upload-area";
import type { Task } from "@the-sandbox-sev/api";
import { useTaskPriority } from "@/hooks/use-task-priority";
import { TaskStateEnum } from "@/shared/constants";
import { useTaskStateColors } from "@/hooks/use-task-state-colors";
import { useTaskExecution } from "../hooks/use-task-execution";

interface TaskExecutionCardProps {
  task: Task;
  onProofReady: (hasProof: boolean) => void;
  onProofsChange?: (proofs: any[]) => void;
  onViewTask: (task: Task) => void;
  clearInputsRef?: React.MutableRefObject<(() => void) | null>;
  taskProofs?: any[];
}

export function TaskExecutionCard({ task, onProofReady, onProofsChange, onViewTask, clearInputsRef, taskProofs }: TaskExecutionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasProof, setHasProof] = useState(false);
  const { getTaskStateBadgeClasses } = useTaskStateColors();
  const { getPriorityIcon, getPriorityIconClass } = useTaskPriority();
  const { executeTask, isExecuting } = useTaskExecution();
  
  const proofUploadClearRef = useRef<(() => void) | null>(null);

  // Expose clear function to parent
  useEffect(() => {
    if (clearInputsRef) {
      clearInputsRef.current = () => {
        // Clear the proof upload area inputs
        if (proofUploadClearRef.current) {
          proofUploadClearRef.current()
        }
      }
    }
  }, [clearInputsRef])

  const handleProofChange = (hasProofData: boolean) => {
    setHasProof(hasProofData);
    onProofReady(hasProofData);
  };

  const handleProofsChange = (newProofs: any[]) => {
    handleProofChange(newProofs.length > 0);
    onProofsChange?.(newProofs);
  };

  const handleExecuteTask = () => {
    console.log("Executing task:", task.id);
    // TODO: Implement individual task execution
  };

  const handleAddProofToExecuted = async () => {
    if (!hasProof) return;
    
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

  const IconComponent = getPriorityIcon(task.priority);

  // Determine if task can be executed
  const canExecute = task.state === TaskStateEnum.STORED;

  return (
    <div className=" border border-gray-700/30 rounded-lg hover:bg-gray-800/70 transition-colors duration-200">
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
            <div className="col-span-3">
              <span className="font-mono text-sm font-semibold">{task.transactionId}</span>
            </div>

            {/* Task Type - Clean text with color indicator */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span className="text-sm text-base-content/80 font-medium">{task.taskType}</span>
              </div>
            </div>

            {/* Priority - Icon + text only */}
            <div className="col-span-2">
              {task.priority && (
                <div className="flex items-center gap-1">
                  {IconComponent ? (
                    <IconComponent className={clsx("h-4 w-4", getPriorityIconClass(task.priority))} />
                  ) : null}
                  <span className="text-sm text-base-content/80">{task.priority}</span>
                </div>
              )}
            </div>

            {/* State Badge - Only badge we keep */}
            <div className="col-span-2">
              <span className={clsx("badge text-xs", getTaskStateBadgeClasses(task.state as any))}>
                {task.state}
              </span>
            </div>

            {/* View Details Button */}
            <div className="col-span-2 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onViewTask(task)
                }}
                className="btn btn-ghost btn-sm"
                title="View Task Details"
              >
                <FaEye className="h-4 w-4" />
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
                <span className="ml-2">{new Date(task.createdAt).toLocaleString()}</span>
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
            {hasProof && (
              <div className="flex justify-end pt-2">
                {canExecute ? (
                  <button onClick={handleExecuteTask} className="btn btn-primary btn-sm">
                    <FaPlay className="h-4 w-4 mr-2" />
                    Execute This Task
                  </button>
                ) : task.state === TaskStateEnum.EXECUTED ? (
                  <button 
                    onClick={handleAddProofToExecuted} 
                    className="btn btn-secondary btn-sm"
                    disabled={isExecuting}
                  >
                    <FaPlay className="h-4 w-4 mr-2" />
                    {isExecuting ? 'Adding Proof...' : 'Add Proof to Executed Task'}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

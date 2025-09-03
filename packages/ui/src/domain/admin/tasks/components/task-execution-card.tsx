import { useState } from 'react'
import { FaChevronDown, FaChevronRight, FaPlay, FaCheck, FaTimes } from 'react-icons/fa'
import { clsx } from 'clsx'
import { useTaskTypeColors } from '@/hooks/use-task-type-colors'
import { ProofUploadArea } from './proof-upload-area'
import type { Task } from '@/domain/tasks/types/tasks-list.types'
import { useTaskPriority } from '@/hooks/use-task-priority'
import { TaskStateEnum } from '@/shared/constants'

interface TaskExecutionCardProps {
  task: Task
  onProofReady: (hasProof: boolean) => void
  onProofsChange?: (proofs: any[]) => void
}

export function TaskExecutionCard({ task, onProofReady, onProofsChange }: TaskExecutionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasProof, setHasProof] = useState(false)
  const { getTaskTypeBadgeClasses } = useTaskTypeColors()
  const { getPriorityIcon, getPriorityIconClass, getPriorityBadgeClasses } = useTaskPriority()

  const handleProofChange = (hasProofData: boolean) => {
    setHasProof(hasProofData)
    onProofReady(hasProofData)
  }

  const handleProofsChange = (newProofs: any[]) => {
    handleProofChange(newProofs.length > 0)
    onProofsChange?.(newProofs)
  }

  const handleExecuteTask = () => {
    console.log('Executing task:', task.id)
    // TODO: Implement individual task execution
  }

  const IconComponent = getPriorityIcon(task.priority)
  
  // Determine if task can be executed
  const canExecute = task.state === TaskStateEnum.STORED
  const isExecuted = task.state === TaskStateEnum.EXECUTED
  const isBlocked = task.state === TaskStateEnum.BLOCKED
  const isCancelled = task.state === TaskStateEnum.CANCELLED

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4">
        {/* Header - Always visible */}
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            {/* Expand/Collapse Icon */}
            {isExpanded ? (
              <FaChevronDown className="h-4 w-4 text-base-content/60" />
            ) : (
              <FaChevronRight className="h-4 w-4 text-base-content/60" />
            )}
            
            {/* Task Info */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold">
                {task.transactionId}
              </span>
              
              <span
                className={clsx(
                  "badge badge-sm",
                  getTaskTypeBadgeClasses(task.taskType as any)
                )}
              >
                {task.taskType}
              </span>
              
              <span className={clsx(
                "badge badge-sm",
                {
                  'badge-info': task.state === TaskStateEnum.STORED,
                  'badge-success': task.state === TaskStateEnum.EXECUTED,
                  'badge-warning': task.state === TaskStateEnum.BLOCKED,
                  'badge-error': task.state === TaskStateEnum.CANCELLED,
                }
              )}>
                {task.state}
              </span>
              
              {task.priority && (
                <div className="flex items-center gap-1">
                  {IconComponent ? <IconComponent className={getPriorityIconClass(task.priority)} /> : null}
                  <span
                    className={clsx(
                      "badge badge-sm",
                      getPriorityBadgeClasses(task.priority)
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-2">
            {hasProof && canExecute && (
              <span className="badge badge-sm badge-success">
                Proof Ready
              </span>
            )}
            {isExecuted && (
              <span className="badge badge-sm badge-success">
                <FaCheck className="h-3 w-3 mr-1" />
                Executed
              </span>
            )}
            {isBlocked && (
              <span className="badge badge-sm badge-warning">
                <FaTimes className="h-3 w-3 mr-1" />
                Blocked
              </span>
            )}
            {isCancelled && (
              <span className="badge badge-sm badge-error">
                <FaTimes className="h-3 w-3 mr-1" />
                Cancelled
              </span>
            )}
            <span className="text-sm text-base-content/60">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Collapsible Content */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 pt-4 border-t border-base-300 space-y-4">
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
              />

              {/* Individual Execute Button - Only for STORED tasks with proofs */}
              {canExecute && hasProof && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleExecuteTask}
                    className="btn btn-primary btn-sm"
                  >
                    <FaPlay className="h-4 w-4 mr-2" />
                    Execute This Task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}

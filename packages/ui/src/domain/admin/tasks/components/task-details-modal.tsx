import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa'
import type { Task } from '../types/tasks-list.types'
import { truncateHash } from '@/shared/lib/utils'
import { CopyToClipboard } from '@/shared/components/copy-to-clipboard'

interface TaskDetailsModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailsModal({ task, isOpen, onClose }: TaskDetailsModalProps) {
  if (!isOpen || !task) return null

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-base-content/50 italic">Not provided</span>
    }
    if (typeof value === 'string' && value.length > 50) {
      return (
        <span className="font-mono text-xs break-all">
          {value.slice(0, 50)}...
        </span>
      )
    }
    return <span className="font-mono text-sm">{String(value)}</span>
  }

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'LIQUIDATION': return 'badge-error'
      case 'ACQUISITION': return 'badge-success'
      case 'AUTHORIZATION': return 'badge-warning'
      case 'ARBITRAGE': return 'badge-info'
      default: return 'badge-neutral'
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Task Details</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Task Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Task ID</span>
              </label>
              <div className="input input-bordered bg-base-200 w-full">
                {task.id}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Task Type</span>
              </label>
              <div className="input input-bordered bg-base-200 w-full">
                <span className={`badge ${getTaskTypeColor(task.taskType)}`}>
                  {task.taskType}
                </span>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Transaction ID</span>
              </label>
              <div className="input input-bordered bg-base-200 font-mono w-full">
                {task.transactionId}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Created At</span>
              </label>
              <div className="input input-bordered bg-base-200 w-full">
                {new Date(task.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Hashes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Task Hash</span>
              </label>
              <div className="input input-bordered bg-base-200 font-mono text-xs w-full flex justify-between gap-2">
                {truncateHash(task.taskHash, 8, 8)}
                <CopyToClipboard text={task.taskHash} />
              </div>
              
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Transaction Hash</span>
              </label>
              <div className="input input-bordered bg-base-200 font-mono text-xs w-full flex justify-between gap-2">
                {truncateHash(task.transactionHash, 8, 8)}
                <CopyToClipboard text={task.transactionHash} />
              </div>
            </div>
          </div>

          {/* Task Data */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Task Data</span>
            </label>
            <div className="bg-base-200 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(task.taskData || {}, null, 2)}
              </pre>
            </div>
          </div>

          {/* Updated At */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Last Updated</span>
            </label>
            <div className="input input-bordered bg-base-200 w-full">
              {new Date(task.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
      
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}

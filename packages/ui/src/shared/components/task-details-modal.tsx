import { FaTimes, FaImage, FaFileAlt, FaUser, FaCalendarAlt } from "react-icons/fa";
import { clsx } from "clsx";
import { useTaskTypeColors } from "@/hooks/use-task-type-colors";
import type { Task } from "@the-sandbox-sev/api";
import { truncateHash } from "@/shared/lib/utils";
import { CopyToClipboard } from "@/shared/components/copy-to-clipboard";
import { Image } from "./image";


interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ProofCardProps {
  proof: any;
}

function ProofCard({ proof }: ProofCardProps) {
  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {proof.proofType === 'IMAGE' ? (
              <FaImage className="h-4 w-4 text-primary" />
            ) : (
              <FaFileAlt className="h-4 w-4 text-secondary" />
            )}
            <span className="badge badge-outline">{proof.proofType}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <FaCalendarAlt className="h-3 w-3" />
            {new Date(proof.createdAt).toLocaleString()}
          </div>
        </div>
        
        {proof.proofType === 'IMAGE' ? (
          <div>
            <div className="w-full h-32 rounded-lg overflow-hidden border border-base-300 cursor-pointer hover:shadow-md transition-shadow duration-200">
              <Image
                image={proof.proofValue}
                alt={proof.fileName || 'Proof image'}
                aspectRatio="video"
                className="rounded-lg hover:scale-105 transition-transform duration-200"
                onClick={() => window.open(proof.proofValue, '_blank')}
              />
            </div>
            {proof.fileName && (
              <p className="text-xs text-base-content/60 mt-2 font-mono">{proof.fileName}</p>
            )}
            {proof.fileSize && (
              <p className="text-xs text-base-content/50">
                Size: {(proof.fileSize / 1024).toFixed(1)} KB
              </p>
            )}
          </div>
        ) : (
          <div className="bg-base-100 p-3 rounded-lg border border-base-300">
            <p className="text-sm font-mono break-words whitespace-pre-wrap">{proof.proofValue}</p>
          </div>
        )}
        
        {proof.uploadedByUser && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-base-300">
            <FaUser className="h-3 w-3 text-base-content/60" />
            <span className="text-xs text-base-content/60">
              Uploaded by: {proof.uploadedByUser.nickname || proof.uploadedByUser.email}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskDetailsModal({ task, isOpen, onClose }: TaskDetailsModalProps) {
  const { getTaskTypeBadgeClasses } = useTaskTypeColors()
  
  if (!isOpen || !task) return null;



  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl">
      
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Task Details</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Created by:</span>
            <span className="font-mono">{task.user.email}</span>
          </div>
        </div>

        <div className="space-y-6">
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Task ID</span>
              </label>
              <div className="input input-bordered bg-base-200 w-full">{task.id}</div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Task Type</span>
              </label>
              <div className="input input-bordered bg-base-200 w-full">
                <span 
                  className={clsx(
                    "badge text-xs",
                    getTaskTypeBadgeClasses(task.taskType as any)
                  )}
                >
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

          {/* Execution Proofs Section */}
          {task.executionProofs && task.executionProofs.length > 0 && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Execution Proofs</span>
                <span className="badge badge-primary">{task.executionProofs.length}</span>
              </label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {task.executionProofs.map((proof: any, index: number) => (
                  <ProofCard key={proof.id || index} proof={proof} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

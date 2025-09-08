import { FaEye } from "react-icons/fa";
import { clsx } from "clsx";
import { useTaskTypeColors } from "@/hooks/use-task-type-colors";
import { useTaskStateColors } from "@/hooks/use-task-state-colors";
import type { Task } from "@the-sandbox-sev/api";
import { truncateHash } from "@/shared/lib/utils";
import { EtherScanLink } from "@/shared/components/ether-scan-link";
import { CopyToClipboard } from "@/shared/components/copy-to-clipboard";

interface TasksTableProps {
  tasks: Task[];
  isLoading: boolean;
  onViewTask: (task: Task) => void;
}

export function TasksTable({ tasks, isLoading, onViewTask }: TasksTableProps) {
  const { getTaskTypeBadgeClasses } = useTaskTypeColors();
  const { getTaskStateBadgeClasses } = useTaskStateColors();
  if (isLoading) {
    return (
      <div className="bg-base-100">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 bg-base-300 rounded w-1/6"></div>
              <div className="h-4 bg-base-300 rounded w-1/6"></div>
              <div className="h-4 bg-base-300 rounded w-1/4"></div>
              <div className="h-4 bg-base-300 rounded w-1/6"></div>
              <div className="h-4 bg-base-300 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-base-100">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-base-content/70">No tasks found</h3>
          <p className="text-base-content/50">Try adjusting your filters or create a new task.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Task Type</th>
              <th>State</th>
              <th>Task Hash</th>
              <th>Transaction Hash</th>
              <th>Created At</th>
              <th className="w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="hover">
                <td className="font-mono text-sm">{task.transactionId}</td>
                <td>
                  <span
                    className={clsx("badge text-xs", getTaskTypeBadgeClasses(task.taskType as any))}
                  >
                    {task.taskType}
                  </span>
                </td>
                <td>
                  <span className={clsx("badge", getTaskStateBadgeClasses(task.state as any))}>
                    {task.state}
                  </span>
                </td>
                <td className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="tooltip" data-tip={task.taskHash}>
                      {truncateHash(task.taskHash)}
                    </span>
                    <CopyToClipboard text={task.taskHash} />
                  </div>
                </td>
                <td className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <EtherScanLink txHash={task.transactionHash} />
                    <CopyToClipboard text={task.transactionHash} />
                  </div>
                </td>
                <td className="text-sm">{new Date(task.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => onViewTask(task)}
                    className="btn btn-ghost btn-sm"
                    title="View Details"
                  >
                    <FaEye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

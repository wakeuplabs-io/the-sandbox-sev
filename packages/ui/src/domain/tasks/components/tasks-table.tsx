import { FaEye } from "react-icons/fa";
import { clsx } from "clsx";
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
  if (isLoading) {
    return (
      <div className="">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 bg-base-300 rounded w-1/6 skeleton"></div>
              <div className="h-4 bg-base-300 rounded w-1/6 skeleton"></div>
              <div className="h-4 bg-base-300 rounded w-1/4 skeleton"></div>
              <div className="h-4 bg-base-300 rounded w-1/6 skeleton"></div>
              <div className="h-4 bg-base-300 rounded w-1/6 skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-base-content/70">No tasks found</h3>
          <p className="text-base-content/50">Try adjusting your filters or create a new task.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Task Type</th>
              <th>Task Hash</th>
              <th>Transaction Hash</th>
              <th>Created At</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="hover">
                <td className="font-mono text-sm">{task.transactionId}</td>
                <td>
                  <span className={clsx("text-xs font-mono font-semibold")}>{task.taskType}</span>
                </td>

                <td className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="tooltip tooltip-left"
                      data-tip={
                        "Unique ID of the instruction file. Ensures the approved plan hasn’t been altered."
                      }
                    >
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
                <td className="text-sm">
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <button
                    onClick={() => onViewTask(task)}
                    className="w-[200px] px-2 cursor-pointer font-semibold"
                    title="View Details"
                  >
                    View More
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

import { useMemo } from "react";
import { TaskExecutionCard } from "./task-execution-card";
import { PaginationActions } from "@/shared/components/pagination-actions";
import type { Task } from "@the-sandbox-sev/api";

interface TaskExecutionListProps {
  tasks: Task[];
  taskProofs: Record<string, any[]>;
  onTaskProofReady: (taskId: string, hasProof: boolean) => void;
  onTaskProofsChange: (taskId: string, proofs: any[]) => void;
  onViewTask: (task: Task) => void;
  clearInputsRefs: Record<string, any>;
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function TaskExecutionList({
  tasks,
  taskProofs,
  onTaskProofReady,
  onTaskProofsChange,
  onViewTask,
  clearInputsRefs,
  currentPage,
  totalPages,
  totalTasks,
  hasNext,
  hasPrev,
  onPageChange,
  onNextPage,
  onPrevPage,
}: TaskExecutionListProps) {
  const taskRefsMap = useMemo(() => {
    const map = new Map();
    tasks.forEach(task => {
      map.set(task.id, clearInputsRefs[task.id] || { current: null });
    });
    return map;
  }, [tasks, clearInputsRefs]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 overflow-y-auto">
        {tasks.map(task => (
          <TaskExecutionCard
            key={task.id}
            task={task}
            onProofReady={hasProof => onTaskProofReady(task.id, hasProof)}
            onProofsChange={proofs => onTaskProofsChange(task.id, proofs)}
            onViewTask={onViewTask}
            clearInputsRef={taskRefsMap.get(task.id)}
            taskProofs={taskProofs[task.id] || []}
          />
        ))}
      </div>

      <PaginationActions
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalTasks}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onPageChange={onPageChange}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </div>
  );
}

import { TaskExecutionCard } from "./task-execution-card";
import { PaginationActions } from "@/shared/components/pagination-actions";
import type { Task } from "@the-sandbox-sev/api";

interface TaskExecutionListProps {
  tasks: Task[];
  taskProofs: Record<string, any[]>;
  onTaskProofReady: (taskId: string, hasProof: boolean) => void;
  onTaskProofsChange: (taskId: string, proofs: any[]) => void;
  onViewTask: (task: Task) => void;
  clearInputsRefs: Record<string, React.MutableRefObject<(() => void) | null>>;
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
  return (
    <>
      {/* Task Cards */}
      <div className="space-y-4">
        {tasks.map(task => {
          // Create ref for this task if it doesn't exist
          if (!clearInputsRefs[task.id]) {
            clearInputsRefs[task.id] = { current: null };
          }

          return (
            <TaskExecutionCard
              key={task.id}
              task={task}
              onProofReady={hasProof => onTaskProofReady(task.id, hasProof)}
              onProofsChange={proofs => onTaskProofsChange(task.id, proofs)}
              onViewTask={onViewTask}
              clearInputsRef={clearInputsRefs[task.id]}
              taskProofs={taskProofs[task.id] || []}
            />
          );
        })}
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
    </>
  );
}

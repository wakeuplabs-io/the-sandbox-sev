import { useState, useRef } from "react";
import { useTaskExecution } from "./hooks/use-task-execution";
import { TasksFilters } from "../../tasks/components/tasks-filters";
import { TaskStateEnum } from "@/shared/constants";
import { useAdminTasksList } from "./hooks/use-admin-tasks-list";
import { useDownloadAdminTasksCSV } from "./hooks/use-download-admin-tasks-csv";
import { TaskDetailsModal } from "@/shared/components/task-details-modal";
import type { Task } from "@the-sandbox-sev/api";
import { TaskExecutionHeader } from "./components/task-execution-header";
import { BatchActionsPanel } from "./components/batch-actions-panel";
import { LoadingState } from "./components/loading-state";
import { EmptyState } from "./components/empty-state";
import { TaskExecutionList } from "./components/task-execution-list";

export function TaskExecutionPage() {
  const {
    tasks,
    isLoading,
    filters,
    updateFilters,
    currentPage,
    totalPages,
    itemsPerPage,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    totalTasks,
  } = useAdminTasksList();
  const { batchExecuteTasks, isExecuting } = useTaskExecution();
  const { downloadCSV, isDownloading, error: downloadError } = useDownloadAdminTasksCSV();
  const [tasksWithProofs, setTasksWithProofs] = useState<Set<string>>(new Set());
  const [taskProofs, setTaskProofs] = useState<Record<string, any[]>>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const allTasks = tasks;
  const clearInputsRefs = useRef<Record<string, React.MutableRefObject<(() => void) | null>>>({});

  const handleTaskProofReady = (taskId: string, hasProof: boolean) => {
    setTasksWithProofs(prev => {
      const newSet = new Set(prev);
      if (hasProof) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  };

  const handleTaskProofsChange = (taskId: string, proofs: any[]) => {
    setTaskProofs(prev => ({
      ...prev,
      [taskId]: proofs,
    }));
  };

  const handleExecuteAll = async () => {
    const readyTasks = allTasks.filter(
      task => task.state === TaskStateEnum.STORED && tasksWithProofs.has(task.id)
    );

    if (readyTasks.length === 0) {
      return;
    }

    const batchData = readyTasks.map(task => ({
      taskId: task.id,
      proofs: taskProofs[task.id] || [],
    }));

    const result = await batchExecuteTasks(batchData);

    if (result) {
      setTasksWithProofs(prev => {
        const newSet = new Set(prev);
        readyTasks.forEach(task => newSet.delete(task.id));
        return newSet;
      });

      setTaskProofs(prev => {
        const newProofs = { ...prev };
        readyTasks.forEach(task => delete newProofs[task.id]);
        return newProofs;
      });

      readyTasks.forEach(task => {
        const clearRef = clearInputsRefs.current[task.id];
        if (clearRef?.current) {
          clearRef.current();
        }
      });
    }
  };

  const handleClearAllProofs = () => {
    setTasksWithProofs(new Set());
    setTaskProofs({});

    Object.values(clearInputsRefs.current).forEach(clearRef => {
      if (clearRef?.current) {
        clearRef.current();
      }
    });
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDownloadCSV = () => {
    // Extract only the filter fields needed for CSV (without pagination)
    const csvFilters = {
      taskType: filters.taskType,
      search: filters.search,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      status: filters.status,
      state: filters.state,
      priority: filters.priority,
    };
    
    downloadCSV(csvFilters);
  };

  const hasTasksWithProofs = tasksWithProofs.size > 0;
  const hasStoredTasksWithProofs = allTasks.some(
    task => task.state === TaskStateEnum.STORED && tasksWithProofs.has(task.id)
  );
  const shouldShowBatchActions = hasTasksWithProofs && hasStoredTasksWithProofs;

  const readyTasks = allTasks.filter(
    task => task.state === TaskStateEnum.STORED && tasksWithProofs.has(task.id)
  );
  const readyTasksCount = readyTasks.length;

  const hasTasks = allTasks.length > 0;
  const shouldShowLoading = isLoading;
  const shouldShowEmptyState = !isLoading && !hasTasks;

  return (
    <section className="section space-y-4">
      <div className="flex flex-col h-full space-y-4">
        <TaskExecutionHeader 
          onDownloadCSV={handleDownloadCSV}
          isDownloading={isDownloading}
          isLoading={isLoading}
        />
        <TasksFilters filters={filters} onFiltersChange={updateFilters} />
        
        {downloadError && (
          <div className="alert alert-error">
            <h3 className="font-bold">Error downloading CSV</h3>
            <p>{downloadError.message}</p>
          </div>
        )}

        {shouldShowBatchActions && (
          <BatchActionsPanel
            readyTasksCount={readyTasksCount}
            isExecuting={isExecuting}
            onExecuteAll={handleExecuteAll}
            onClearAllProofs={handleClearAllProofs}
          />
        )}
        <div className="flex-1 flex flex-col min-h-0">
          {shouldShowLoading ? (
            <LoadingState />
          ) : shouldShowEmptyState ? (
            <EmptyState />
          ) : (
            <TaskExecutionList
              tasks={allTasks}
              taskProofs={taskProofs}
              onTaskProofReady={handleTaskProofReady}
              onTaskProofsChange={handleTaskProofsChange}
              onViewTask={handleViewTask}
              clearInputsRefs={clearInputsRefs.current}
              currentPage={currentPage}
              totalPages={totalPages}
              totalTasks={totalTasks}
              itemsPerPage={itemsPerPage}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onPageChange={goToPage}
              onNextPage={nextPage}
              onPrevPage={prevPage}
            />
          )}
        </div>
      </div>

      <TaskDetailsModal task={selectedTask} isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
}

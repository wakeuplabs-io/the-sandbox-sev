import { useState, useRef } from "react";
import { FaPlay, FaTrash, FaFilter, FaPlus } from "react-icons/fa";
import { useTaskExecution } from "./hooks/use-task-execution";
import { TaskExecutionCard } from "./components/task-execution-card";
import { TasksFilters } from "../../tasks/components/tasks-filters";
import { TaskStateEnum } from "@/shared/constants";
import { useAdminTasksList } from "./hooks/use-admin-tasks-list";
import { TaskDetailsModal } from "@/shared/components/task-details-modal";
import type { Task } from "@the-sandbox-sev/api";
import { PaginationActions } from "@/shared/components/pagination-actions";
import { Link } from "@tanstack/react-router";

export function TaskExecutionPage() {
  const {
    tasks,
    isLoading,
    filters,
    updateFilters,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    totalTasks,
  } = useAdminTasksList();
  const { batchExecuteTasks, isExecuting } = useTaskExecution();

  // Show all tasks (no filtering by state)
  const allTasks = tasks;

  // Track tasks with proofs ready for execution
  const [tasksWithProofs, setTasksWithProofs] = useState<Set<string>>(new Set());
  // Track proofs for each task
  const [taskProofs, setTaskProofs] = useState<Record<string, any[]>>({});

  // Modal state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refs to clear inputs after execution
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
    // Only execute STORED tasks that have proofs
    const readyTasks = allTasks.filter(
      task => task.state === TaskStateEnum.STORED && tasksWithProofs.has(task.id)
    );

    if (readyTasks.length === 0) {
      return;
    }

    // Prepare batch execution data
    const batchData = readyTasks.map(task => ({
      taskId: task.id,
      proofs: taskProofs[task.id] || [],
    }));

    // Execute batch
    const result = await batchExecuteTasks(batchData);

    if (result) {
      // Clear executed tasks from state
      setTasksWithProofs(prev => {
        const newSet = new Set(prev);
        readyTasks.forEach(task => newSet.delete(task.id));
        return newSet;
      });

      // Clear proofs for executed tasks
      setTaskProofs(prev => {
        const newProofs = { ...prev };
        readyTasks.forEach(task => delete newProofs[task.id]);
        return newProofs;
      });

      // Clear inputs for executed tasks
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

    // Clear all inputs
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content mb-2">
            <FaPlay className="inline-block mr-3" />
            Task Execution & History
          </h1>
          <p className="text-base-content/70">
            View all tasks, upload execution proofs, and execute stored tasks in batch
          </p>
        </div>

        <Link to="/admin/tasks/new" className="btn btn-primary">
          <FaPlus className="h-4 w-4" />
          Create New Task
        </Link>
      </div>

      {/* Filters */}
      <TasksFilters filters={filters} onFiltersChange={updateFilters} />

      {/* Batch Actions - Show when there are STORED tasks with proofs */}
      {tasksWithProofs.size > 0 &&
        allTasks.some(
          task => task.state === TaskStateEnum.STORED && tasksWithProofs.has(task.id)
        ) && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FaFilter className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">
                    {
                      allTasks.filter(
                        task => task.state === TaskStateEnum.STORED && tasksWithProofs.has(task.id)
                      ).length
                    }{" "}
                    stored task
                    {allTasks.filter(
                      task => task.state === TaskStateEnum.STORED && tasksWithProofs.has(task.id)
                    ).length !== 1
                      ? "s"
                      : ""}{" "}
                    ready for execution
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAllProofs}
                    className="btn btn-outline btn-sm"
                    disabled={isExecuting}
                  >
                    <FaTrash className="h-4 w-4 mr-2" />
                    Clear All Proofs
                  </button>
                  <button
                    onClick={handleExecuteAll}
                    className="btn btn-primary btn-sm"
                    disabled={isExecuting}
                  >
                    <FaPlay className="h-4 w-4 mr-2" />
                    {isExecuting ? "Executing..." : "Execute All Ready Tasks"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Tasks List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="h-4 bg-base-300 rounded w-1/4"></div>
                    <div className="h-4 bg-base-300 rounded w-1/6"></div>
                    <div className="h-4 bg-base-300 rounded w-1/6"></div>
                    <div className="h-4 bg-base-300 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : allTasks.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h3 className="text-lg font-semibold text-base-content/70">No tasks found</h3>
              <p className="text-base-content/50">No tasks match your current filters.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Task Cards */}
            <div className="space-y-4">
              {allTasks.map(task => {
                // Create ref for this task if it doesn't exist
                if (!clearInputsRefs.current[task.id]) {
                  clearInputsRefs.current[task.id] = { current: null };
                }

                return (
                  <TaskExecutionCard
                    key={task.id}
                    task={task}
                    onProofReady={hasProof => handleTaskProofReady(task.id, hasProof)}
                    onProofsChange={proofs => handleTaskProofsChange(task.id, proofs)}
                    onViewTask={handleViewTask}
                    clearInputsRef={clearInputsRefs.current[task.id]}
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
              onPageChange={goToPage}
              onNextPage={nextPage}
              onPrevPage={prevPage}
            />
          </>
        )}
      </div>

      {/* Task Details Modal */}
      <TaskDetailsModal task={selectedTask} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

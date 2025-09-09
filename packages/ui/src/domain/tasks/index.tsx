import { useState } from "react";
import { usePublicTasksList } from "./hooks/use-public-tasks-list";
import type { Task } from "@the-sandbox-sev/api";
import { TasksFilters } from "./components/tasks-filters";
import { TasksTable } from "./components/tasks-table";
import { PaginationActions } from "../../shared/components/pagination-actions";
import { TaskDetailsModal } from "@/shared/components/task-details-modal";

export function TasksListPage() {
  const {
    tasks,
    totalTasks,
    isLoading,
    error,
    filters,
    updateFilters,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  } = usePublicTasksList();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSearching = !!filters.search && isLoading;

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  if (error) {
    return (
      <div className="section">
        <div className="alert alert-error">
          <h3 className="font-bold">Error loading tasks</h3>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="btn btn-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="section mb-6">
      <div className="card-body space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading-1">DAO Transparency Dashboard </h1>
        </div>

        <TasksFilters filters={filters} onFiltersChange={updateFilters} isPublic={true} />

        <div className="text-sm text-base-content/70">
          {isLoading ? (
            <span>{isSearching ? "Searching..." : "Loading tasks..."}</span>
          ) : (
            <span>
              Found {totalTasks} task{totalTasks !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <TasksTable tasks={tasks} isLoading={isLoading} onViewTask={handleViewTask} />
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
      </div>
      <TaskDetailsModal task={selectedTask} isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
}

import { useState } from "react";
import { usePublicTasksList } from "./hooks/use-public-tasks-list";
import { useDownloadTasksCSV } from "./hooks/use-download-tasks-csv";
import type { Task } from "@the-sandbox-sev/api";
import { TasksFilters } from "./components/tasks-filters";
import { TasksTable } from "./components/tasks-table";
import { PaginationActions } from "../../shared/components/pagination-actions";
import { TaskDetailsModal } from "@/shared/components/task-details-modal";
import { FaDownload } from "react-icons/fa";

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

  const { downloadCSV, isDownloading, error: downloadError } = useDownloadTasksCSV();

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

  const handleDownloadCSV = () => {
    // Extract only the filter fields needed for CSV (without pagination)
    const csvFilters = {
      taskType: filters.taskType,
      search: filters.search,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    };
    
    downloadCSV(csvFilters);
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
          <button
            onClick={handleDownloadCSV}
            disabled={isDownloading || isLoading}
            className="btn btn-primary btn-sm gap-2"
          >
            <FaDownload className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download CSV"}
          </button>
        </div>

        <TasksFilters filters={filters} onFiltersChange={updateFilters} isPublic={true} />

        {downloadError && (
          <div className="alert alert-error">
            <h3 className="font-bold">Error downloading CSV</h3>
            <p>{downloadError.message}</p>
          </div>
        )}

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

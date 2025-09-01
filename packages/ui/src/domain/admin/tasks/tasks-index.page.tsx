import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { FaPlus } from 'react-icons/fa'
import { useTasksList } from './hooks/use-tasks-list'
import { TasksFilters, TasksTable, TasksPagination, TaskDetailsModal } from './components'
import type { Task } from './types/tasks-list.types'

export function TasksIndexPage() {
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
  } = useTasksList()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Detect if we're currently searching (when search filter is set but different from current value)
  const isSearching = !!filters.search && isLoading

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <h3 className="font-bold">Error loading tasks</h3>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="btn btn-sm">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link
          to="/admin/tasks/new"
          className="btn btn-primary"
        >
          <FaPlus className="h-4 w-4" />
          Create New Task
        </Link>
      </div>

      {/* Filters */}
      <TasksFilters
        filters={filters}
        onFiltersChange={updateFilters}
      />

      {/* Results Summary */}
      <div className="text-sm text-base-content/70">
        {isLoading ? (
          <span>
            {isSearching ? 'Searching...' : 'Loading tasks...'}
          </span>
        ) : (
          <span>Found {totalTasks} task{totalTasks !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Table */}
      <TasksTable
        tasks={tasks}
        isLoading={isLoading}
        onViewTask={handleViewTask}
      />

      {/* Pagination */}
      <TasksPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalTasks={totalTasks}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onPageChange={goToPage}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

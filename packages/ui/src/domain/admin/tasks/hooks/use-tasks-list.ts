import { useState } from 'react'
import { useTasks } from '@/hooks/use-tasks'
import { useDebounce } from '@/hooks/use-debounce'
import type { TasksFilters, TasksListResponse } from '../types/tasks-list.types'

export const useTasksList = () => {
  const { getAllTasks } = useTasks()
  const [filters, setFilters] = useState<TasksFilters>({
    page: 1,
    limit: 10,
  })

  // Debounce the search value to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 500)

  // Create filters object with debounced search for API calls
  const apiFilters = {
    ...filters,
    search: debouncedSearch,
  }

  // Fetch tasks with current filters from API
  const { data: tasksResponse, isLoading, error, refetch } = getAllTasks(apiFilters) as {
    data: TasksListResponse | undefined
    isLoading: boolean
    error: any
    refetch: () => void
  }

  // Update filters
  const updateFilters = (newFilters: Partial<TasksFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }))
  }

  // Pagination handlers
  const goToPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const nextPage = () => {
    if (filters.page && tasksResponse?.pagination?.hasNext) {
      goToPage(filters.page + 1)
    }
  }

  const prevPage = () => {
    if (filters.page && filters.page > 1) {
      goToPage(filters.page - 1)
    }
  }

  return {
    // Data
    tasks: tasksResponse?.tasks || [],
    totalTasks: tasksResponse?.pagination?.total || 0,
    isLoading,
    error,
    
    // Filters
    filters,
    updateFilters,
    
    // Pagination
    currentPage: filters.page || 1,
    totalPages: tasksResponse?.pagination?.totalPages || 1,
    hasNext: tasksResponse?.pagination?.hasNext || false,
    hasPrev: tasksResponse?.pagination?.hasPrev || false,
    goToPage,
    nextPage,
    prevPage,
    
    // Actions
    refetch,
  }
}

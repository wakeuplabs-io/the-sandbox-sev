import { useTasks } from '@/hooks/use-tasks'
import { usePagination } from '@/hooks/use-pagination'
import { useFilters } from '@/hooks/use-filters'
import type { TasksListFilters, TasksListResponse } from '@/domain/tasks/types/tasks-list.types'

export const useAdminTasksList = () => {
	const { getAllTasks } = useTasks()
	
	// Initialize pagination
	const pagination = usePagination({
		initialPage: 1,
		initialLimit: 10,
	})
	
	// Initialize filters with pagination values
	const filters = useFilters<TasksListFilters>({
		initialFilters: {
			page: pagination.page,
			limit: pagination.limit,
		},
		debounceMs: 500,
	})
	
	// Update pagination when filters change
	const apiFilters = {
		...filters.debouncedFilters,
		page: pagination.page,
		limit: pagination.limit,
	}
	
	// Fetch admin tasks from API
	const { data: tasksResponse, isLoading, error, refetch } = getAllTasks(apiFilters) as {
		data: TasksListResponse | undefined
		isLoading: boolean
		error: any
		refetch: () => void
	}
	
	// Update filters with pagination reset
	const updateFilters = (newFilters: Partial<TasksListFilters>) => {
		filters.updateFilters(newFilters, true)
		pagination.resetPage()
	}
	
	// Pagination handlers
	const goToPage = (page: number) => {
		pagination.goToPage(page)
	}
	
	const nextPage = () => {
		if (tasksResponse?.pagination?.hasNext) {
			pagination.nextPage()
		}
	}
	
	const prevPage = () => {
		if (pagination.page > 1) {
			pagination.prevPage()
		}
	}
	
	return {
		// Data
		tasks: tasksResponse?.tasks || [],
		totalTasks: tasksResponse?.pagination?.total || 0,
		isLoading,
		error,
		
		// Filters
		filters: filters.filters,
		updateFilters,
		
		// Pagination
		currentPage: pagination.page,
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

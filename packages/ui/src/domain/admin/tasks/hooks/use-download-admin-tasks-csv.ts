import { useApiClient } from '@/hooks/use-api-client'
import { useMutation } from '@tanstack/react-query'
import type { TasksListFilters } from '@/domain/tasks/types/tasks-list.types'

export const useDownloadAdminTasksCSV = () => {
	const client = useApiClient()

	const downloadCSV = useMutation({
		mutationFn: async (filters: Omit<TasksListFilters, 'page' | 'limit'>) => {
			// Build query parameters
			const params = new URLSearchParams()
			
			if (filters.taskType) {
				params.append('taskType', filters.taskType)
			}
			
			if (filters.search) {
				params.append('search', filters.search)
			}
			
			if (filters.dateFrom) {
				params.append('dateFrom', filters.dateFrom)
			}
			
			if (filters.dateTo) {
				params.append('dateTo', filters.dateTo)
			}

			if (filters.status) {
				params.append('status', filters.status)
			}

			if (filters.state) {
				params.append('state', filters.state)
			}

			const response = await client.api.tasks.csv.$get({
				query: Object.fromEntries(params),
			})

			if (!response.ok) {
				const error: any = await response.json()
				throw new Error(error?.error || 'Failed to download CSV')
			}

			// Get the filename from the Content-Disposition header
			const contentDisposition = response.headers.get('Content-Disposition')
			const filename = contentDisposition
				?.match(/filename="(.+)"/)?.[1]
				|| `admin-tasks-export-${new Date().toISOString().split('T')[0]}.csv`

			// Get the CSV content as blob
			const blob = await response.blob()
			
			// Create download link
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = filename
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)

			return { success: true, filename }
		},
	})

	return {
		downloadCSV: downloadCSV.mutate,
		isDownloading: downloadCSV.isPending,
		error: downloadCSV.error,
	}
}

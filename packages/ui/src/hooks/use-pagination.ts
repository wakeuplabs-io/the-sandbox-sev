import { useState } from 'react'

interface UsePaginationOptions {
	initialPage?: number
	initialLimit?: number
}

export const usePagination = (options: UsePaginationOptions = {}) => {
	const { initialPage = 1, initialLimit = 10 } = options
	
	const [page, setPage] = useState(initialPage)
	const [limit, setLimit] = useState(initialLimit)
	
	const goToPage = (newPage: number) => {
		setPage(Math.max(1, newPage))
	}
	
	const nextPage = () => {
		setPage(prev => prev + 1)
	}
	
	const prevPage = () => {
		setPage(prev => Math.max(1, prev - 1))
	}
	
	const resetPage = () => {
		setPage(1)
	}
	
	const setPageSize = (newLimit: number) => {
		setLimit(newLimit)
		resetPage() // Reset to first page when changing page size
	}
	
	return {
		page,
		limit,
		setPage,
		setLimit,
		setPageSize,
		goToPage,
		nextPage,
		prevPage,
		resetPage,
	}
}

import { useState } from 'react'
import { useDebounce } from './use-debounce'

interface UseFiltersOptions<T> {
	initialFilters: T
	debounceMs?: number
}

export const useFilters = <T extends Record<string, any>>(options: UseFiltersOptions<T>) => {
	const { initialFilters, debounceMs = 500 } = options
	
	const [filters, setFilters] = useState<T>(initialFilters)
	
	// Debounce search field specifically
	const debouncedSearch = useDebounce(filters.search, debounceMs)
	
	// Create debounced filters object
	const debouncedFilters = {
		...filters,
		search: debouncedSearch,
	}
	
	const updateFilters = (newFilters: Partial<T>, resetPage = true) => {
		setFilters(prev => ({
			...prev,
			...newFilters,
			// Reset page when filters change (except when explicitly disabled)
			...(resetPage && { page: 1 })
		}))
	}
	
	const resetFilters = () => {
		setFilters(initialFilters)
	}
	
	const clearFilters = () => {
		const clearedFilters = Object.keys(initialFilters).reduce((acc, key) => {
			acc[key] = initialFilters[key]
			return acc
		}, {} as Record<string, any>) as T
		setFilters(clearedFilters)
	}
	
	return {
		filters,
		setFilters,
		updateFilters,
		resetFilters,
		clearFilters,
		debouncedFilters,
	}
}

import { useEffect, useState, useRef } from 'react'

interface UseDebounceOptions {
  delay?: number
  immediate?: boolean
}

export function useDebounce<T>(
  value: T, 
  delay: number = 500, 
  options: UseDebounceOptions = {}
): T {
  const { immediate = false } = options
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // If immediate is true, set the value immediately
    if (immediate) {
      setDebouncedValue(value)
      return
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay, immediate])

  return debouncedValue
}

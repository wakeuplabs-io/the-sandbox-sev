import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface TasksPaginationProps {
  currentPage: number
  totalPages: number
  totalTasks: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  onNextPage: () => void
  onPrevPage: () => void
}

export function TasksPagination({
  currentPage,
  totalPages,
  totalTasks,
  hasNext,
  hasPrev,
  onPageChange,
  onNextPage,
  onPrevPage,
}: TasksPaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-between mt-6">
      {/* Results info */}
      <div className="text-sm text-base-content/70">
        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalTasks)} of {totalTasks} tasks
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={onPrevPage}
          disabled={!hasPrev}
          className="btn btn-sm btn-outline"
        >
          <FaChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? onPageChange(page) : null}
              disabled={page === '...'}
              className={`
                btn btn-sm
                ${page === currentPage ? 'btn-primary' : 'btn-outline'}
                ${page === '...' ? 'btn-disabled' : ''}
              `}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={onNextPage}
          disabled={!hasNext}
          className="btn btn-sm btn-outline"
        >
          Next
          <FaChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

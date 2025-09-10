import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { clsx } from "clsx";
import { useMemo } from "react";

interface PaginationActionsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function PaginationActions({
  currentPage,
  totalPages,
  totalItems,
  hasNext,
  hasPrev,
  onPageChange,
  onNextPage,
  onPrevPage,
}: PaginationActionsProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = useMemo(() => getPageNumbers(), [currentPage, totalPages, totalItems]);
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-base-content/70">
        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalItems)} of{" "}
        {totalItems} items
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onPrevPage} disabled={!hasPrev} className="btn btn-sm btn-outline">
          <FaChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex gap-1">
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => (typeof page === "number" ? onPageChange(page) : null)}
              disabled={page === "..."}
              className={clsx(
                "btn btn-sm",
                {
                  "btn-primary": page === currentPage,
                  "btn-outline": page !== currentPage,
                  "btn-disabled": page === "...",
                }
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button onClick={onNextPage} disabled={!hasNext} className="btn btn-sm btn-outline">
          <FaChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

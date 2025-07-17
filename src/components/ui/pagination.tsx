'use client'

import { Button } from './button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Calculate which page numbers to show (fewer on mobile)
  const getVisiblePages = (isMobile = false) => {
    const pages: (number | string)[] = []
    const maxVisible = isMobile ? 5 : 7 // Fewer pages on mobile

    if (totalPages <= maxVisible) {
      // Show all pages if we have few enough
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
          pages.push(i)
        }
        if (totalPages > 4) {
          pages.push('ellipsis')
        }
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('ellipsis')
        for (let i = Math.max(totalPages - 3, 2); i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) {
    return (
      <div className={cn("text-center", className)}>
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{totalItems}</span> job{totalItems !== 1 ? 's' : ''}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4 sm:space-y-0", className)}>
      {/* Results count - centered on mobile, left on desktop */}
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> job{totalItems !== 1 ? 's' : ''}
      </div>

      {/* Pagination controls - responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-center gap-2 order-2 sm:order-1">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-10 px-4"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">‹</span>
          </Button>

          {/* Page numbers - desktop version */}
          <div className="hidden sm:flex space-x-1">
            {getVisiblePages(false).map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-sm text-muted-foreground flex items-center"
                  >
                    ...
                  </span>
                )
              }

              const pageNumber = page as number
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-10 h-10 p-0"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>

          {/* Page numbers - mobile version (simplified) */}
          <div className="flex sm:hidden space-x-1">
            {getVisiblePages(true).map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 py-2 text-sm text-muted-foreground flex items-center"
                  >
                    ...
                  </span>
                )
              }

              const pageNumber = page as number
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-10 h-10 p-0 text-sm"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-10 px-4"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">›</span>
          </Button>
        </div>

        {/* Current page indicator - mobile only */}
        <div className="flex justify-center sm:hidden text-sm text-muted-foreground order-1">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  )
} 
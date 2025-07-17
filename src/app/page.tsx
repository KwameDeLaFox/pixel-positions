'use client'

import { JobCard } from "@/components/jobs/job-card"
import { JobDetailPanel } from "@/components/jobs/job-detail-panel"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { Header } from "@/components/ui/header"
import { Pagination } from "@/components/ui/pagination"
import { useJobs } from "@/hooks/use-jobs"
import { useState, useEffect } from "react"
import { JOB_BOARD_CONFIG } from "@/lib/constants"
import { Button } from "@/components/ui/button"

import { InitialLoading } from "@/components/ui/loading"
import { JobCardSkeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  
  const [filters, setFilters] = useState({
    remote_only: true,
    keyword: '',
    location_region: [] as string[],
    location_country: [] as string[],
    employment_type: [] as string[],
    seniority: [] as string[]
  })

  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilteringLoading, setIsFilteringLoading] = useState(false)

  // Debounce filters to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 400) // 400ms debounce

    return () => clearTimeout(timer)
  }, [filters])

  // Panel handlers
  const handlePanelClose = () => {
    setSelectedJobId(null)
  }

  // Fetch jobs with debounced filters
  const { data: jobs, isLoading, error, refetch } = useJobs(debouncedFilters)

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: typeof filters) => {
    // Show filter loading for better UX
    setIsFilteringLoading(true)
    setFilters(newFilters)
    setCurrentPage(1)
    
    // Hide filter loading after a short delay
    setTimeout(() => setIsFilteringLoading(false), 300)
  }

  // Pagination calculations
  const totalJobs = jobs?.length || 0
  const totalPages = Math.ceil(totalJobs / JOB_BOARD_CONFIG.JOBS_PER_PAGE)
  const startIndex = (currentPage - 1) * JOB_BOARD_CONFIG.JOBS_PER_PAGE
  const endIndex = startIndex + JOB_BOARD_CONFIG.JOBS_PER_PAGE
  const currentPageJobs = jobs?.slice(startIndex, endIndex) || []

  // Count active filters for mobile badge
  const activeFilterCount = [
    filters.keyword ? 1 : 0,
    filters.employment_type.length,
    filters.seniority.length,
    filters.location_region.length,
    filters.location_country.length,
  ].reduce((sum, count) => sum + count, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <Header />
      
      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-card shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground">Filters</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMobileFiltersOpen(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            <div className="h-full overflow-y-auto">
              <FilterSidebar 
                filters={filters} 
                onFiltersChange={handleFiltersChange}
                className="border-r-0"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar 
            filters={filters} 
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Main Content - Split view when job selected */}
        <main className="flex-1">
          {selectedJobId ? (
            /* Split View: Job List + Detail Panel */
            <div className="flex h-screen">
              {/* Job List Panel - Left Side */}
              <div className="w-2/5 p-4 sm:p-6 lg:p-8 overflow-y-auto border-r border-border">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-6">
                  <Button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="w-full justify-between bg-card border border-border text-card-foreground hover:bg-accent"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                      </svg>
                      Filters
                    </span>
                    {activeFilterCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </div>

                {/* Job Count */}
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Design Jobs
                  </h2>
                  <p className="text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalJobs)} of {totalJobs} jobs
                  </p>
                  <Button
                    onClick={handlePanelClose}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    ← Back to Grid View
                  </Button>
                </div>

                {/* Job List - Single Column */}
                <div className="space-y-4">
                  {currentPageJobs.map((job, index) => (
                    <div 
                      key={job.id} 
                      className={`animate-fade-in-up ${job.id === selectedJobId ? 'ring-2 ring-primary' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <JobCard 
                        job={job} 
                        onClick={() => setSelectedJobId(job.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination in Job List */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalJobs}
                      itemsPerPage={JOB_BOARD_CONFIG.JOBS_PER_PAGE}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>

              {/* Job Detail Panel - Right Side */}
              <div className="w-3/5">
                <JobDetailPanel
                  jobId={selectedJobId}
                  onClose={handlePanelClose}
                />
              </div>
            </div>
          ) : (
            /* Full Width Grid View */
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <Button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="w-full justify-between bg-card border border-border text-card-foreground hover:bg-accent"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                    Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Filter Loading Overlay */}
              {isFilteringLoading && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 flex items-center justify-center">
                  <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <span className="text-card-foreground">Applying filters...</span>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && !jobs ? (
                <InitialLoading />
              ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div 
                      key={index} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <JobCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="bg-destructive/10 text-destructive p-4 rounded-lg max-w-md mx-auto">
                    <h3 className="font-medium mb-2">Failed to load jobs</h3>
                    <p className="text-sm">{error.message}</p>
                  </div>
                </div>
              ) : currentPageJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-muted p-8 rounded-lg max-w-md mx-auto">
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No jobs found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters to see more results.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Job Count */}
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      Design Jobs
                    </h2>
                    <p className="text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalJobs)} of {totalJobs} jobs
                    </p>
                  </div>

                  {/* Job Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    {currentPageJobs.map((job, index) => (
                      <div 
                        key={job.id} 
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <JobCard 
                          job={job} 
                          onClick={() => setSelectedJobId(job.id)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalJobs}
                        itemsPerPage={JOB_BOARD_CONFIG.JOBS_PER_PAGE}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

'use client'

import { JobDetail } from '@/components/jobs/job-detail'
import { useQuery } from '@tanstack/react-query'
import { JobData } from '@/types/job'
import { queryKeys } from '@/lib/query-client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface JobDetailPanelProps {
  jobId: string
  onClose: () => void
  className?: string
}

/**
 * Fetch single job by ID from API
 */
async function fetchJobById(id: string): Promise<JobData | null> {
  try {
    // Try to fetch from API first
    const response = await fetch(`/api/jobs`)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.message || 'Failed to fetch jobs')
    }
    
    // Find the job with matching ID
    const job = data.jobs?.find((job: JobData) => job.id === id)
    return job || null
    
  } catch (error) {
    console.error('Failed to fetch job:', error)
    return null
  }
}

export function JobDetailPanel({ jobId, onClose, className }: JobDetailPanelProps) {
  // Use React Query to fetch job data
  const { data: job, isLoading, error } = useQuery({
    queryKey: queryKeys.jobDetail(jobId),
    queryFn: () => fetchJobById(jobId),
    retry: 2,
  })

  return (
    <div className={cn(
      'bg-background border-l border-border h-full overflow-hidden flex flex-col',
      className
    )}>
      {/* Header with close button */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold text-card-foreground">
          Job Details
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          ✕
        </Button>
      </div>

      {/* Content area - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg"></div>
                <div className="space-y-3 flex-1">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Failed to Load Job
            </h3>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t fetch the job details. This might be a temporary issue.
            </p>
            <div className="space-x-4">
              <Button 
                onClick={onClose}
                variant="outline"
              >
                Close
              </Button>
              <Button 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : !job ? (
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Job Not Found
            </h3>
            <p className="text-muted-foreground mb-6">
              This job may have been removed or is no longer available.
            </p>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <div className="bg-card">
            <JobDetail job={job} />
          </div>
        )}
      </div>
    </div>
  )
} 
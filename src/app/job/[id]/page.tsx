'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { JobDetail } from '@/components/jobs/job-detail'
import { useQuery } from '@tanstack/react-query'
import { JobData } from '@/types/job'
import { queryKeys } from '@/lib/query-client'
import { notFound } from 'next/navigation'
import { use } from 'react'

interface JobPageProps {
  params: Promise<{
    id: string
  }>
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

export default function JobPage({ params }: JobPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  
  // Use React Query to fetch job data
  const { data: job, isLoading, error } = useQuery({
    queryKey: queryKeys.jobDetail(resolvedParams.id),
    queryFn: () => fetchJobById(resolvedParams.id),
    retry: 2,
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with back button */}
        <div className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                ← Back
              </Button>
              
              <div className="text-center">
                <h1 className="text-lg font-semibold text-card-foreground">Loading Job...</h1>
              </div>
              
              {/* Spacer for centering */}
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm border border-border m-4 p-6">
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
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with back button */}
        <div className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                ← Back
              </Button>
              
              <div className="text-center">
                <h1 className="text-lg font-semibold text-card-foreground">Error Loading Job</h1>
              </div>
              
              {/* Spacer for centering */}
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm border border-border m-4 p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">
                Failed to Load Job
              </h2>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t fetch the job details. This might be a temporary issue.
              </p>
              <div className="space-x-4">
                <Button 
                  onClick={() => router.back()}
                  variant="outline"
                >
                  ← Go Back
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If job not found, show 404
  if (!job) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              ← Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold text-card-foreground">Job Details</h1>
            </div>
            
            {/* Spacer for centering */}
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Job detail content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-sm border border-border m-4">
          <JobDetail job={job} />
        </div>
      </div>
    </div>
  )
} 
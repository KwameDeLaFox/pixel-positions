import { useQuery } from '@tanstack/react-query'
import { JobData, FilterParams } from '@/types/job'
import { queryKeys } from '@/lib/query-client'

/**
 * Fetch jobs from API with filters
 */
async function fetchJobs(filters: FilterParams): Promise<JobData[]> {
  const params = new URLSearchParams()
  
  // Add filter parameters
  if (filters.keyword) {
    params.append('keyword', filters.keyword)
  }
  if (filters.remote_only) {
    params.append('remote_only', 'true')
  }
  if (filters.employment_type && filters.employment_type.length > 0) {
    params.append('employment_type', filters.employment_type.join(','))
  }
  if (filters.seniority && filters.seniority.length > 0) {
    params.append('seniority', filters.seniority.join(','))
  }
  if (filters.location_region && filters.location_region.length > 0) {
    params.append('location_region', filters.location_region.join(','))
  }
  if (filters.location_country && filters.location_country.length > 0) {
    params.append('location_country', filters.location_country.join(','))
  }

  const response = await fetch(`/api/jobs?${params}`)
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.message || 'Failed to fetch jobs')
  }
  
  return data.jobs || []
}

/**
 * React Query hook for fetching jobs with filters
 * Automatically refetches when filters change
 */
export function useJobs(filters: FilterParams) {
  return useQuery({
    queryKey: queryKeys.jobsWithFilters(filters as Record<string, unknown>),
    queryFn: () => fetchJobs(filters),
    enabled: true, // Always enabled, let API handle empty filters
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

 
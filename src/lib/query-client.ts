import { QueryClient } from '@tanstack/react-query'
import { JOB_BOARD_CONFIG } from './constants'

/**
 * React Query client configuration
 * Optimized for job board data fetching patterns
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache duration - 5 minutes for job data
      staleTime: JOB_BOARD_CONFIG.CACHE_DURATION,
      // Keep data in cache for 10 minutes even when unused (gcTime = garbage collection time)
      gcTime: JOB_BOARD_CONFIG.CACHE_DURATION * 2,
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch on window focus for job data
      refetchOnWindowFocus: false,
      // Refetch on reconnect for fresh data
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
})

/**
 * Query keys for consistent caching
 */
export const queryKeys = {
  jobs: ['jobs'] as const,
  jobsWithFilters: (filters: Record<string, unknown>) => ['jobs', filters] as const,
  jobDetail: (id: string) => ['job', id] as const,
} as const 
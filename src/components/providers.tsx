'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { type ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * App providers wrapper
 * Provides React Query context and error handling to the entire application
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* React Query Devtools - only shows in development */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
} 
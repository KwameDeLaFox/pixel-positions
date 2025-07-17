import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-md bg-muted',
        className
      )}
    />
  )
}

interface JobCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function JobCardSkeleton({ className, ...props }: JobCardSkeletonProps) {
  return (
    <div 
      className={cn(
        'bg-card rounded-lg border border-border p-4 sm:p-6',
        className
      )}
      {...props}
    >
      {/* Header with logo and company */}
      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        {/* Company avatar skeleton */}
        <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {/* Job title skeleton */}
          <Skeleton className="h-4 sm:h-5 w-3/4 mb-2" />
          {/* Company name skeleton */}
          <Skeleton className="h-3 w-1/2" />
        </div>
        
        {/* Featured badge placeholder */}
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Job details */}
      <div className="space-y-3 mb-4">
        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-2/3" />
        </div>
        
        {/* Employment type and seniority badges */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Salary info */}
        <Skeleton className="h-3 w-3/5" />
        
        {/* Discipline tags */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        
        <Skeleton className="h-8 sm:h-10 w-16 rounded-md" />
      </div>
    </div>
  )
} 
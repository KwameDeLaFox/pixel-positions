import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  className?: string
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ className, message = "Loading jobs...", size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4",
      className
    )}>
      <div className="relative">
        {/* Main spinner */}
        <div className={cn(
          "border-4 border-border border-t-primary rounded-full animate-spin",
          sizeClasses[size]
        )} />
        
        {/* Subtle glow effect */}
        <div className={cn(
          "absolute inset-0 border-4 border-transparent border-t-primary/50 rounded-full animate-spin opacity-50",
          sizeClasses[size]
        )} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-muted-foreground text-sm font-medium">{message}</p>
        <p className="text-muted-foreground/70 text-xs mt-1">This may take a few moments</p>
      </div>
    </div>
  )
}

interface InitialLoadingProps {
  className?: string
}

export function InitialLoading({ className }: InitialLoadingProps) {
  return (
    <div className={cn(
      "min-h-[60vh] flex items-center justify-center",
      className
    )}>
      <div className="text-center">
        {/* Logo and brand */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PixelPositions</h1>
              <p className="text-xs text-muted-foreground">Design Jobs</p>
            </div>
          </div>
        </div>
        
        {/* Loading spinner */}
        <Loading message="Finding the best design jobs for you..." size="lg" />
        
        {/* Fun loading messages */}
        <div className="mt-6 max-w-md mx-auto">
          <p className="text-xs text-muted-foreground/70">
            Searching across multiple job boards to bring you the latest opportunities...
          </p>
        </div>
      </div>
    </div>
  )
} 
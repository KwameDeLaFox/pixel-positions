'use client'

import { type ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface FilterGroupProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function FilterGroup({ 
  title, 
  children, 
  defaultOpen = true, 
  className 
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('border-b border-border pb-4', className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between py-2 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-medium text-sidebar-foreground">{title}</h3>
        <span className="ml-6 flex items-center">
          {isOpen ? (
            <svg
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </span>
      </button>
      
      {isOpen && (
        <div className="pt-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  )
} 
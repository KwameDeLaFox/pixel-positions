'use client'

import React from 'react'
import { useSearch } from '@/hooks/use-search'
import { JobData } from '@/types/job'
import { cn } from '@/lib/utils'

interface EnhancedSearchInputProps {
  value: string
  onChange: (value: string) => void
  jobs: JobData[]
  placeholder?: string
  className?: string
}

interface SearchSuggestion {
  type: 'title' | 'company' | 'skill' | 'location'
  value: string
  count?: number
}

const suggestionIcons = {
  title: '💼',
  company: '🏢', 
  skill: '🛠️',
  location: '📍'
}

const suggestionLabels = {
  title: 'Job Title',
  company: 'Company',
  skill: 'Skill',
  location: 'Location'
}

export function EnhancedSearchInput({ 
  value, 
  onChange, 
  jobs, 
  placeholder = "e.g. Senior Designer, React, Figma...",
  className 
}: EnhancedSearchInputProps) {
  const {
    searchTerm,
    debouncedSearchTerm,
    suggestions,
    showSuggestions,
    handleSearchChange,
    handleSuggestionSelect,
    handleSearchBlur,
    handleSearchFocus,
    clearSearch,
  } = useSearch(jobs, {
    debounceMs: 400,
    minChars: 2,
    maxSuggestions: 6
  })

  // Sync with parent component
  React.useEffect(() => {
    if (debouncedSearchTerm !== value) {
      onChange(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, value, onChange])

  // Update internal state when external value changes
  React.useEffect(() => {
    if (value !== searchTerm) {
      handleSearchChange(value)
    }
  }, [value])

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-input rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="py-2 max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}`}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full px-4 py-2.5 text-left hover:bg-accent transition-colors flex items-center gap-3 group"
              >
                <span className="text-lg flex-shrink-0">
                  {suggestionIcons[suggestion.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-card-foreground font-medium truncate">
                      {suggestion.value}
                    </span>
                    {suggestion.count && suggestion.count > 1 && (
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                        {suggestion.count}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {suggestionLabels[suggestion.type]}
                  </div>
                </div>
                <svg 
                  className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
          
          {/* Suggestion Footer */}
          <div className="border-t border-border bg-muted/50 px-4 py-2">
            <div className="text-xs text-muted-foreground text-center">
              Press Tab or click to select • ESC to dismiss
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
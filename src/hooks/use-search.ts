import { useState, useEffect, useCallback, useMemo } from 'react'
import { JobData } from '@/types/job'

interface UseSearchOptions {
  /** Debounce delay in milliseconds */
  debounceMs?: number
  /** Minimum characters before showing suggestions */
  minChars?: number
  /** Maximum number of suggestions to show */
  maxSuggestions?: number
}

interface SearchSuggestion {
  type: 'title' | 'company' | 'skill' | 'location'
  value: string
  count?: number
}

/**
 * Enhanced search hook with debouncing and suggestions
 */
export function useSearch(
  jobs: JobData[] = [],
  options: UseSearchOptions = {}
) {
  const {
    debounceMs = 400,
    minChars = 2,
    maxSuggestions = 8
  } = options

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceMs])

  // Generate search suggestions from job data
  const suggestions = useMemo((): SearchSuggestion[] => {
    if (!searchTerm || searchTerm.length < minChars) {
      return []
    }

    const query = searchTerm.toLowerCase()
    const suggestionMap = new Map<string, SearchSuggestion>()

    jobs.forEach((job) => {
      // Job titles
      if (job.title.toLowerCase().includes(query)) {
        const titleWords = job.title
          .toLowerCase()
          .split(' ')
          .filter(word => word.includes(query) && word.length >= minChars)
        
        titleWords.forEach(word => {
          if (!suggestionMap.has(word)) {
            suggestionMap.set(word, {
              type: 'title',
              value: word,
              count: 1
            })
          } else {
            suggestionMap.get(word)!.count!++
          }
        })
      }

      // Company names
      if (job.company_name.toLowerCase().includes(query)) {
        const key = job.company_name.toLowerCase()
        if (!suggestionMap.has(key)) {
          suggestionMap.set(key, {
            type: 'company',
            value: job.company_name,
            count: 1
          })
        } else {
          suggestionMap.get(key)!.count!++
        }
      }

      // Skills/Tags
      job.discipline_tags?.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          const key = tag.toLowerCase()
          if (!suggestionMap.has(key)) {
            suggestionMap.set(key, {
              type: 'skill',
              value: tag,
              count: 1
            })
          } else {
            suggestionMap.get(key)!.count!++
          }
        }
      })

      // Locations
      if (job.location_country?.toLowerCase().includes(query)) {
        const key = job.location_country.toLowerCase()
        if (!suggestionMap.has(key)) {
          suggestionMap.set(key, {
            type: 'location',
            value: job.location_country,
            count: 1
          })
        } else {
          suggestionMap.get(key)!.count!++
        }
      }
    })

    // Sort by relevance (count) and type priority
    const typeOrder = { skill: 1, title: 2, company: 3, location: 4 }
    
    return Array.from(suggestionMap.values())
      .sort((a, b) => {
        // First by type priority
        const typeDiff = typeOrder[a.type] - typeOrder[b.type]
        if (typeDiff !== 0) return typeDiff
        
        // Then by count (descending)
        return (b.count || 0) - (a.count || 0)
      })
      .slice(0, maxSuggestions)
  }, [searchTerm, jobs, minChars, maxSuggestions])

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setShowSuggestions(value.length >= minChars)
  }, [minChars])

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.value)
    setDebouncedSearchTerm(suggestion.value)
    setShowSuggestions(false)
  }, [])

  // Handle search blur (hide suggestions)
  const handleSearchBlur = useCallback(() => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 150)
  }, [])

  // Handle search focus (show suggestions if term exists)
  const handleSearchFocus = useCallback(() => {
    if (searchTerm.length >= minChars) {
      setShowSuggestions(true)
    }
  }, [searchTerm, minChars])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
    setShowSuggestions(false)
  }, [])

  return {
    searchTerm,
    debouncedSearchTerm,
    suggestions,
    showSuggestions,
    handleSearchChange,
    handleSuggestionSelect,
    handleSearchBlur,
    handleSearchFocus,
    clearSearch,
  }
} 
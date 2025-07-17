'use client'

import { EMPLOYMENT_TYPES, SENIORITY_LEVELS, LOCATION_REGIONS, TOP_COUNTRIES } from '@/lib/constants'
import { FilterGroup } from './filter-group'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterParams {
  keyword: string
  remote_only: boolean
  location_region: string[]
  location_country: string[]
  employment_type: string[]
  seniority: string[]
}

interface FilterSidebarProps {
  filters: FilterParams
  onFiltersChange: (filters: FilterParams) => void
  className?: string
}

export function FilterSidebar({ filters, onFiltersChange, className }: FilterSidebarProps) {
  const updateFilter = (key: keyof FilterParams, value: string | boolean | string[]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: 'employment_type' | 'seniority' | 'location_region' | 'location_country', value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      keyword: '',
      remote_only: true,
      location_region: [],
      location_country: [],
      employment_type: [],
      seniority: []
    })
  }

  const activeFilterCount = [
    filters.keyword ? 1 : 0,
    filters.employment_type.length,
    filters.seniority.length,
    filters.location_region.length,
    filters.location_country.length
  ].reduce((sum, count) => sum + count, 0)

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border h-full overflow-y-auto",
      className
    )}>
      <div className="p-6">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Filters</h2>
            {activeFilterCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </p>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Keyword Search */}
          <div>
            <label className="block text-sm font-medium text-sidebar-foreground mb-3">
              Search Jobs
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => updateFilter('keyword', e.target.value)}
                placeholder="e.g. Senior Designer, React, Figma..."
                className="w-full pl-10 pr-10 py-2.5 border border-input rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {filters.keyword && (
                <button
                  onClick={() => updateFilter('keyword', '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Remote Toggle */}
          <div>
            <label className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent cursor-pointer">
              <div>
                <span className="text-sm font-medium text-sidebar-foreground">Remote Only</span>
                <p className="text-xs text-muted-foreground mt-1">Show only remote positions</p>
              </div>
              <input
                type="checkbox"
                checked={filters.remote_only}
                onChange={(e) => updateFilter('remote_only', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-ring border-border rounded"
              />
            </label>
          </div>

          {/* Location Region */}
          <FilterGroup title="Location" defaultOpen={true}>
            <div className="space-y-2">
              {LOCATION_REGIONS.map((region) => (
                <label key={region} className="flex items-center space-x-3 p-2 hover:bg-accent rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.location_region.includes(region)}
                    onChange={() => toggleArrayFilter('location_region', region)}
                    className="h-4 w-4 text-primary focus:ring-ring border-border rounded"
                  />
                  <span className="text-sm text-sidebar-foreground">{region}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Country Filter */}
          <FilterGroup title="Country" defaultOpen={false}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {TOP_COUNTRIES.map((country) => (
                <label key={country} className="flex items-center space-x-3 p-2 hover:bg-accent rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.location_country.includes(country)}
                    onChange={() => toggleArrayFilter('location_country', country)}
                    className="h-4 w-4 text-primary focus:ring-ring border-border rounded"
                  />
                  <span className="text-sm text-sidebar-foreground">{country}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Employment Type */}
          <FilterGroup title="Employment Type" defaultOpen={true}>
            <div className="space-y-2">
              {EMPLOYMENT_TYPES.map((type) => (
                <label key={type} className="flex items-center space-x-3 p-2 hover:bg-accent rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.employment_type.includes(type)}
                    onChange={() => toggleArrayFilter('employment_type', type)}
                    className="h-4 w-4 text-primary focus:ring-ring border-border rounded"
                  />
                  <span className="text-sm text-sidebar-foreground capitalize">{type.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Seniority Level */}
          <FilterGroup title="Seniority Level" defaultOpen={true}>
            <div className="space-y-2">
              {SENIORITY_LEVELS.map((level) => (
                <label key={level} className="flex items-center space-x-3 p-2 hover:bg-accent rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.seniority.includes(level)}
                    onChange={() => toggleArrayFilter('seniority', level)}
                    className="h-4 w-4 text-primary focus:ring-ring border-border rounded"
                  />
                  <span className="text-sm text-sidebar-foreground capitalize">{level}</span>
                </label>
              ))}
            </div>
          </FilterGroup>
        </div>
      </div>
    </div>
  )
} 
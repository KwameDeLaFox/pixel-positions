import { JobData } from '@/types/job'
import { Button } from '@/components/ui/button'
import { cn, formatRelativeTime } from '@/lib/utils'
import { extractJobDescriptionPreview } from '@/lib/description-utils'

interface JobCardProps {
  job: JobData
  onClick?: () => void
  className?: string
}

/**
 * Generate a consistent color for company logos based on company name
 */
function getCompanyColor(companyName: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
  ]
  
  // Simple hash function to get consistent color
  let hash = 0
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

export function JobCard({ job, onClick, className }: JobCardProps) {
  const companyColor = getCompanyColor(job.company_name)
  
  return (
    <div 
      className={cn(
        'bg-card rounded-lg border border-border transition-all duration-200',
        'hover:shadow-md hover:border-border cursor-pointer',
        // Mobile-optimized padding and touch targets
        'p-4 sm:p-6',
        // Active/tap states for mobile
        'active:transform active:scale-[0.98] active:shadow-sm',
        className
      )}
      onClick={onClick}
    >
      {/* Header with logo and company */}
      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        {/* Company letter avatar - responsive sizing */}
        <div 
          className={cn(
            'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white font-bold',
            'text-base sm:text-lg flex-shrink-0',
            companyColor
          )}
        >
          {job.company_name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground leading-tight text-base sm:text-lg line-clamp-2">
            {job.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 truncate">
            {job.company_name}
          </p>
        </div>
        
        {job.featured && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0">
            Featured
          </span>
        )}
      </div>

      {/* Job details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="truncate">📍 {job.location_raw}</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1.5 rounded-full">
            {job.employment_type.replace('-', ' ')}
          </span>
          <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1.5 rounded-full">
            {job.seniority}
          </span>
        </div>
        
        {job.salary_min && job.salary_max && (
          <div className="text-sm text-muted-foreground">
            💰 ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} {job.currency || 'USD'}
          </div>
        )}
        
        {job.discipline_tags && job.discipline_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {job.discipline_tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {job.discipline_tags.length > 3 && (
              <span className="text-muted-foreground text-xs px-2 py-1">
                +{job.discipline_tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Job description preview */}
        {job.description_html && (
          <div className="text-sm text-muted-foreground line-clamp-2">
            {extractJobDescriptionPreview(job.description_html, 120)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatRelativeTime(job.published_at)}</span>
          <span>•</span>
          <span className="capitalize">{job.source}</span>
        </div>
        
        <Button 
          size="sm" 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          View Details
        </Button>
      </div>
    </div>
  )
} 
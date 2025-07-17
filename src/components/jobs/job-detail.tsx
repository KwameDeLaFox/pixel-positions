import { JobData } from '@/types/job'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { JobDescription } from './job-description'

interface JobDetailProps {
  job: JobData
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

export function JobDetail({ job }: JobDetailProps) {
  const companyColor = getCompanyColor(job.company_name)
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {/* Company letter avatar */}
        <div 
          className={cn(
            'w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl',
            companyColor
          )}
        >
          {job.company_name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground mb-2">
                {job.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-3">
                {job.company_name}
              </p>
            </div>
            
            {job.featured && (
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
          
          {/* Key details */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              📍 {job.location_raw}
            </span>
            <span className="flex items-center gap-1">
              💼 {job.employment_type}
            </span>
            <span className="flex items-center gap-1">
              📊 {job.seniority}
            </span>
            <span className="flex items-center gap-1">
              📅 {new Date(job.published_at).toLocaleDateString()}
            </span>
          </div>
          
          {/* Salary */}
          {job.salary_min && job.salary_max && (
            <div className="text-lg font-semibold text-primary mb-4">
              💰 ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} {job.currency || 'USD'}
            </div>
          )}
        </div>
      </div>

      {/* Apply Button - Prominent at top */}
      <div className="mb-8">
        <Button 
          size="lg"
          onClick={() => {
            window.open(job.source_job_url, '_blank')
          }}
          className="text-lg px-8 py-3"
        >
          Apply on Company Site →
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          You&apos;ll be redirected to {job.company_name}&apos;s website
        </p>
      </div>

      {/* Tags */}
      {job.discipline_tags && job.discipline_tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-3">Skills & Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {job.discipline_tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-secondary text-secondary-foreground text-sm px-3 py-2 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Job Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-card-foreground mb-4">Job Description</h3>
        <JobDescription html={job.description_html || ''} />
      </div>

      {/* Two column layout for details */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Location Details */}
        <div className="bg-muted rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Location Details</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Location:</strong> {job.location_raw}</p>
            {job.location_city && <p><strong>City:</strong> {job.location_city}</p>}
            {job.location_country && <p><strong>Country:</strong> {job.location_country}</p>}
            {job.location_region && <p><strong>Region:</strong> {job.location_region}</p>}
            <p><strong>Remote Work:</strong> {job.remote ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Job Information */}
        <div className="bg-muted rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Job Information</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Employment Type:</strong> {job.employment_type}</p>
            <p><strong>Seniority Level:</strong> {job.seniority}</p>
            <p><strong>Source:</strong> {job.source}</p>
            <p><strong>Posted Date:</strong> {new Date(job.published_at).toLocaleDateString()}</p>
            {job.expires_at && (
              <p><strong>Expires:</strong> {new Date(job.expires_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Apply Section */}
      <div className="bg-muted rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">
          Ready to Apply?
        </h3>
        <p className="text-muted-foreground mb-4">
          Take the next step in your design career with {job.company_name}
        </p>
        <Button 
          size="lg"
          onClick={() => {
            window.open(job.source_job_url, '_blank')
          }}
          className="text-lg px-8 py-3"
        >
          Apply on Company Site →
        </Button>
      </div>
    </div>
  )
} 
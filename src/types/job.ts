/**
 * Job data interface following PixelPositions schema
 */
export interface JobData {
  id: string
  title: string
  company_name: string
  location_raw: string
  location_city?: string
  location_country?: string
  location_region?: 'EMEA' | 'Americas' | 'APAC' | 'Worldwide'
  remote?: boolean
  discipline_tags?: string[]
  employment_type: 'full-time' | 'part-time' | 'contract' | 'freelance'
  seniority: 'intern' | 'junior' | 'mid' | 'senior' | 'lead'
  salary_min?: number
  salary_max?: number
  currency?: string
  source: 'Remotive' | 'JSearch'
  source_job_url: string
  published_at: string
  expires_at?: string
  featured?: boolean
  description_html?: string
  company_logo_url?: string
}

/**
 * Filter parameters for job search
 */
export interface FilterParams {
  keyword?: string
  location_region?: string[]
  location_country?: string[]
  employment_type?: string[]
  seniority?: string[]
  remote_only?: boolean
}

/**
 * Parsed location data
 */
export interface ParsedLocation {
  city?: string
  country?: string
  region?: 'EMEA' | 'Americas' | 'APAC' | 'Worldwide'
  remote: boolean
} 
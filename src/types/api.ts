import { JobData } from './job'

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

/**
 * Paginated response for job listings
 */
export interface PaginatedJobsResponse {
  jobs: JobData[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

/**
 * Remotive API response structure
 */
export interface RemotiveApiResponse {
  'job-count': number
  jobs: RemotiveJob[]
}

export interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name: string
  category: string
  tags: string[]
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary?: string
  description: string
  company_logo_url?: string
}

/**
 * JSearch API response structure
 */
export interface JSearchApiResponse {
  status: string
  request_id: string
  parameters: object
  data: JSearchJob[]
  num_pages?: number
}

export interface JSearchJob {
  job_id: string
  employer_name: string
  job_title: string
  job_description: string
  job_apply_link: string
  job_city?: string
  job_country?: string
  job_posted_at_timestamp?: number
  job_employment_type?: string
  job_is_remote?: boolean
  employer_logo?: string
}

/**
 * API error response
 */
export interface ApiError {
  message: string
  status: number
  code?: string
} 
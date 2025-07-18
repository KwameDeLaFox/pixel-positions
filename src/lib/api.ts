import { JobData, FilterParams } from '@/types/job'
import { RemotiveApiResponse, JSearchApiResponse, RemotiveJob, JSearchJob } from '@/types/api'
import { API_ENDPOINTS } from './constants'
import { enhanceJobData, parseSalary } from './data-quality'

/**
 * Custom API Error class
 */
class ApiError extends Error {
  status: number
  code?: string

  constructor({ message, status, code }: { message: string; status: number; code?: string }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/**
 * Generic API fetch wrapper with error handling
 */
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new ApiError({
        message: `API request failed: ${response.statusText}`,
        status: response.status,
      })
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError({
        message: error.message,
        status: 500,
      })
    }
    throw error
  }
}

/**
 * Fetch jobs from Remotive API
 */
export async function fetchRemotiveJobs(category = 'design'): Promise<RemotiveApiResponse> {
  const url = `${API_ENDPOINTS.REMOTIVE}?category=${category}`
  return apiRequest<RemotiveApiResponse>(url)
}

/**
 * Fetch jobs from JSearch API
 */
export async function fetchJSearchJobs(
  query: string,
  filters?: FilterParams
): Promise<JSearchApiResponse> {
  const params = new URLSearchParams({
    query,
    remote_jobs_only: filters?.remote_only?.toString() || 'true',
    employment_types: filters?.employment_type?.join(',') || '',
    date_posted: 'month', // Default to last month
    page: '1',
    num_pages: '1',
  })

  const url = `${API_ENDPOINTS.JSEARCH}?${params}`
  
  return apiRequest<JSearchApiResponse>(url, {
    headers: {
      'X-RapidAPI-Key': process.env.JSEARCH_API_KEY || '',
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  })
}

/**
 * Transform Remotive job to our JobData format
 */
export function transformRemotiveJob(job: RemotiveJob): JobData {
  const salary = parseSalary(job.salary)
  
  const baseJob: JobData = {
    id: `remotive-${job.id}`,
    title: job.title,
    company_name: job.company_name,
    location_raw: job.candidate_required_location,
    employment_type: job.job_type?.toLowerCase() as JobData['employment_type'] || 'full-time',
    seniority: 'mid', // Will be enhanced
    source: 'Remotive',
    source_job_url: job.url,
    published_at: job.publication_date,
    description_html: job.description,
    company_logo_url: job.company_logo_url,
    discipline_tags: job.tags || [],
    salary_min: salary.min,
    salary_max: salary.max,
    currency: salary.currency,
    remote: true, // All Remotive jobs are remote by definition
  }
  
  // Enhance data quality
  return enhanceJobData(baseJob)
}

/**
 * Transform JSearch job to our JobData format
 */
export function transformJSearchJob(job: JSearchJob): JobData {
  // Extract salary information if available
  const salary = parseSalary(job.job_description || '')
  
  const baseJob: JobData = {
    id: `jsearch-${job.job_id}`,
    title: job.job_title,
    company_name: job.employer_name,
    location_raw: `${job.job_city || ''}, ${job.job_country || ''}`.trim().replace(/^,\s*/, ''),
    employment_type: job.job_employment_type?.toLowerCase() as JobData['employment_type'] || 'full-time',
    seniority: 'mid', // Will be enhanced
    source: 'JSearch',
    source_job_url: job.job_apply_link,
    published_at: job.job_posted_at_timestamp 
      ? new Date(job.job_posted_at_timestamp * 1000).toISOString()
      : new Date().toISOString(),
    description_html: job.job_description,
    company_logo_url: job.employer_logo,
    remote: job.job_is_remote,
    salary_min: salary.min,
    salary_max: salary.max,
    currency: salary.currency,
    location_city: job.job_city,
    location_country: job.job_country,
  }
  
  // Enhance data quality
  return enhanceJobData(baseJob)
}

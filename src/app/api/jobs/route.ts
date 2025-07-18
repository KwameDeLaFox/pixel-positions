import { NextRequest, NextResponse } from 'next/server'
import { fetchRemotiveJobs, fetchJSearchJobs, transformRemotiveJob, transformJSearchJob } from '@/lib/api'
import { FilterParams, JobData } from '@/types/job'
import { RemotiveJob, JSearchJob } from '@/types/api'
import { parseLocation } from '@/lib/location-parser'
import { deduplicateJobs, getDeduplicationStats } from '@/lib/deduplication'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Extract filters from query parameters
    const filters: FilterParams = {
      keyword: searchParams.get('keyword') || '',
      remote_only: searchParams.get('remote_only') === 'true',
      employment_type: searchParams.get('employment_type')?.split(',') || [],
      seniority: searchParams.get('seniority')?.split(',') || [],
      location_region: searchParams.get('location_region')?.split(',') || [],
      location_country: searchParams.get('location_country')?.split(',') || [],
    }

    console.log('Fetching jobs with filters:', filters)

    // Prepare job collections
    const allJobs: JobData[] = []
    const apiErrors: string[] = []

    try {
      // Fetch from Remotive API (design category)
      console.log('Fetching from Remotive API...')
      const remotiveResponse = await fetchRemotiveJobs('design')
      
      const remotiveJobs = remotiveResponse.jobs.map((job: RemotiveJob) => {
        const transformedJob = transformRemotiveJob(job)
        
        // Parse location data
        const parsedLocation = parseLocation(transformedJob.location_raw)
        
        return {
          ...transformedJob,
          location_city: parsedLocation.city,
          location_country: parsedLocation.country,
          location_region: parsedLocation.region,
          remote: parsedLocation.remote,
        }
      })
      
      allJobs.push(...remotiveJobs)
      console.log(`Fetched ${remotiveJobs.length} jobs from Remotive`)
      
    } catch (error) {
      console.error('Remotive API error:', error)
      apiErrors.push(`Remotive: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Note: JSearch integration removed to avoid expensive API calls
    console.log('JSearch API integration disabled to conserve API credits')

    // Since we're only using one source now, no deduplication needed
    const filteredJobs = allJobs

    // Apply filters
    let finalJobs = filteredJobs

    // Keyword filter
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      finalJobs = finalJobs.filter((job: JobData) => 
        job.title.toLowerCase().includes(keyword) ||
        job.company_name.toLowerCase().includes(keyword) ||
        job.discipline_tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
      )
    }

    // Remote filter - only apply if explicitly set to true
    if (filters.remote_only === true) {
      finalJobs = finalJobs.filter((job: JobData) => job.remote)
    }
    // If remote_only is false or undefined, show all jobs (both remote and non-remote)

    // Employment type filter
    if (filters.employment_type && filters.employment_type.length > 0) {
      finalJobs = finalJobs.filter((job: JobData) => 
        filters.employment_type!.includes(job.employment_type)
      )
    }

    // Seniority filter
    if (filters.seniority && filters.seniority.length > 0) {
      finalJobs = finalJobs.filter((job: JobData) => 
        filters.seniority!.includes(job.seniority)
      )
    }

    // Region filter
    if (filters.location_region && filters.location_region.length > 0) {
      finalJobs = finalJobs.filter((job: JobData) => 
        job.location_region && filters.location_region!.includes(job.location_region)
      )
    }

    // Country filter
    if (filters.location_country && filters.location_country.length > 0) {
      finalJobs = finalJobs.filter((job: JobData) => 
        job.location_country && filters.location_country!.includes(job.location_country)
      )
    }

    console.log(`Returning ${finalJobs.length} filtered jobs from ${allJobs.length} total Remotive jobs`)

    return NextResponse.json({
      jobs: finalJobs,
      total: finalJobs.length,
      sources: { 'Remotive': allJobs.length },
      errors: apiErrors.length > 0 ? apiErrors : undefined
    })

  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch jobs', 
        message: error instanceof Error ? error.message : 'Unknown error',
        jobs: [],
        total: 0
      }, 
      { status: 500 }
    )
  }
} 
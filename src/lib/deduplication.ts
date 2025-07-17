import { JobData } from '@/types/job'
import { JOB_SOURCES } from './constants'

/**
 * Calculate similarity between two strings using Levenshtein distance
 * Returns a percentage (0-100) where 100 is identical
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  
  if (s1 === s2) return 100
  if (s1.length === 0 || s2.length === 0) return 0
  
  const matrix: number[][] = []
  
  // Initialize matrix
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j
  }
  
  // Fill matrix
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )
    }
  }
  
  const distance = matrix[s1.length][s2.length]
  const maxLength = Math.max(s1.length, s2.length)
  
  return Math.round(((maxLength - distance) / maxLength) * 100)
}

/**
 * Check if two jobs are duplicates based on fuzzy matching
 * Uses title + company + location_country for matching
 * Requires 85% similarity and published within 7 days of each other
 */
function isDuplicate(job1: JobData, job2: JobData): boolean {
  // Quick checks first
  if (job1.id === job2.id) return true
  if (job1.source === job2.source) return false // Same source, not a duplicate
  
  // Calculate similarities
  const titleSimilarity = calculateSimilarity(job1.title, job2.title)
  const companySimilarity = calculateSimilarity(job1.company_name, job2.company_name)
  const locationSimilarity = calculateSimilarity(
    job1.location_country || job1.location_raw,
    job2.location_country || job2.location_raw
  )
  
  // Check if they meet similarity threshold
  const avgSimilarity = (titleSimilarity + companySimilarity + locationSimilarity) / 3
  const similarityThreshold = 85
  
  if (avgSimilarity < similarityThreshold) return false
  
  // Check publication date overlap (within 7 days)
  const date1 = new Date(job1.published_at)
  const date2 = new Date(job2.published_at)
  const daysDifference = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
  
  return daysDifference <= 7
}

/**
 * Get source priority for deduplication
 * Lower numbers = higher priority
 */
function getSourcePriority(source: JobData['source']): number {
  return JOB_SOURCES[source] || 999
}

/**
 * Deduplicate jobs array based on fuzzy matching
 * Keeps the job from the highest priority source
 * Priority order: Manual > JSearch > Remotive
 */
export function deduplicateJobs(jobs: JobData[]): JobData[] {
  const uniqueJobs: JobData[] = []
  const duplicateGroups: JobData[][] = []
  
  // Group duplicates
  for (const job of jobs) {
    let foundGroup = false
    
    for (const group of duplicateGroups) {
      if (group.some(existingJob => isDuplicate(job, existingJob))) {
        group.push(job)
        foundGroup = true
        break
      }
    }
    
    if (!foundGroup) {
      duplicateGroups.push([job])
    }
  }
  
  // Select best job from each group
  for (const group of duplicateGroups) {
    if (group.length === 1) {
      uniqueJobs.push(group[0])
    } else {
      // Sort by priority and pick the highest priority job
      const bestJob = group.sort((a, b) => {
        const priorityA = getSourcePriority(a.source)
        const priorityB = getSourcePriority(b.source)
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }
        
        // If same priority, prefer more recent publication
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      })[0]
      
      uniqueJobs.push(bestJob)
    }
  }
  
  return uniqueJobs
}

/**
 * Get deduplication statistics
 */
export function getDeduplicationStats(originalJobs: JobData[], deduplicatedJobs: JobData[]) {
  const duplicatesRemoved = originalJobs.length - deduplicatedJobs.length
  const duplicateRate = originalJobs.length > 0 ? (duplicatesRemoved / originalJobs.length) * 100 : 0
  
  const sourceStats = deduplicatedJobs.reduce((acc, job) => {
    acc[job.source] = (acc[job.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return {
    originalCount: originalJobs.length,
    deduplicatedCount: deduplicatedJobs.length,
    duplicatesRemoved,
    duplicateRate: Math.round(duplicateRate * 100) / 100,
    sourceBreakdown: sourceStats
  }
} 
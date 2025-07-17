import { JobData } from '@/types/job'

/**
 * Parse seniority level from job title and description
 */
export function parseSeniority(title: string, description?: string): JobData['seniority'] {
  const text = `${title} ${description || ''}`.toLowerCase()
  
  // Senior level indicators
  if (text.match(/\b(senior|sr\.?|lead|principal|staff|architect|head of|director)\b/)) {
    return 'senior'
  }
  
  // Lead level indicators
  if (text.match(/\b(lead|team lead|tech lead|design lead)\b/)) {
    return 'lead'
  }
  
  // Junior level indicators
  if (text.match(/\b(junior|jr\.?|entry|graduate|trainee|associate)\b/)) {
    return 'junior'
  }
  
  // Intern level indicators
  if (text.match(/\b(intern|internship|student|co-op|coop)\b/)) {
    return 'intern'
  }
  
  // Default to mid if no clear indicators
  return 'mid'
}

/**
 * Parse employment type from job data
 */
export function parseEmploymentType(
  jobType?: string, 
  title?: string, 
  description?: string
): JobData['employment_type'] {
  const text = `${jobType || ''} ${title || ''} ${description || ''}`.toLowerCase()
  
  // Contract/freelance indicators
  if (text.match(/\b(contract|contractor|freelance|consultant|temp|temporary|project-based)\b/)) {
    return 'contract'
  }
  
  // Part-time indicators
  if (text.match(/\b(part.?time|part.time|parttime|p\/t)\b/)) {
    return 'part-time'
  }
  
  // Freelance indicators
  if (text.match(/\b(freelance|freelancer|independent|gig)\b/)) {
    return 'freelance'
  }
  
  // Default to full-time
  return 'full-time'
}

/**
 * Standardize salary information
 */
export function parseSalary(salaryText?: string): {
  min?: number
  max?: number
  currency?: string
} {
  if (!salaryText) return {}
  
  const text = salaryText.toLowerCase().replace(/,/g, '')
  
  // Extract currency
  let currency = 'USD' // default
  if (text.includes('€') || text.includes('eur')) currency = 'EUR'
  if (text.includes('£') || text.includes('gbp')) currency = 'GBP'
  if (text.includes('cad')) currency = 'CAD'
  if (text.includes('aud')) currency = 'AUD'
  
  // Extract numbers (look for salary ranges)
  const numberRegex = /\$?(\d+(?:\.\d+)?)[k]?/g
  const matches = text.match(numberRegex)
  
  if (!matches) return { currency }
  
  const numbers = matches
    .map(match => {
      const num = parseFloat(match.replace(/[$k]/g, ''))
      // Convert k notation to full number
      return match.includes('k') ? num * 1000 : num
    })
    .filter(num => num > 1000) // Filter out unrealistic low numbers
    .sort((a, b) => a - b)
  
  if (numbers.length >= 2) {
    return {
      min: numbers[0],
      max: numbers[numbers.length - 1],
      currency
    }
  } else if (numbers.length === 1) {
    return {
      min: numbers[0],
      currency
    }
  }
  
  return { currency }
}

/**
 * Extract and clean discipline tags from job data
 */
export function extractDisciplineTags(
  title: string,
  description?: string,
  existingTags?: string[]
): string[] {
  const text = `${title} ${description || ''}`.toLowerCase()
  const tags = new Set<string>(existingTags?.map(tag => tag.toLowerCase()) || [])
  
  // Design-related keywords
  const designKeywords = [
    'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'indesign',
    'ui/ux', 'ui', 'ux', 'user experience', 'user interface',
    'prototype', 'prototyping', 'wireframe', 'wireframing',
    'visual design', 'graphic design', 'web design', 'mobile design',
    'interaction design', 'motion design', 'animation',
    'design system', 'design systems', 'branding', 'brand design',
    'typography', 'layout', 'color theory'
  ]
  
  designKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      tags.add(keyword)
    }
  })
  
  // Remove duplicates and convert back to array
  return Array.from(tags)
    .filter(tag => tag.length > 2) // Remove very short tags
    .slice(0, 10) // Limit to 10 tags max
}

/**
 * Clean and standardize job description HTML
 */
export function cleanJobDescription(html?: string): string {
  if (!html) return ''
  
  // Remove excessive whitespace and clean up HTML
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Enhance job data quality by applying all parsing functions
 */
export function enhanceJobData(job: JobData): JobData {
  const enhanced: JobData = { ...job }
  
  // Parse seniority if not already set or if set to default 'mid'
  if (!job.seniority || job.seniority === 'mid') {
    enhanced.seniority = parseSeniority(job.title, job.description_html)
  }
  
  // Parse employment type if not already set or if set to default 'full-time'
  if (!job.employment_type || job.employment_type === 'full-time') {
    enhanced.employment_type = parseEmploymentType(
      job.employment_type,
      job.title,
      job.description_html
    )
  }
  
  // Extract discipline tags
  enhanced.discipline_tags = extractDisciplineTags(
    job.title,
    job.description_html,
    job.discipline_tags
  )
  
  // Clean description
  if (job.description_html) {
    enhanced.description_html = cleanJobDescription(job.description_html)
  }
  
  return enhanced
} 
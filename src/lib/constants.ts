/**
 * API endpoints and configuration
 */
export const API_ENDPOINTS = {
  REMOTIVE: 'https://remotive.com/api/remote-jobs',
  JSEARCH: 'https://jsearch.p.rapidapi.com/search',
} as const

/**
 * Job board configuration
 */
export const JOB_BOARD_CONFIG = {
  JOBS_PER_PAGE: 20,
  MAX_JOBS_PER_REQUEST: 100,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  JOB_EXPIRY_DAYS: 60,
} as const

/**
 * Filter options
 */
export const EMPLOYMENT_TYPES = [
  'full-time',
  'part-time', 
  'contract',
  'freelance'
] as const

export const SENIORITY_LEVELS = [
  'intern',
  'junior',
  'mid',
  'senior',
  'lead'
] as const

export const LOCATION_REGIONS = [
  'Worldwide',
  'Americas',
  'EMEA',
  'APAC'
] as const

export const TOP_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
  'Netherlands',
  'France',
  'Australia',
  'Sweden',
  'Denmark',
  'Switzerland'
] as const

/**
 * Job sources with priority order for deduplication
 */
export const JOB_SOURCES = {
  Manual: 1,
  JSearch: 2,
  Remotive: 3,
} as const

/**
 * Default filter values
 */
export const DEFAULT_FILTERS = {
  remote_only: true,
  location_region: ['Worldwide'],
  employment_type: [],
  seniority: [],
  keyword: '',
} as const 
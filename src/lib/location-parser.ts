import { ParsedLocation } from '@/types/job'

/**
 * Location parsing patterns and mappings
 */
const LOCATION_PATTERNS = {
  // Remote patterns
  remote: /\b(remote|anywhere|worldwide|global|distributed|work from home|wfh)\b/i,
  
  // Country patterns with variations
  countries: {
    // Americas
    'United States': /\b(usa?|united states|america|us\b)/i,
    'Canada': /\b(canada|canadian)\b/i,
    'Mexico': /\b(mexico|mexican)\b/i,
    'Brazil': /\b(brazil|brazilian)\b/i,
    'Argentina': /\b(argentina|argentinian)\b/i,
    
    // EMEA
    'United Kingdom': /\b(uk|united kingdom|britain|british|england|scotland|wales)\b/i,
    'Germany': /\b(germany|german|deutschland)\b/i,
    'France': /\b(france|french)\b/i,
    'Netherlands': /\b(netherlands|dutch|holland)\b/i,
    'Sweden': /\b(sweden|swedish)\b/i,
    'Denmark': /\b(denmark|danish)\b/i,
    'Norway': /\b(norway|norwegian)\b/i,
    'Finland': /\b(finland|finnish)\b/i,
    'Ireland': /\b(ireland|irish)\b/i,
    'Switzerland': /\b(switzerland|swiss)\b/i,
    'Austria': /\b(austria|austrian)\b/i,
    'Spain': /\b(spain|spanish)\b/i,
    'Italy': /\b(italy|italian)\b/i,
    'Poland': /\b(poland|polish)\b/i,
    'Czech Republic': /\b(czech republic|czechia|czech)\b/i,
    'Portugal': /\b(portugal|portuguese)\b/i,
    'Belgium': /\b(belgium|belgian)\b/i,
    
    // APAC
    'Australia': /\b(australia|australian|aus)\b/i,
    'Singapore': /\b(singapore|singaporean)\b/i,
    'Japan': /\b(japan|japanese)\b/i,
    'South Korea': /\b(south korea|korea|korean)\b/i,
    'India': /\b(india|indian)\b/i,
    'New Zealand': /\b(new zealand|nz)\b/i,
  },
  
  // Region indicators
  regions: {
    'EMEA': /\b(emea|europe|european|eu)\b/i,
    'Americas': /\b(americas?|north america|south america|latam)\b/i,
    'APAC': /\b(apac|asia pacific|asian)\b/i,
  }
} as const

/**
 * Country to region mapping
 */
const COUNTRY_TO_REGION: Record<string, 'EMEA' | 'Americas' | 'APAC'> = {
  // Americas
  'United States': 'Americas',
  'Canada': 'Americas',
  'Mexico': 'Americas',
  'Brazil': 'Americas',
  'Argentina': 'Americas',
  
  // EMEA
  'United Kingdom': 'EMEA',
  'Germany': 'EMEA',
  'France': 'EMEA',
  'Netherlands': 'EMEA',
  'Sweden': 'EMEA',
  'Denmark': 'EMEA',
  'Norway': 'EMEA',
  'Finland': 'EMEA',
  'Ireland': 'EMEA',
  'Switzerland': 'EMEA',
  'Austria': 'EMEA',
  'Spain': 'EMEA',
  'Italy': 'EMEA',
  'Poland': 'EMEA',
  'Czech Republic': 'EMEA',
  'Portugal': 'EMEA',
  'Belgium': 'EMEA',
  
  // APAC
  'Australia': 'APAC',
  'Singapore': 'APAC',
  'Japan': 'APAC',
  'South Korea': 'APAC',
  'India': 'APAC',
  'New Zealand': 'APAC',
}

/**
 * Parse raw location string to extract structured location data
 * @param locationRaw - Original location string from API
 * @returns Parsed location data with country, city, region, and remote status
 */
export function parseLocation(locationRaw: string): ParsedLocation {
  const location = locationRaw.toLowerCase().trim()
  
  // Check if remote
  const isRemote = LOCATION_PATTERNS.remote.test(location)
  
  // Extract country
  let country: string | undefined
  let region: 'EMEA' | 'Americas' | 'APAC' | 'Worldwide' | undefined
  
  // Try to match countries first
  for (const [countryName, pattern] of Object.entries(LOCATION_PATTERNS.countries)) {
    if (pattern.test(location)) {
      country = countryName
      region = COUNTRY_TO_REGION[countryName]
      break
    }
  }
  
  // If no country found, try to match regions
  if (!region) {
    for (const [regionName, pattern] of Object.entries(LOCATION_PATTERNS.regions)) {
      if (pattern.test(location)) {
        region = regionName as 'EMEA' | 'Americas' | 'APAC'
        break
      }
    }
  }
  
  // Extract city (simple approach - take first part before comma)
  let city: string | undefined
  const parts = locationRaw.split(',').map(p => p.trim())
  if (parts.length > 1 && !isRemote) {
    // If multiple parts, first might be city
    const firstPart = parts[0]
    if (!/\b(remote|worldwide|global)\b/i.test(firstPart)) {
      city = firstPart
    }
  }
  
  // Handle worldwide/global cases
  if (isRemote && /\b(worldwide|global)\b/i.test(location)) {
    region = 'Worldwide'
  }
  
  return {
    city,
    country,
    region,
    remote: isRemote,
  }
}

/**
 * Test cases for location parsing
 */
export const LOCATION_TEST_CASES = [
  // Remote cases
  { input: 'Remote - Worldwide', expected: { remote: true, region: 'Worldwide' } },
  { input: 'Remote - EU', expected: { remote: true, region: 'EMEA' } },
  { input: 'Remote - Americas', expected: { remote: true, region: 'Americas' } },
  { input: 'Work from home', expected: { remote: true } },
  
  // Specific locations
  { input: 'San Francisco, USA', expected: { city: 'San Francisco', country: 'United States', region: 'Americas', remote: false } },
  { input: 'London, UK', expected: { city: 'London', country: 'United Kingdom', region: 'EMEA', remote: false } },
  { input: 'Berlin, Germany', expected: { city: 'Berlin', country: 'Germany', region: 'EMEA', remote: false } },
  { input: 'Sydney, Australia', expected: { city: 'Sydney', country: 'Australia', region: 'APAC', remote: false } },
  
  // Country only
  { input: 'Netherlands', expected: { country: 'Netherlands', region: 'EMEA', remote: false } },
  { input: 'Canada', expected: { country: 'Canada', region: 'Americas', remote: false } },
  
  // Mixed cases
  { input: 'Paris, France (Remote possible)', expected: { city: 'Paris', country: 'France', region: 'EMEA', remote: true } },
] as const 
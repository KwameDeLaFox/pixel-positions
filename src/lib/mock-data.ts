import { JobData } from '@/types/job'
import { parseLocation } from './location-parser'

/**
 * Helper function to create mock job with parsed location data
 */
function createMockJob(job: Omit<JobData, 'location_city' | 'location_country' | 'location_region'>): JobData {
  const parsedLocation = parseLocation(job.location_raw)
  
  return {
    ...job,
    location_city: parsedLocation.city,
    location_country: parsedLocation.country,
    location_region: parsedLocation.region,
    remote: parsedLocation.remote,
  }
}

/**
 * Comprehensive mock job data for testing
 * Represents realistic design job listings with varied requirements
 */
export const MOCK_JOBS: JobData[] = [
  // Senior Product Designer roles
  createMockJob({
    id: 'mock-001',
    title: 'Senior Product Designer',
    company_name: 'Stripe',
    location_raw: 'San Francisco, USA',
    employment_type: 'full-time',
    seniority: 'senior',
    source: 'JSearch',
    source_job_url: 'https://stripe.com/jobs',
    published_at: '2024-01-15T10:00:00Z',
    description_html: `
      <p>We're looking for a Senior Product Designer to join our Core Product team. You'll be responsible for designing user experiences that help millions of businesses grow their revenue.</p>
      <h3>Responsibilities:</h3>
      <ul>
        <li>Design end-to-end experiences for complex financial products</li>
        <li>Collaborate with engineering, product, and business teams</li>
        <li>Conduct user research and usability testing</li>
        <li>Create high-fidelity prototypes and design systems</li>
      </ul>
    `,
    discipline_tags: ['Product Design', 'Fintech', 'User Research', 'Design Systems'],
    featured: true,
    salary_min: 140000,
    salary_max: 200000,
    currency: 'USD',
    // Using initials for MVP - more reliable than external logos
  }),

  createMockJob({
    id: 'mock-002',
    title: 'UX Designer - Design Systems',
    company_name: 'Figma',
    location_raw: 'Remote - Worldwide',
    employment_type: 'full-time',
    seniority: 'mid',
    source: 'Remotive',
    source_job_url: 'https://figma.com/careers',
    published_at: '2024-01-14T14:30:00Z',
    description_html: `
      <p>Join our Design Systems team to help scale design across one of the fastest-growing design tools. You'll work on components, tokens, and guidelines used by millions of designers.</p>
      <h3>What you'll do:</h3>
      <ul>
        <li>Design and maintain Figma's design system components</li>
        <li>Partner with engineering on implementation</li>
        <li>Document patterns and best practices</li>
        <li>Support internal teams adopting the design system</li>
      </ul>
    `,
    discipline_tags: ['Design Systems', 'Component Design', 'Documentation', 'Collaboration'],
    featured: false,
    salary_min: 120000,
    salary_max: 160000,
    currency: 'USD'
  }),

  createMockJob({
    id: 'mock-003',
    title: 'Lead UI/UX Designer',
    company_name: 'N26',
    location_raw: 'Berlin, Germany',
    employment_type: 'full-time',
    seniority: 'lead',
    source: 'JSearch',
    source_job_url: 'https://n26.com/careers',
    published_at: '2024-01-13T09:15:00Z',
    description_html: `
      <p>Lead the design of mobile banking experiences for millions of customers across Europe. Shape the future of digital banking with innovative, user-centered design.</p>
      <h3>Key responsibilities:</h3>
      <ul>
        <li>Lead a team of 4-5 designers</li>
        <li>Define design strategy for mobile banking features</li>
        <li>Collaborate with product and engineering leadership</li>
        <li>Mentor junior designers and establish design culture</li>
      </ul>
    `,
    discipline_tags: ['Leadership', 'Mobile Design', 'Banking', 'Team Management'],
    featured: true,
    salary_min: 85000,
    salary_max: 120000,
    currency: 'EUR',
  }),

  createMockJob({
    id: 'mock-004',
    title: 'Junior Product Designer',
    company_name: 'Monzo',
    location_raw: 'London, UK',
    employment_type: 'full-time',
    seniority: 'junior',
    source: 'JSearch',
    source_job_url: 'https://monzo.com/careers',
    published_at: '2024-01-12T16:45:00Z',
    description_html: `
      <p>Start your career in fintech design with one of the UK's most innovative banks. You'll work on features that help people manage their money better.</p>
      <h3>You'll learn to:</h3>
      <ul>
        <li>Design mobile-first banking experiences</li>
        <li>Conduct user interviews and usability tests</li>
        <li>Create wireframes, prototypes, and high-fidelity designs</li>
        <li>Collaborate in an agile development environment</li>
      </ul>
    `,
    discipline_tags: ['Mobile Design', 'User Research', 'Prototyping', 'Fintech'],
    featured: false,
    salary_min: 45000,
    salary_max: 65000,
    currency: 'GBP'
  }),

  createMockJob({
    id: 'mock-005',
    title: 'Senior Visual Designer',
    company_name: 'Shopify',
    location_raw: 'Remote - Americas',
    employment_type: 'full-time',
    seniority: 'senior',
    source: 'Remotive',
    source_job_url: 'https://shopify.com/careers',
    published_at: '2024-01-11T11:20:00Z',
    description_html: `
      <p>Create stunning visual designs for Shopify's marketing, brand, and product teams. Help millions of entrepreneurs build beautiful online stores.</p>
      <h3>What you'll create:</h3>
      <ul>
        <li>Brand campaigns and marketing materials</li>
        <li>Product illustrations and iconography</li>
        <li>Website and landing page designs</li>
        <li>Event and conference materials</li>
      </ul>
    `,
    discipline_tags: ['Visual Design', 'Branding', 'Marketing', 'Illustration'],
    featured: false,
    salary_min: 100000,
    salary_max: 140000,
    currency: 'CAD'
  }),

  createMockJob({
    id: 'mock-006',
    title: 'UX Researcher & Designer',
    company_name: 'Canva',
    location_raw: 'Sydney, Australia',
    employment_type: 'full-time',
    seniority: 'mid',
    source: 'Remotive',
    source_job_url: 'https://canva.com/careers',
    published_at: '2024-01-10T08:30:00Z',
    description_html: `
      <p>Combine user research and design to create intuitive creative tools used by millions. Help democratize design through research-driven product decisions.</p>
      <h3>Responsibilities:</h3>
      <ul>
        <li>Plan and conduct user research studies</li>
        <li>Design user interfaces based on research insights</li>
        <li>Create user journey maps and personas</li>
        <li>Collaborate with product managers and engineers</li>
      </ul>
    `,
    discipline_tags: ['User Research', 'Product Design', 'Creative Tools', 'Data Analysis'],
    featured: false,
    salary_min: 90000,
    salary_max: 120000,
    currency: 'AUD'
  }),

  createMockJob({
    id: 'mock-007',
    title: 'Motion Graphics Designer',
    company_name: 'Netflix',
    location_raw: 'Los Angeles, USA',
    employment_type: 'contract',
    seniority: 'mid',
    source: 'JSearch',
    source_job_url: 'https://netflix.com/jobs',
    published_at: '2024-01-09T13:15:00Z',
    description_html: `
      <p>Create engaging motion graphics for Netflix's global content and marketing campaigns. Work with world-class creative teams on projects seen by millions.</p>
      <h3>Key projects:</h3>
      <ul>
        <li>Title sequences and promotional content</li>
        <li>Social media animations and GIFs</li>
        <li>Interactive motion graphics for apps</li>
        <li>Brand campaigns and event materials</li>
      </ul>
    `,
    discipline_tags: ['Motion Graphics', 'Animation', 'Entertainment', 'Social Media'],
    featured: true,
    salary_min: 80000,
    salary_max: 110000,
    currency: 'USD'
  }),

  createMockJob({
    id: 'mock-008',
    title: 'Design System Designer',
    company_name: 'Atlassian',
    location_raw: 'Remote - APAC',
    employment_type: 'full-time',
    seniority: 'senior',
    source: 'JSearch',
    source_job_url: 'https://atlassian.com/careers',
    published_at: '2024-01-08T10:45:00Z',
    description_html: `
      <p>Scale design across Atlassian's suite of productivity tools. Build components and patterns used by teams around the world to create better software.</p>
      <h3>Impact areas:</h3>
      <ul>
        <li>Maintain and evolve the Atlassian Design System</li>
        <li>Create reusable components for Jira, Confluence, and more</li>
        <li>Establish design standards and guidelines</li>
        <li>Support product teams with implementation</li>
      </ul>
    `,
    discipline_tags: ['Design Systems', 'Component Libraries', 'Productivity Tools', 'Scalability'],
    featured: false,
    salary_min: 110000,
    salary_max: 150000,
    currency: 'AUD'
  }),

  createMockJob({
    id: 'mock-009',
    title: 'UI Designer - Mobile Apps',
    company_name: 'Spotify',
    location_raw: 'Stockholm, Sweden',
    employment_type: 'full-time',
    seniority: 'mid',
    source: 'JSearch',
    source_job_url: 'https://spotify.com/careers',
    published_at: '2024-01-07T15:20:00Z',
    description_html: `
      <p>Design beautiful mobile interfaces for the world's most popular music streaming platform. Create experiences that help users discover and enjoy music.</p>
      <h3>You'll work on:</h3>
      <ul>
        <li>Mobile app interface design</li>
        <li>Music discovery and recommendation features</li>
        <li>Podcast and video experiences</li>
        <li>Cross-platform design consistency</li>
      </ul>
    `,
    discipline_tags: ['Mobile UI', 'Music', 'Entertainment', 'Cross-platform'],
    featured: false,
    salary_min: 60000,
    salary_max: 80000,
    currency: 'SEK'
  }),

  createMockJob({
    id: 'mock-010',
    title: 'Design Intern',
    company_name: 'Adobe',
    location_raw: 'San Jose, USA',
    employment_type: 'part-time',
    seniority: 'intern',
    source: 'JSearch',
    source_job_url: 'https://adobe.com/careers',
    published_at: '2024-01-06T12:00:00Z',
    description_html: `
      <p>Join Adobe's design team for a summer internship focused on creative tools and user experience. Learn from industry experts while contributing to products used by millions of creatives.</p>
      <h3>Internship highlights:</h3>
      <ul>
        <li>Work on real Adobe Creative Cloud projects</li>
        <li>Mentorship from senior designers</li>
        <li>Access to design workshops and training</li>
        <li>Opportunity to present work to leadership</li>
      </ul>
    `,
    discipline_tags: ['Internship', 'Creative Tools', 'Learning', 'Mentorship'],
    featured: false,
    salary_min: 25,
    salary_max: 35,
    currency: 'USD' // Hourly rate
  })
]

/**
 * Get mock jobs with optional filtering
 */
export function getMockJobs(count?: number): JobData[] {
  if (count) {
    return MOCK_JOBS.slice(0, count)
  }
  return MOCK_JOBS
}

/**
 * Get mock job by ID
 */
export function getMockJobById(id: string): JobData | undefined {
  return MOCK_JOBS.find(job => job.id === id)
} 
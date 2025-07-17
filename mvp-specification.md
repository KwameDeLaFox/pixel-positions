# PixelPositions – MVP Specification (v0.2)

---

## 1. Goal

Create a minimalist, *strictly functional* web app that curates design-focused job listings, letting designers quickly browse, filter, and click through to the original hiring site.

---

## 2. Key User Stories

| ID | As a…          | I want to…                                              | So that…                                  |
| -- | -------------- | ------------------------------------------------------- | ----------------------------------------- |
| U1 | Designer       | Scroll a feed of design jobs                            | I can spot roles that interest me fast    |
| U2 | Designer       | Filter jobs by location, seniority, contract type, etc. | I only see relevant listings              |
| U3 | Designer       | Click a job to view full details inside the app         | I evaluate fit without leaving            |
| U4 | Designer       | Click a clear "Apply on Company Site" CTA               | I can apply with minimal friction         |


---

## 3. Core UX Flow (MVP)

```
Landing → Keyword search input + Location filters  ⇢  Paginated job list ⇢  Detail view (drawer or page) ⇢  Apply button
```

* **Left sidebar**: keyword search at the top, followed by location and other filters.
* **Main pane**: card-style job list (logo, title, company, posted-ago, location) with pagination.
* **Mobile**: filters hidden behind a collapsible drawer or modal.

---

## 4. Data & Schema (Updated)

### Job Object

| Field                     | Type      | Required | Notes                                                     |
| ------------------------- | --------- | -------- | --------------------------------------------------------- |
| id                        | string    | ✔        | UUID/slug                                                 |
| title                     | string    | ✔        | "Senior Product Designer"                                 |
| seniority                 | enum      | ✔        | intern / junior / mid / senior / lead                     |
| company\_name             | string    | ✔        |                                                           |
| company\_logo\_url        | string    |          | fallback placeholder                                      |
| description\_html         | text      | ✔        | Markdown/HTML                                             |
| location\_raw             | string    | ✔        | e.g. "Remote – EU" (original from API)                    |
| location\_city            | string    |          | parsed: "London"                                          |
| location\_country         | string    |          | parsed: "United Kingdom"                                  |
| location\_region          | enum      |          | EMEA / Americas / APAC / Worldwide                        |
| remote                    | boolean   |          |                                                           |
| discipline\_tags          | string\[] |          | array of tags ("Product", "Motion", "Illustration", etc.) |
| employment\_type          | enum      | ✔        | full‑time / part‑time / contract / freelance              |
| salary\_min / salary\_max | int       |          | annual USD                                                |
| currency                  | string    |          |                                                           |
| source                    | enum      | ✔        | Remotive / JSearch                                        |
| source\_job\_url          | string    | ✔        | external CTA                                              |
| published\_at             | datetime  | ✔        |                                                           |
| expires\_at               | datetime  |          | auto-expire 60 days after `published_at`                  |
| featured                  | boolean   |          | highlight important jobs in UI                            |

### Filter Params (v1)

* Keyword input (simple string matching for MVP)
* Location filters:
  - Region dropdown (Worldwide, EMEA, Americas, APAC)
  - Country multi-select (top 10-15 countries)
  - Remote only toggle (enabled by default)
* Employment type checkboxes
* Seniority level checkboxes

---

## 5. Data Ingestion & APIs

| API                               | Why use it?                                                                                                                           | Notes                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Remotive Jobs Public API**      | Free remote jobs; categorised; JSON; no auth required                                                                                 | Endpoint: `https://remotive.com/api/remote-jobs?category=design`                                                                                   |
| **JSearch (OpenWeb Ninja) API**   | Aggregated jobs from Google for Jobs, LinkedIn, Indeed, Glassdoor, ZipRecruiter—JSON search endpoint; increased plan for higher limits | `https://api.openwebninja.com/v1/job-search`; Bearer key via RapidAPI; filters: `query`, `location`, `employmentType`, `datePosted`, `remote=TRUE` |

### Error Handling Strategy
- If an API source fails, gracefully hide that source from results
- Show a subtle notification if major sources are unavailable
- Implement fallback to cached data when possible

### Data Deduplication Strategy
- **Primary matching**: `title` + `company_name` + `location_country` (fuzzy matching with ~85% similarity)
- **Secondary checks**: Published date within 7 days, similar salary ranges
- **Preference order**: JSearch > Remotive

---

## 6. Tech Stack

| Layer     | Choice                                   | Rationale                               |
| --------- | ---------------------------------------- | --------------------------------------- |
| Front‑end | **Next.js 14 (App Router) + React**      | SEO friendly; easy API routes           |
| Styling   | **Tailwind CSS + shadcn/ui components**  | Rapid UI + consistent design system     |
| State/UI  | React Query (TanStack Query)             | Caching + error handling + pagination  |
| Back‑end  | **Next.js API routes** (v1) → Node tasks | Keep mono‑repo simple                   |
| Hosting   | Vercel                                   | Fast deploy; preview URLs               |
| Database  | **PostgreSQL** (v2) via Neon/Supabase    | Structured data + full-text search     |

---

## 7. MVP Milestones

### Phase 1: Foundation (Week 1)
1. **Scaffold Next.js project** w/ Tailwind + shadcn/ui components
2. **Create static mocked data** and implement basic job list UI
3. **Implement core filtering** (location, employment type, seniority) - client-side

### Phase 2: Live Data (Week 2)
4. **Integrate Remotive API** (simplest, no auth) → live data with pagination
5. **Add location parsing logic** for better filtering
6. **Implement job detail view** (modal/drawer) with CTA button

### Phase 3: Multi-Source (Week 3)
7. **Add JSearch API integration** with error handling
8. **Implement deduplication logic**

### Phase 4: Production (Week 4)
10. **Implement pagination** (20 jobs per page)
11. **Add loading states and error boundaries**
12. **Mobile responsive design** + filter drawer
13. **Deploy to production domain**

### Phase 5: Polish (Week 5)
14. **SEO optimization** (meta tags, structured data)
15. **Performance optimization** (image optimization, caching)
16. **Analytics implementation** (job views, click-through rates)

---

## 8. Location Handling Implementation

### Parsing Strategy
```javascript
// Simple location parsing approach
function parseLocation(locationRaw) {
  const patterns = {
    remote: /remote|anywhere|worldwide/i,
    country: /(?:^|\s)(USA?|UK|United Kingdom|Germany|France|Canada|Australia|Netherlands|Sweden|Denmark|Norway|Finland|Ireland|Switzerland|Austria|Spain|Italy|Poland|Czech Republic|Portugal|Belgium)(?:\s|$)/i,
    region: {
      'Americas': ['USA', 'US', 'Canada', 'Mexico', 'Brazil', 'Argentina'],
      'EMEA': ['UK', 'United Kingdom', 'Germany', 'France', 'Netherlands', 'Sweden', 'Denmark', 'Norway', 'Finland', 'Ireland', 'Switzerland', 'Austria', 'Spain', 'Italy', 'Poland', 'Czech Republic', 'Portugal', 'Belgium'],
      'APAC': ['Australia', 'Singapore', 'Japan', 'South Korea', 'India', 'New Zealand']
    }
  }
  
  // Implementation details...
}
```

### Filter UI
- **Region**: Dropdown with "All Regions", "Americas", "EMEA", "APAC"
- **Country**: Multi-select with most common countries (based on job volume)
- **Remote**: Toggle switch (default: ON)

---

## 9. Future Enhancements (beyond v1)

* Database migration for better performance and search

* Email/Slack job alerts with frequency preferences
* Saved jobs & user authentication (Clerk/Auth.js)
* Advanced filters: salary range slider, discipline tag grouping, visa sponsorship

* Full-text search with PostgreSQL or Elasticsearch
* Company profiles and job posting API for employers

---

## 10. Success Metrics (MVP)

* **Traffic**: 1,000+ monthly active users
* **Engagement**: Average 3+ job views per session
* **Conversion**: 15%+ click-through rate to external job applications
* **Content**: 200+ fresh jobs available at any time
* **Performance**: <2s page load time, 99.5% uptime

---

*Last updated: [Current Date]*  
*Version: 0.2* 
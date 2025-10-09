# Marketing Portal - Implementation Tasks

## Summary
- Total database views available: 60
- Currently implemented features: 6
- Missing features: 5+
- Coverage: ~85% (marketing portal is simpler, mostly content-driven)

## Context

The marketing portal `app/(marketing)/` is primarily a public-facing website with static/dynamic content pages. It has less interaction with database views compared to authenticated portals. Most functionality is content-driven rather than data-driven.

## CRITICAL Priority Tasks

### Salon Directory/Search (Public)
**Database View**: `salons`, `salon_locations`, `services`
**Schema**: `organization.salons`
**Missing Operations**:
- [ ] Public salon directory/search
- [ ] Browse salons by city/state
- [ ] Browse salons by services offered
- [ ] View salon profiles (public)
- [ ] Public salon ratings/reviews

**Related Database Functions**:
- `public.search_salons(search_term, city, state, is_verified_filter, limit_count)` - Advanced salon search
- `engagement.get_salon_rating_stats(p_salon_id)` - Get rating statistics

**Implementation Steps**:
1. Create feature: `features/marketing/salon-directory/`
2. Add public salon search
3. Create salon directory grid/list view
4. Add location-based search
5. Implement service-based filtering
6. Create public salon profile view
7. Add page: `app/(marketing)/salons/page.tsx`
8. Add detail page: `app/(marketing)/salons/[slug]/page.tsx`

**Data Relationships to Surface**:
- Salons → locations
- Salons → services offered
- Salons → public ratings
- Salons → photos/media
- Salons → contact information

---

## HIGH Priority Tasks

### Service Categories Browse (Public)
**Database View**: `services`, `service_categories_view`
**Schema**: `catalog.services`, `catalog.service_categories`
**Missing Operations**:
- [ ] Browse services directory
- [ ] View services by category
- [ ] Service popularity/trending
- [ ] Find salons by service type
- [ ] Service information/descriptions

**Related Database Functions**:
- `catalog.search_services_optimized(search_query, p_salon_id)` - Service search
- `catalog.search_services_fulltext(search_query, p_salon_id)` - Full-text search

**Implementation Steps**:
1. Create feature: `features/marketing/services-directory/`
2. Add services browse page
3. Create category navigation
4. Add service detail pages
5. Link to salons offering each service
6. Create page: `app/(marketing)/services/page.tsx`
7. Add category pages: `app/(marketing)/services/[category]/page.tsx`

**Data Relationships to Surface**:
- Services → categories
- Services → salons offering
- Services → average pricing
- Services → popularity

---

### Blog/Resources
**Database View**: N/A (content management)
**Schema**: N/A (could be CMS or markdown)
**Missing Operations**:
- [ ] Blog listing page
- [ ] Blog post detail pages
- [ ] Resources/guides section
- [ ] Beauty tips/articles
- [ ] Search blog content

**Implementation Steps**:
1. Create feature: `features/marketing/blog/`
2. Set up content source (CMS, markdown, or database)
3. Create blog listing page
4. Add blog post template
5. Implement blog search
6. Add page: `app/(marketing)/blog/page.tsx`
7. Add detail page: `app/(marketing)/blog/[slug]/page.tsx`

**Data Relationships to Surface**:
- Posts → categories/tags
- Posts → author
- Posts → published date
- Posts → related posts

---

### Location/City Pages
**Database View**: `salon_locations`, `location_addresses`
**Schema**: `organization.salon_locations`
**Missing Operations**:
- [ ] City landing pages
- [ ] Browse salons by location
- [ ] Location-specific content
- [ ] Nearby salons map
- [ ] Popular services in area

**Implementation Steps**:
1. Create feature: `features/marketing/locations/`
2. Generate city landing pages
3. Add location-based salon listings
4. Implement map integration
5. Add local SEO content
6. Create pages: `app/(marketing)/locations/[city]/page.tsx`

**Data Relationships to Surface**:
- Locations → salons
- Locations → coordinates
- Locations → popular services
- Locations → reviews

---

## MEDIUM Priority Tasks

### Testimonials/Success Stories
**Database View**: `salon_reviews`
**Schema**: `engagement.salon_reviews`
**Missing Operations**:
- [ ] Featured testimonials
- [ ] Success stories
- [ ] Before/after galleries
- [ ] Customer stories

**Implementation Steps**:
1. Create feature: `features/marketing/testimonials/`
2. Curate featured reviews
3. Create testimonials showcase
4. Add success stories section
5. Implement before/after gallery
6. Add to homepage/about pages

**Data Relationships to Surface**:
- Reviews → featured/curated
- Reviews → customer stories
- Reviews → photos/media

---

### Newsletter/Email Signup
**Database View**: N/A (email service integration)
**Schema**: Could use `communication.notifications`
**Missing Operations**:
- [ ] Newsletter signup form
- [ ] Email subscription management
- [ ] Welcome email automation
- [ ] Newsletter archive

**Implementation Steps**:
1. Create feature: `features/marketing/newsletter/`
2. Add signup form component
3. Integrate with email service (e.g., SendGrid, Mailchimp)
4. Create subscription confirmation
5. Add newsletter archive page
6. Implement unsubscribe flow

**Data Relationships to Surface**:
- Subscribers → email
- Subscribers → preferences
- Subscribers → subscription date

---

## LOW Priority Tasks

### Careers/Jobs
**Database View**: N/A (could be external or simple table)
**Schema**: Could create `organization.job_listings`
**Missing Operations**:
- [ ] Job listings page
- [ ] Job detail pages
- [ ] Job application form
- [ ] Filter jobs by location/type

**Implementation Steps**:
1. Create feature: `features/marketing/careers/`
2. Add job listings page
3. Create job detail template
4. Implement application form
5. Add filtering
6. Create pages: `app/(marketing)/careers/page.tsx`

**Data Relationships to Surface**:
- Jobs → location
- Jobs → type (full-time, part-time)
- Jobs → department
- Jobs → posted date

---

### Press/Media Kit
**Database View**: N/A (static content)
**Schema**: N/A
**Missing Operations**:
- [ ] Press releases
- [ ] Media kit downloads
- [ ] Company information
- [ ] Press contact

**Implementation Steps**:
1. Create feature: `features/marketing/press/`
2. Add press page
3. Create media kit download
4. Add company logos/assets
5. Create page: `app/(marketing)/press/page.tsx`

**Data Relationships to Surface**:
- Press releases → date
- Assets → download links

---

### Sitemap/SEO
**Database View**: All public content
**Schema**: Multiple
**Missing Operations**:
- [ ] Dynamic sitemap generation
- [ ] SEO metadata management
- [ ] Schema markup
- [ ] OpenGraph tags

**Implementation Steps**:
1. Enhance existing `app/sitemap.ts`
2. Add dynamic routes for salons
3. Add service pages to sitemap
4. Implement schema markup
5. Add comprehensive metadata

**Data Relationships to Surface**:
- All public pages → sitemap
- Pages → SEO metadata
- Pages → schema markup

---

## Quick Wins
Tasks that are easy to implement with high impact:

- [ ] **Salon Count on Homepage** - Display "X salons on platform" using count query
- [ ] **Service Count Badge** - Show "Browse X+ services" on homepage
- [ ] **Featured Salons Carousel** - Display top-rated salons on homepage
- [ ] **Location Dropdown** - Add city selector in header for quick salon search
- [ ] **Popular Services Widget** - Show trending services on homepage

---

## Database Functions Not Exposed

Marketing-relevant functions available but not utilized:

### Search Functions
- `public.search_salons(search_term, city, state, is_verified_filter, limit_count)` - Advanced salon search
- `public.text_similarity(text1, text2)` - Fuzzy matching for search
- `catalog.search_services_optimized(search_query, p_salon_id)` - Service search
- `catalog.search_services_fulltext(search_query, p_salon_id)` - Full-text service search

### Rating/Review Functions
- `engagement.get_salon_rating_stats(p_salon_id)` - Detailed rating statistics

### Analytics Functions (Public Metrics)
- Could create public-facing analytics for transparency:
  - Total salons on platform
  - Total appointments booked
  - Total services offered
  - Cities/locations covered

**Potential Uses**:
- Build robust public salon search
- Implement auto-suggest/fuzzy search
- Display platform statistics on homepage
- Create service discovery tools
- Add location-based recommendations

---

## Notes

The marketing portal is intentionally lighter on database integration compared to authenticated portals. Most of its content is:
- Static pages (About, Contact, Terms, Privacy, FAQ)
- Content marketing (Blog, guides, resources)
- Public-facing discovery (Salon directory, services)
- Lead generation (Newsletter, contact forms)

The main gaps are:
1. **Public Salon Directory** - Critical for SEO and user acquisition
2. **Service Discovery** - Help users find what they need
3. **Content Marketing** - Blog/resources for SEO and engagement
4. **Location Pages** - Local SEO and targeted marketing
5. **Social Proof** - Testimonials and success stories

These features would significantly improve:
- SEO and organic traffic
- User acquisition and conversion
- Trust and credibility
- Local market penetration

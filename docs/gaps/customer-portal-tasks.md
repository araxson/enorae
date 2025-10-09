# Customer Portal - Implementation Tasks

## Summary
- Total database views available: 60
- Currently implemented features: 11
- Missing features: 15+
- Coverage: ~45% of customer-relevant functionality

## CRITICAL Priority Tasks

### Manual Transactions Management
**Database View**: `manual_transactions`
**Schema**: `scheduling.manual_transactions`
**Missing Operations**:
- [ ] List/Index view of all transactions
- [ ] Detail/Show view for specific transaction
- [ ] Create manual transaction operation
- [ ] Update transaction details
- [ ] Delete/void transaction

**Related Database Functions**:
- N/A (view-based)

**Implementation Steps**:
1. Create feature structure: `features/customer/transactions/`
2. Add queries file: `api/queries.ts` with auth check
3. Add mutations file: `api/mutations.ts` with server actions
4. Create components: `components/transactions-list.tsx`
5. Create page: `app/(customer)/customer/transactions/page.tsx`
6. Add navigation link to sidebar

**Data Relationships to Surface**:
- Appointments → one-to-many
- Services → many-to-many through appointments
- Salon → many-to-one

---

### Session Management (View-Only)
**Database View**: `sessions`
**Schema**: `identity.sessions`
**Missing Operations**:
- [ ] List/Index view of active sessions
- [ ] Show session details (location, device, browser)
- [ ] Revoke/terminate session operation

**Related Database Functions**:
- `identity.update_session_active_status()` - Trigger for status updates
- `identity.update_last_seen()` - Track session activity

**Implementation Steps**:
1. Feature exists at `features/shared/sessions/` but needs customer view
2. Create customer-specific component in `features/customer/sessions/`
3. Add page route: `app/(customer)/customer/settings/sessions/page.tsx` (exists but needs implementation)
4. Surface session metadata (IP, browser, device, last_active)
5. Add revoke session mutation

**Data Relationships to Surface**:
- User → one-to-many sessions
- Security events → related activity logs

---

### Blocked Times Visibility
**Database View**: `blocked_times`
**Schema**: `scheduling.blocked_times`
**Missing Operations**:
- [x] List/Index view (partially exists in booking flow)
- [ ] Show why a time slot is blocked (reason/notes)
- [ ] Calendar visualization of blocked times

**Related Database Functions**:
- `public.can_manage_blocked_times()` - Permission check
- `scheduling.check_staff_availability()` - Uses blocked times

**Implementation Steps**:
1. Enhance booking feature to show blocked time reasons
2. Add calendar component showing availability/blocked times
3. Display staff unavailability in salon detail view
4. Add filters for date range selection

**Data Relationships to Surface**:
- Staff → blocked times
- Salon → staff → blocked times
- Time ranges → visual calendar

---

## HIGH Priority Tasks

### Customer Metrics Dashboard
**Database View**: `daily_metrics`
**Schema**: `analytics.daily_metrics`
**Missing Operations**:
- [ ] Personal spending analytics
- [ ] Appointment frequency metrics
- [ ] Favorite services analysis
- [ ] Loyalty points tracking

**Related Database Functions**:
- `analytics.calculate_customer_metrics()` - Customer analytics
- `analytics.calculate_customer_visit_stats()` - Visit patterns
- `analytics.calculate_customer_service_stats()` - Service preferences
- `analytics.calculate_customer_review_stats()` - Review metrics
- `analytics.calculate_customer_rates()` - Customer rates
- `analytics.calculate_customer_favorite_staff()` - Staff preferences
- `analytics.calculate_avg_days_between_visits()` - Visit frequency

**Implementation Steps**:
1. Create feature: `features/customer/analytics/`
2. Create analytics dashboard component
3. Use existing database functions for metrics
4. Add charts (spending over time, visit frequency)
5. Create page: `app/(customer)/customer/analytics/page.tsx`
6. Add to navigation

**Data Relationships to Surface**:
- Appointments → spending analysis
- Services → service preferences
- Reviews → rating patterns
- Visit frequency → loyalty metrics

---

### Salon Chains Discovery
**Database View**: `salon_chains`, `salon_chains_view`, `salon_chains_summary`
**Schema**: `organization.salon_chains`
**Missing Operations**:
- [ ] Browse salon chains
- [ ] View all locations in a chain
- [ ] Compare chain pricing across locations
- [ ] See chain-wide reviews/ratings

**Related Database Functions**:
- N/A (view-based)

**Implementation Steps**:
1. Create feature: `features/customer/chains/`
2. Add queries for chain listings
3. Create chain detail component showing all locations
4. Add to salon discovery filters (chain vs independent)
5. Create page: `app/(customer)/customer/chains/page.tsx`
6. Integrate with existing salon search

**Data Relationships to Surface**:
- Chain → salons (one-to-many)
- Locations → aggregated metrics
- Chain-wide ratings

---

### Service Categories Browse
**Database View**: `service_categories_view`
**Schema**: `catalog.service_categories`
**Missing Operations**:
- [ ] Browse services by category
- [ ] Filter salons by category offerings
- [ ] Category-based search
- [ ] Popular categories display

**Related Database Functions**:
- N/A (view-based)

**Implementation Steps**:
1. Enhance `features/customer/discovery/` with category filters
2. Add category-based navigation
3. Create category landing pages
4. Show category hierarchy (path)
5. Add to search filters

**Data Relationships to Surface**:
- Categories → services (one-to-many)
- Category path → hierarchy
- Salons → categories offered

---

### Staff Profiles Detailed View
**Database View**: `staff_profiles`, `staff`
**Schema**: `organization.staff`, `identity.profile_metadata`
**Missing Operations**:
- [ ] View staff portfolio/gallery
- [ ] View staff specialties
- [ ] View staff certifications/bio
- [ ] Book directly with favorite staff
- [ ] Staff rating/reviews

**Related Database Functions**:
- `analytics.calculate_customer_favorite_staff()` - Find favorite staff

**Implementation Steps**:
1. Create feature: `features/customer/staff-profiles/`
2. Add staff detail page with full profile
3. Surface profile_metadata (portfolio, certifications)
4. Add staff-specific booking flow
5. Create page: `app/(customer)/customer/staff/[id]/page.tsx`
6. Link from salon detail page

**Data Relationships to Surface**:
- Staff → profile_metadata (portfolio, interests)
- Staff → services offered
- Staff → schedules/availability
- Staff → reviews/ratings
- Customer → favorite staff

---

## MEDIUM Priority Tasks

### Appointment Services Detail
**Database View**: `appointment_services`
**Schema**: `scheduling.appointment_services`
**Missing Operations**:
- [ ] View itemized services in appointment
- [ ] See individual service pricing
- [ ] View service add-ons separately

**Implementation Steps**:
1. Enhance `features/customer/appointments/` to show service breakdown
2. Add itemized pricing display
3. Show duration per service
4. Add to appointment detail dialog

**Data Relationships to Surface**:
- Appointment → services (many-to-many)
- Service → pricing
- Service → duration

---

### Product Usage Transparency
**Database View**: `product_usage`, `service_product_usage`
**Schema**: `catalog.service_product_usage`
**Missing Operations**:
- [ ] See what products were used in services
- [ ] Product recommendations based on usage
- [ ] Purchase products used in salon

**Implementation Steps**:
1. Add to appointment detail view
2. Show products used per service
3. Link to product purchase (future enhancement)
4. Add to appointment history

**Data Relationships to Surface**:
- Service → products used
- Appointment → products used
- Products → availability for purchase

---

### Operating Hours Visibility
**Database View**: `operating_hours`
**Schema**: `organization.operating_hours`
**Missing Operations**:
- [ ] Display salon hours prominently
- [ ] Show special/holiday hours
- [ ] Indicate closed days
- [ ] Show hours by day of week

**Implementation Steps**:
1. Enhance `features/customer/salon-detail/` with hours display
2. Add hours widget to salon cards
3. Show upcoming special dates/closures
4. Add to booking flow (prevent booking during closed times)

**Data Relationships to Surface**:
- Salon → operating hours
- Special dates → overrides
- Day of week → hours pattern

---

### User Roles Display
**Database View**: `user_roles`
**Schema**: `identity.user_roles`
**Missing Operations**:
- [ ] Show user's active roles
- [ ] Display role-based features available
- [ ] Role switching (if multiple roles)

**Implementation Steps**:
1. Add to profile settings
2. Show role badges
3. Display role-specific permissions
4. Add role selector if user has multiple roles

**Data Relationships to Surface**:
- User → roles (many-to-many)
- Role → permissions
- Role → portal access

---

### Salon Contact Details
**Database View**: `salon_contact_details`
**Schema**: `organization.salon_contact_details`
**Missing Operations**:
- [ ] Display primary phone/email prominently
- [ ] Show social media links
- [ ] Display website link
- [ ] Contact salon button (call/email)

**Implementation Steps**:
1. Enhance `features/customer/salon-detail/` with contact section
2. Add click-to-call/email buttons
3. Show social media icons with links
4. Add to salon cards (phone number)

**Data Relationships to Surface**:
- Salon → contact details (one-to-one)
- Contact methods → actions (call, email, visit website)

---

### Salon Descriptions/About
**Database View**: `salon_descriptions`
**Schema**: `organization.salon_descriptions`
**Missing Operations**:
- [ ] Display full salon description
- [ ] Show amenities/specialties
- [ ] Display awards/certifications
- [ ] Show before/after examples

**Implementation Steps**:
1. Enhance `features/customer/salon-detail/` with about section
2. Show full description with formatting
3. Display amenities as icons/badges
4. Add specialties tags

**Data Relationships to Surface**:
- Salon → description (one-to-one)
- Description → formatted content
- Amenities → visual display

---

### Salon Media Gallery
**Database View**: `salon_media`, `salon_media_view`
**Schema**: `organization.salon_media`
**Missing Operations**:
- [ ] View salon photo gallery
- [ ] See before/after photos
- [ ] View video content
- [ ] Filter media by type (interior, work samples, etc.)

**Implementation Steps**:
1. Enhance `features/customer/salon-detail/` with media gallery
2. Add lightbox/carousel for photos
3. Categorize media (facility, work, team)
4. Add video player support

**Data Relationships to Surface**:
- Salon → media (one-to-many)
- Media → type/category
- Media → display_order

---

## LOW Priority Tasks

### Location Addresses Detail
**Database View**: `location_addresses`
**Schema**: `organization.location_addresses`
**Missing Operations**:
- [ ] Show formatted address with map
- [ ] Display location notes/instructions
- [ ] Show parking information
- [ ] Directions link

**Implementation Steps**:
1. Enhance salon detail with location section
2. Add map integration
3. Show formatted address
4. Add directions button

**Data Relationships to Surface**:
- Salon location → address (one-to-one)
- Address → coordinates (for map)

---

### Profiles Metadata (Personal Preferences)
**Database View**: `profiles_metadata`
**Schema**: `identity.profile_metadata`
**Missing Operations**:
- [ ] View/edit personal interests
- [ ] Manage portfolio (if applicable)
- [ ] Set preferred styles/aesthetics
- [ ] Upload profile photos

**Implementation Steps**:
1. Enhance `features/customer/profile/` with metadata management
2. Add interests/preferences editor
3. Allow profile photo upload
4. Save preferences for better recommendations

**Data Relationships to Surface**:
- Profile → metadata (one-to-one)
- Interests → service recommendations
- Preferences → matching algorithms

---

### Profiles Preferences
**Database View**: `profiles_preferences`
**Schema**: `identity.profile_preferences`
**Missing Operations**:
- [ ] Notification preferences management
- [ ] Communication channel preferences
- [ ] Privacy settings
- [ ] Accessibility preferences

**Implementation Steps**:
1. Page exists: `app/(customer)/customer/settings/preferences/page.tsx`
2. Implement full preferences management
3. Add granular notification controls
4. Save preference changes

**Data Relationships to Surface**:
- Profile → preferences (one-to-one)
- Notification channels → settings
- Privacy controls → data visibility

---

## Quick Wins
Tasks that are easy to implement with high impact:

- [ ] **Operating Hours Display** - Simply query and display existing view data on salon cards
- [ ] **Contact Details** - Add click-to-call/email buttons using existing contact view
- [ ] **Salon Media Gallery** - Display existing media in a carousel component
- [ ] **Service Categories Filter** - Add category-based filtering to existing search
- [ ] **Appointment Services Breakdown** - Show itemized services in existing appointment detail

---

## Database Functions Not Exposed

Customer-relevant functions available but not called from frontend:

### Analytics Functions
- `analytics.calculate_customer_metrics(p_customer_id, p_salon_id)` - Calculate comprehensive customer metrics
- `analytics.calculate_customer_visit_stats(p_customer_id, p_salon_id)` - Get visit patterns and stats
- `analytics.calculate_customer_service_stats(p_customer_id, p_salon_id)` - Analyze service preferences
- `analytics.calculate_customer_review_stats(p_customer_id, p_salon_id)` - Review statistics
- `analytics.calculate_customer_rates(p_customer_id, p_salon_id)` - Calculate customer rates
- `analytics.calculate_customer_favorite_staff(p_customer_id, p_salon_id)` - Determine favorite staff member
- `analytics.calculate_avg_days_between_visits(p_customer_id, p_salon_id)` - Visit frequency analysis

### Search Functions
- `public.search_salons(search_term, city, state, is_verified_filter, limit_count)` - Advanced salon search
- `public.text_similarity(text1, text2)` - Fuzzy text matching for better search
- `catalog.search_services_optimized(search_query, p_salon_id)` - Optimized service search
- `catalog.search_services_fulltext(search_query, p_salon_id)` - Full-text service search

### Engagement Functions
- `engagement.get_salon_rating_stats(p_salon_id)` - Detailed rating statistics
- `communication.get_unread_count(p_user_id)` - Get unread message count
- `communication.get_unread_counts(p_user_id)` - Get unread counts by type

### Validation Functions
- `catalog.validate_coupon(p_coupon_code, p_salon_id, p_customer_id, p_amount)` - Coupon validation
- `scheduling.check_staff_availability(p_staff_id, p_start_time, p_end_time, p_exclude_appointment_id)` - Real-time availability

### Loyalty/Referral Functions
- `engagement.process_appointment_loyalty()` - Process loyalty points (trigger, but could be exposed as status)

**Potential Uses**:
- Build customer analytics dashboard using analytics functions
- Improve search with advanced search functions
- Add coupon support to booking flow
- Display detailed rating stats on salon pages
- Show real-time availability using availability check functions
- Surface loyalty points and rewards status

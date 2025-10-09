# Business Portal - Implementation Tasks

## Summary
- Total database views available: 60
- Currently implemented features: 35+
- Missing features: 8+
- Coverage: ~75% of business-relevant functionality

## CRITICAL Priority Tasks

### Salon Chains Management ✅ COMPLETED
**Database View**: `salon_chains`, `salon_chains_view`, `salon_chains_summary`
**Schema**: `organization.salon_chains`
**Implemented Operations**:
- [x] Create/manage chain operations
- [x] View chain-wide analytics
- [x] Manage cross-location inventory (bulk settings)
- [x] Set chain-wide policies
- [x] Bulk operations across locations

**Related Database Functions**:
- `organization.salon_chains_insert()` - Trigger on chain creation
- `organization.salon_chains_update()` - Trigger on chain update
- `organization.salon_chains_delete()` - Trigger on chain deletion

**Implementation Complete**:
1. ✅ Business portal page at `app/(business)/business/chains/page.tsx`
2. ✅ Chain detail page with analytics at `app/(business)/business/chains/[chainId]/page.tsx`
3. ✅ Chain-wide analytics dashboard showing metrics across all locations
4. ✅ Bulk operation tools for settings across locations
5. ✅ Chain create/edit dialogs
6. ✅ Location performance tracking and comparison
7. ✅ Assign salons to chains functionality

**Features Implemented**:
- `features/business/chains/api/queries.ts` - Chain queries and analytics
- `features/business/chains/api/mutations.ts` - CRUD operations and bulk updates
- `features/business/chains/components/` - Complete UI components

**Data Relationships Surfaced**:
- Chain → salons (one-to-many)
- Chain-wide metrics → aggregated data (revenue, appointments, ratings, staff)
- Cross-location reporting and performance comparison

---

### Product Usage Tracking
**Database View**: `product_usage`, `service_product_usage`
**Schema**: `catalog.service_product_usage`, `inventory.product_usage`
**Missing Operations**:
- [x] Track product usage per service
- [x] View usage reports and trends
- [x] Calculate cost per service
- [x] Identify high-usage products
- [x] Optimize inventory based on usage

**Related Database Functions**:
- N/A (view-based, but mutations exist in schema)

**Implementation Steps**:
1. Page exists: `app/(business)/business/services/product-usage/page.tsx`
2. Implement usage tracking dashboard
3. Add usage recording during appointment completion
4. Create reports showing product consumption
5. Link to inventory replenishment

**Data Relationships to Surface**:
- Service → products used
- Product → usage quantity
- Usage → cost analysis
- Usage trends → forecasting

---

### Appointment Services Management
**Database View**: `appointment_services`
**Schema**: `scheduling.appointment_services`
**Missing Operations**:
- [x] View detailed service breakdown per appointment
- [x] Modify services within appointment
- [x] Add services to existing appointments
- [x] Track individual service completion
- [x] Service-level pricing adjustments

**Related Database Functions**:
- `scheduling.link_appointment_services()` - Link services to appointment
- `scheduling.validate_and_calculate_services()` - Validate service data

**Implementation Steps**:
1. Enhance `features/business/appointments/` with service management
2. Add service editor in appointment detail
3. Allow adding/removing services from appointments
4. Track service completion status individually
5. Calculate dynamic pricing

**Data Relationships to Surface**:
- Appointment → services (many-to-many)
- Service → staff assignment
- Service → pricing/duration
- Service → product usage

---

## HIGH Priority Tasks

### Salon Metrics Advanced Analytics
**Database View**: `salon_metrics`, `operational_metrics`
**Schema**: `analytics.salon_metrics`
**Missing Operations**:
- [ ] Real-time performance dashboard
- [ ] Comparative metrics (period over period)
- [ ] Staff performance leaderboards
- [ ] Service popularity analysis
- [ ] Revenue forecasting

**Related Database Functions**:
- `analytics.update_salon_stats()` - Update salon statistics
- `public.get_salon_metrics(p_salon_id)` - Get comprehensive metrics
- `analytics.refresh_service_performance()` - Refresh service analytics

**Implementation Steps**:
1. Feature partially exists at `features/business/metrics/`
2. Add advanced analytics dashboard
3. Create comparative views (this week vs last week)
4. Add forecasting based on trends
5. Surface operational metrics more prominently

**Data Relationships to Surface**:
- Historical metrics → trends
- Staff → performance metrics
- Services → popularity/revenue
- Time periods → comparisons

---

### Coupons Management
**Database View**: None directly (feature exists in schema)
**Schema**: `catalog.coupons`
**Missing Operations**:
- [ ] Create/manage coupons
- [ ] Set coupon rules (min purchase, services, dates)
- [ ] Track coupon usage
- [ ] Analyze coupon effectiveness
- [ ] Bulk coupon generation

**Related Database Functions**:
- `catalog.validate_coupon()` - Validate coupon on use

**Implementation Steps**:
1. Page exists: `app/(business)/business/coupons/page.tsx`
2. Create full coupon management feature
3. Add coupon creation wizard
4. Implement usage tracking
5. Create effectiveness reports
6. Add to booking flow integration

**Data Relationships to Surface**:
- Coupon → usage records
- Coupon → revenue impact
- Coupon → customer acquisition
- Coupon → rules/constraints

---

### Notifications System
**Database View**: None directly (exists in communication schema)
**Schema**: `communication.notifications`, `communication.notification_queue`
**Missing Operations**:
- [ ] View notification history
- [ ] Configure notification templates
- [ ] Set notification preferences per event
- [ ] Test notification delivery
- [ ] View delivery status/failures

**Related Database Functions**:
- `communication.send_notification()` - Send notification to user
- `communication.queue_notification_trigger()` - Queue notification
- `communication.claim_notification_batch()` - Process notification queue
- `communication.complete_notification()` - Mark notification complete
- `communication.fail_notification()` - Mark notification failed

**Implementation Steps**:
1. Page exists: `app/(business)/business/notifications/page.tsx`
2. Create notification management dashboard
3. Add template editor
4. Implement delivery status tracking
5. Add test/preview functionality
6. Configure per-event notification settings

**Data Relationships to Surface**:
- Notification templates → events
- Notifications → delivery status
- Notification → channels (SMS, email, push)
- Failed notifications → retry logic

---

### Pricing Management
**Database View**: None directly (exists via services)
**Schema**: `catalog.service_pricing`
**Missing Operations**:
- [ ] Dynamic pricing configuration
- [ ] Time-based pricing (peak hours)
- [ ] Customer-tier pricing
- [ ] Seasonal pricing strategies
- [ ] Bulk pricing updates

**Related Database Functions**:
- `catalog.apply_dynamic_pricing()` - Apply dynamic pricing logic
- `catalog.calculate_service_price()` - Calculate final service price

**Implementation Steps**:
1. Page exists: `app/(business)/business/pricing/page.tsx`
2. Create pricing strategy manager
3. Add dynamic pricing rule builder
4. Implement pricing calendar (seasonal/event pricing)
5. Add customer segment pricing
6. Create bulk update tools

**Data Relationships to Surface**:
- Service → base pricing
- Pricing rules → adjustments
- Time/date → pricing multipliers
- Customer tier → discounts
- Pricing history → changes over time

---

### Analytics - Customer Insights
**Database View**: None directly (data from multiple sources)
**Schema**: Multiple analytics tables
**Missing Operations**:
- [ ] Customer segmentation
- [ ] Lifetime value analysis
- [ ] Churn prediction
- [ ] Acquisition channel analysis
- [ ] Customer cohort analysis

**Related Database Functions**:
- `analytics.calculate_customer_metrics()` - Customer metrics
- `analytics.calculate_customer_visit_stats()` - Visit patterns
- `analytics.calculate_customer_service_stats()` - Service preferences

**Implementation Steps**:
1. Page exists: `app/(business)/business/analytics/customers/page.tsx`
2. Create customer analytics dashboard
3. Implement segmentation tools
4. Add LTV calculator
5. Create cohort analysis views
6. Add retention/churn metrics

**Data Relationships to Surface**:
- Customer → visit history
- Customer → spending patterns
- Customer → service preferences
- Customer → lifetime value
- Cohorts → retention rates

---

### Analytics - Service Performance
**Database View**: None directly (aggregated from analytics)
**Schema**: `analytics` schema
**Missing Operations**:
- [ ] Service profitability analysis
- [ ] Service popularity trends
- [ ] Service duration accuracy
- [ ] Staff performance by service
- [ ] Service pairing analysis (upsells)

**Related Database Functions**:
- `analytics.refresh_service_performance()` - Refresh service metrics
- `analytics.calculate_daily_service_metrics()` - Daily service metrics

**Implementation Steps**:
1. Page exists: `app/(business)/business/analytics/service-performance/page.tsx`
2. Create service performance dashboard
3. Add profitability calculator (revenue - product cost - time cost)
4. Show service pairing/bundling opportunities
5. Add staff efficiency by service type
6. Create service optimization recommendations

**Data Relationships to Surface**:
- Service → revenue
- Service → product costs
- Service → time/duration
- Service → staff efficiency
- Service pairs → upsell opportunities

---

## MEDIUM Priority Tasks

### Business Insights Dashboard
**Database View**: Aggregated data
**Schema**: Multiple schemas
**Missing Operations**:
- [ ] AI-powered business recommendations
- [ ] Trend detection and alerts
- [ ] Competitive benchmarking
- [ ] Growth opportunity identification
- [ ] Risk/issue early warning

**Implementation Steps**:
1. Page exists: `app/(business)/business/insights/page.tsx`
2. Create insights aggregation system
3. Implement trend detection algorithms
4. Add recommendation engine
5. Create alert system for anomalies
6. Add comparative benchmarks (industry standards)

**Data Relationships to Surface**:
- Historical data → trends
- Metrics → benchmarks
- Patterns → opportunities
- Anomalies → alerts

---

### Salon Account Settings
**Database View**: Multiple (profiles, settings)
**Schema**: `identity`, `organization`
**Missing Operations**:
- [ ] Account tier/subscription management
- [ ] Billing information
- [ ] Payment method management
- [ ] Invoice history
- [ ] Account limits/quotas

**Implementation Steps**:
1. Page exists: `app/(business)/business/settings/account/page.tsx`
2. Implement account management features
3. Add billing/payment integration
4. Show subscription tier and limits
5. Add invoice download
6. Display usage against quotas

**Data Relationships to Surface**:
- Account → subscription tier
- Billing → payment history
- Usage → quotas/limits
- Account → features enabled

---

### Security Audit Logs
**Database View**: `audit_logs`, `security_audit_log`
**Schema**: `identity.audit_logs`, `identity.security_audit_log`
**Missing Operations**:
- [ ] View audit log history
- [ ] Filter by event type
- [ ] Search audit logs
- [ ] Export audit logs
- [ ] Set up audit alerts

**Related Database Functions**:
- `public.audit_trigger_function()` - Generic audit trigger
- `public.log_security_event()` - Log security events

**Implementation Steps**:
1. Add audit log viewer to settings
2. Create filterable audit log table
3. Add export functionality
4. Implement search
5. Create alert rules for suspicious activity

**Data Relationships to Surface**:
- User → actions
- Events → timestamps
- Changes → before/after values
- IP addresses → locations

---

## LOW Priority Tasks

### Transaction History (Manual Transactions)
**Database View**: `manual_transactions`
**Schema**: `scheduling.manual_transactions`
**Missing Operations**:
- [ ] Create manual transactions
- [ ] View transaction history
- [ ] Generate transaction reports
- [ ] Export for accounting

**Implementation Steps**:
1. Page exists: `app/(business)/business/analytics/transactions/page.tsx`
2. Implement transaction management
3. Add transaction creation form
4. Create transaction reports
5. Add export to CSV/PDF

**Data Relationships to Surface**:
- Transactions → appointments
- Transactions → services
- Transactions → totals/taxes

---

### User Roles Management
**Database View**: `user_roles`
**Schema**: `identity.user_roles`
**Missing Operations**:
- [ ] Assign roles to staff
- [ ] Customize role permissions
- [ ] Create custom roles
- [ ] Role audit trail

**Related Database Functions**:
- `identity.update_role_active_status()` - Trigger for role status
- `public.has_role()` - Check user role
- `public.user_has_any_role()` - Check multiple roles

**Implementation Steps**:
1. Create role management feature
2. Add role assignment UI
3. Implement permission customization
4. Add audit logging for role changes

**Data Relationships to Surface**:
- User → roles
- Role → permissions
- Role changes → audit log

---

## Quick Wins
Tasks that are easy to implement with high impact:

- [ ] **Salon Metrics Widget** - Add summary metrics cards to dashboard using existing `get_salon_metrics()` function
- [ ] **Product Usage Link** - Connect service editing to product usage tracking (views exist)
- [ ] **Coupon Code Generator** - Simple coupon creation form using existing validation function
- [ ] **Notification Status** - Display notification delivery status using queue views
- [ ] **Appointment Services Detail** - Show service breakdown in appointment detail (view exists)

---

## Database Functions Not Exposed

Business-relevant functions available but not fully utilized:

### Analytics Functions
- `analytics.calculate_daily_metrics(p_salon_id, p_date)` - Calculate comprehensive daily metrics
- `analytics.calculate_daily_appointment_metrics(p_salon_id, p_date)` - Appointment-specific daily metrics
- `analytics.calculate_daily_customer_metrics(p_salon_id, p_date)` - Customer-specific daily metrics
- `analytics.calculate_daily_service_metrics(p_salon_id, p_date)` - Service-specific daily metrics
- `analytics.refresh_daily_metrics()` - Refresh all daily metrics
- `public.get_salon_metrics(p_salon_id, p_date_from, p_date_to)` - Get metrics for date range

### Service Functions
- `catalog.calculate_service_duration(p_service_id, p_variant_id)` - Calculate actual service duration
- `catalog.get_service_with_details(p_service_id)` - Get service with all related data
- `catalog.update_service_with_version(p_service_id, p_updates, p_expected_version)` - Optimistic locking for updates
- `catalog.apply_dynamic_pricing(p_base_price, p_service_id, p_appointment_time, p_salon_id)` - Dynamic pricing application

### Appointment Functions
- `scheduling.batch_update_appointment_status(p_appointment_ids[], p_new_status, p_reason)` - Bulk status updates
- `scheduling.check_appointment_conflict(p_salon_id, p_staff_id, p_start_time, p_end_time, p_exclude_appointment_id)` - Conflict detection
- `scheduling.check_resource_availability(p_salon_id, p_resource_id, p_start_time, p_end_time, p_exclude_appointment_id)` - Resource booking
- `scheduling.create_appointment_with_services(p_salon_id, p_customer_id, p_staff_id, p_start_time, p_services)` - Full appointment creation
- `scheduling.get_appointment_stats(p_salon_id, p_start_date, p_end_date)` - Appointment statistics

### Inventory Functions
- `inventory.check_availability(p_product_id, p_location_id, p_quantity)` - Check product availability

### Communication Functions
- `communication.send_notification(p_user_id, p_type, p_title, p_message, p_data, p_channels[])` - Send notification
- `communication.mark_notifications_read(p_user_id, p_notification_ids[])` - Bulk mark as read
- `communication.get_unread_counts(p_user_id)` - Get unread counts by type

### Search Functions
- `catalog.search_services_optimized(search_query, p_salon_id)` - Optimized service search
- `catalog.search_services_fulltext(search_query, p_salon_id)` - Full-text service search

**Potential Uses**:
- Build comprehensive analytics dashboard using daily metrics functions
- Implement dynamic pricing UI using pricing functions
- Add bulk appointment operations using batch update functions
- Create resource/room booking system using resource availability
- Improve service search with full-text search functions
- Add inventory availability checks to service booking
- Implement notification center using notification functions
